export interface IBaseRepository<TDomain> {
  find(): Promise<TDomain[]>;
  findById(id: string): Promise<TDomain | null>;
  create(item: Partial<TDomain>): Promise<TDomain>;
  update(id: string, item: Partial<TDomain>): Promise<TDomain | null>;
  findPaginated(
    filter: Record<string, any>,
    page: number,
    limit: number
  ): Promise<{ items: TDomain[]; total: number }>
}