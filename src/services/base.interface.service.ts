export interface Write<T, CreateDto, UpdateDto> {
  create(item: CreateDto): Promise<T>;
  update(id: string, dto: Partial<UpdateDto>): Promise<T | null>;
  remove(id: string): Promise<boolean>;
}

export interface Read<T> {
  findOneById(id: string): Promise<T | null>;
}

export interface BaseServiceInterface<T, CreateDto = T, UpdateDto = Partial<T>>
  extends Write<T, CreateDto, UpdateDto>,
    Read<T> {}
