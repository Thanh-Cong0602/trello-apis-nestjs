export interface BaseRepositoryInterface<T, CreateDto = T, UpdateDto = T> {
  create(dto: CreateDto): Promise<T>;

  update(id: string, dto: Partial<UpdateDto>): Promise<T | null>;

  findOneById(id: string, projection?: string): Promise<T | null>;

  softDelete(_id: string): Promise<boolean>;

  permanentlyDelete(_id: string): Promise<boolean>;
}
