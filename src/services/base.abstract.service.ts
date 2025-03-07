import { BaseRepositoryInterface } from '~/repositories/base/base.interface.repository';
import { BaseServiceInterface } from './base.interface.service';

export abstract class BaseServiceAbstract<T, CreateDto = T, UpdateDto = T>
  implements BaseServiceInterface<T, CreateDto, UpdateDto>
{
  constructor(private readonly repository: BaseRepositoryInterface<T, CreateDto, UpdateDto>) {}

  async create(createDto: CreateDto): Promise<T> {
    return await this.repository.create(createDto);
  }

  async update(id: string, updateDto: UpdateDto): Promise<T | null> {
    return await this.repository.update(id, updateDto);
  }

  async findOneById(id: string) {
    return await this.repository.findOneById(id);
  }

  async remove(id: string) {
    return await this.repository.softDelete(id);
  }
}
