import { Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from '../user/user.model'

@Injectable()
export class AuthService {
  constructor(
    // @ts-expect-error - Typegoose injection issue
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
  ) {}

  async register(dto: any) {
    const newUser = new this.userModel(dto)
    return newUser.save()
  }
}
