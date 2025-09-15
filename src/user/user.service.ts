import { Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from './user.model'

@Injectable()
export class UserService {
  constructor(
    // @ts-expect-error - Typegoose injection issue
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
  ) {}

  async byId() {
    return { email: 'te@tse.ee' }
  }
}
