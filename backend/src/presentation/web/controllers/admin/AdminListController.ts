import { Request, Response } from "express";
import { ListVendorsUseCase } from "../../../../application/use_cases/admin/lists/ListVendorsUseCase";
import { ListUsersUseCase } from "../../../../application/use_cases/admin/lists/ListUsersUseCase";
import { asyncHandlor } from "../../../../utils/errors/asyncHandlor";
import { sendSuccess } from "../../../../utils/apiResponse";
import { parseListQuery } from "../../../../utils/listFilter";

export class AdminListController {
    constructor(
        private _listVendors: ListVendorsUseCase,
        private _listUsers: ListUsersUseCase
    ){}

    vendors = asyncHandlor(async (req: Request, res: Response) =>
        sendSuccess(res, await this._listVendors.execute(parseListQuery(req.query)), "OK"));

    users = asyncHandlor(async (req: Request, res: Response) => 
        sendSuccess(res, await this._listUsers.execute(parseListQuery(req.query)), "OK" ));
}