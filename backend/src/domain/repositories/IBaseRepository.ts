export interface IBaseRepository<TDomain> {
  find(): Promise<TDomain[]>;
  findById(id: string): Promise<TDomain | null>;
  create(item: Partial<TDomain>): Promise<TDomain>;
  update(id: string, item: Partial<TDomain>): Promise<TDomain | null>;
}