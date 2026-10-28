import Redis from "ioredis";
import { RedisAdminInvitationStore } from "../../../infrastructure/repository/redis/RedisAdminInvitationStore";
import { NanoIdTokenGenerator } from "../../../infrastructure/services/NanoIdTokenGenerator";
import { AdminInviteMailQueue } from "../../../infrastructure/queues/AdminInviteMailQueue";
import { AdminRepository } from "../../../infrastructure/repository/admin/AdminRepository";
import { PasswordService } from "../../../infrastructure/services/password_services";
import { InviteAdminUseCase } from "../../../application/use_cases/admin/superAdmin/InviteAdminUseCase";
import { ValidateInvitationUseCase } from "../../../application/use_cases/admin/superAdmin/ValidateInvitationUseCase";
import { AcceptInvitationUseCase } from "../../../application/use_cases/admin/superAdmin/AcceptInvitationUseCase";
import { AdminInvitationController } from "../controllers/admin/AdminInvitationController";
import { connection } from "../../../infrastructure/config/config.queue";

export const invitationStore = new RedisAdminInvitationStore(connection);

const adminRepository = new AdminRepository();

export const invitationController = new AdminInvitationController(
    new InviteAdminUseCase(adminRepository, invitationStore, new NanoIdTokenGenerator(), new AdminInviteMailQueue()),
    new ValidateInvitationUseCase(invitationStore),
    new AcceptInvitationUseCase(adminRepository, invitationStore, new PasswordService())
);