import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    getters: true,
    virtuals: true,
    versionKey: false,
  },
})
export class User {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ unique: true, index: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ index: true, required: true })
  name: string;

  @Prop({ default: true, index: true })
  is_active: boolean;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
