import type { IVendorRepository } from "../../../../domain/repositories/vendors/IVendorRepository";
import type { IVendorRegisterUseCase } from "../../../interfaces/vendors/IVendorUseCase";
import type { VendorRegisterInputDTO, VendorRegisterOutputDTO } from "../../../dtos/vendors/vendor.dto";
import type { IKeyValueRepository } from "../../../../domain/repositories/key_value/IOtpRepository";
import { IPasswordService } from "../../../services/IPasswordService";
import { generateOtp } from "../../../../utils/generateOtp";
import { OTP_CONFIG } from "../../../../config/otp_config";
import { queueEmail } from "../../../../infrastructure/queues/emailQueue";
import { AppError } from "../../../../utils/errors/AppError";


export class VendorRegisterUseCase implements IVendorRegisterUseCase {
    constructor(
        private _vendorRepository: IVendorRepository,
        private _passwordService: IPasswordService,
        private _keyValueService: IKeyValueRepository
    ){};

    async execute(input: VendorRegisterInputDTO): Promise<VendorRegisterOutputDTO> {
        const { email, ownerName, password, phone, shopName } = input;
        if(!password) throw new AppError("Password is required", 400);
        if(!shopName) throw new AppError("Shop name is required", 400);

        const existing = await this._vendorRepository.findByEmail(email);

        if (existing) throw new AppError("Vendor already exists. Please login.", 409);

        const hashed = await this._passwordService.hash(password);
        const otp = generateOtp();
        const TTL_SECONDS = Math.floor(OTP_CONFIG.EXPIRY_MS / 1000);

        const pendingVendorData = { email, ownerName, password: hashed, phone, shopName };

        const otpExpiresAt = new Date(Date.now() + OTP_CONFIG.EXPIRY_MS);

        await this._keyValueService.set(
            `pending:register:vendor:${email}`,
            JSON.stringify({ ...pendingVendorData, otp }),
            TTL_SECONDS
        );

        try {
            queueEmail({ email, otp });
        } catch (error) {
            throw new AppError(`Failed to send OTP email: ${(error as Error).message}`, 500);
        }
        
        return { email, phone, otpExpiresAt }
    }
}