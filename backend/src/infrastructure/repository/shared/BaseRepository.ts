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
    const doc = await this.model.findById(id).lean();
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

  async findPaginated(filter: Record<string, any>, page: number, limit: number): Promise<{ items: TDomain[]; total: number; }> {
    const [docs, total] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      this.model.countDocuments(filter)
    ]);
    return { items: docs.map((d) => this.mapper(d)), total }
  }
}
