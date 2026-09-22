import { Model } from "mongoose";
import { IBaseRepository } from "../../../domain/repositories/IBaseRepository";

export class BaseRepository<TDomain, TDbDoc> implements IBaseRepository<TDomain> {
  constructor(
    protected readonly model: Model<TDbDoc>,
    protected readonly mapper:(raw: any) => TDomain
  ) {}

  async find(): Promise<TDomain[]> {
    const data = await this.model.find().lean();
    return data.map((obj) => this.mapper(obj));
  }

  async findById(id: string): Promise<TDomain | null> {
    const doc = this.model.findById(id).lean();
    if(!doc) return null;
    return this.mapper(doc);
  }

  async create(item: any): Promise<TDomain> {
    const createdDoc = await this.model.create(item);
    return this.mapper(createdDoc.toObject())
  }

  async update(id: string, item: Partial<TDomain>): Promise<TDomain | null> {
    const updatedDoc = await this.model.findByIdAndUpdate(id, item as any, { new: true}).lean();
    if(!updatedDoc) return null;
    return this.mapper(updatedDoc);
  }
}
