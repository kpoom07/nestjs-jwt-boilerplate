import { User, UserDocument } from '../schemas/user.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '@app/interfaces';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: CreateUserDto): Promise<UserDocument> {
    const result = new this.userModel(data);
    await result.populate('agent');
    return result.save();
  }

  async findOne(filterQuery: FilterQuery<User>): Promise<UserDocument> {
    const result = await this.userModel
      .findOne(filterQuery)
      .populate('agent')
      .exec();
    if (!result) {
      throw new NotFoundException('User document not found.');
    }
    return result;
  }

  async find(filterQuery: FilterQuery<User>) {
    return this.userModel.find(filterQuery);
  }

  async update(
    filterQuery: FilterQuery<User>,
    data: UpdateQuery<User>,
  ): Promise<UserDocument> {
    const result = await this.userModel
      .findOneAndUpdate(filterQuery, data, {
        new: true,
      })
      .populate('agent')
      .exec();

    if (!result) {
      throw new NotFoundException('User document not found.');
    }

    return result;
  }

  async delete(id: string) {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException();
    }

    return true;
  }
}
