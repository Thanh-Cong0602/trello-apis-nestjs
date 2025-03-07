import { HydratedDocument, Model, Types, UpdateQuery } from 'mongoose';
import { BaseSchema } from '~/modules/shared/base/base.schema';
import { BaseRepositoryInterface } from './base.interface.repository';

export abstract class BaseRepositoryAbstract<T extends BaseSchema, CreateDto = T, UpdateDto = T>
  implements BaseRepositoryInterface<T, CreateDto, UpdateDto>
{
  protected constructor(protected readonly model: Model<T>) {}

  async create(dto: CreateDto): Promise<HydratedDocument<T>> {
    return await this.model.create(dto);
  }

  async update(_id: string, updatedDto: Partial<UpdateDto>): Promise<HydratedDocument<T> | null> {
    return await this.model.findOneAndUpdate(
      { _id: new Types.ObjectId(_id) },
      { $set: updatedDto as UpdateQuery<T> },
      { returnDocument: 'after' }
    );
  }

  async findOneById(_id: string): Promise<HydratedDocument<T> | null> {
    return await this.model.findById(_id);
  }

  async softDelete(_id: string): Promise<boolean> {
    const delete_item = await this.model.findById(_id);
    if (!delete_item) return false;

    return !!(await this.model.findByIdAndUpdate<T>(_id, { deleted_at: new Date() }).exec());
  }

  async permanentlyDelete(_id: string): Promise<boolean> {
    const delete_item = await this.model.findById(_id);

    if (!delete_item) return false;

    return !!(await this.model.findByIdAndDelete(_id));
  }
}
