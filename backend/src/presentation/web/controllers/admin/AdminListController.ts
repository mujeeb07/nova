import { Request, Response } from "express";
import { ListVendorsUseCase } from "../../../../application/use_cases/admin/lists/ListVendorsUseCase";
import { ListUsersUseCase } from "../../../../application/use_cases/admin/lists/ListUsersUseCase";
import { asyncHandlor } from "../../../../utils/errors/asyncHandlor";
import { sendSuccess } from "../../../../utils/apiResponse";
import { parseListQuery } from "../../../../utils/listFilter";
import { UpdateUserStatusUseCase } from "../../../../application/use_cases/admin/lists/UpdateUserStatusUseCase";
import { UpdateStatusDTO } from "../../../../application/dtos/admin/list.dto";
import { UpdateVendorStatusUseCase } from "../../../../application/use_cases/admin/lists/UpdateVendorStatusUseCase";

export class AdminListController {
    constructor(
        private _listVendors: ListVendorsUseCase,
        private _listUsers: ListUsersUseCase,
        private _updateUserStatus: UpdateUserStatusUseCase,
        private _updateVendorStatus: UpdateVendorStatusUseCase
    ){}

    vendors = asyncHandlor(async (req: Request, res: Response) =>
        sendSuccess(res, await this._listVendors.execute(parseListQuery(req.query)), "OK"));

    users = asyncHandlor(async (req: Request, res: Response) => 
        sendSuccess(res, await this._listUsers.execute(parseListQuery(req.query)), "OK" ));

    updateUserStatus = asyncHandlor(async (req: Request, res: Response) => {
        // console.log("Request:::::::::::::::::::::",req.params.userId, req.body.status)
        const dto: UpdateStatusDTO = {
            userId: req.params.userId as string,
            status: req.body.status
        }
        sendSuccess(res, await this._updateUserStatus.execute(dto), "OK");
    });

    updateVendorStatus = asyncHandlor(async (req: Request, res: Response) => {
        const dto: UpdateStatusDTO = {
            userId: req.params.vendorId as string,
            status: req.body.status
        }
        // console.log(`Update vendor DTO: ${dto}`)
        sendSuccess(res, await this._updateVendorStatus.execute(dto), "OK")
    })
}