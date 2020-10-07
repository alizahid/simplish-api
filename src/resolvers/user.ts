import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver
} from 'type-graphql'
import { Inject } from 'typedi'

import { UserService } from '../services'
import { AuthResult } from '../types/graphql'
import { User } from '../types/models'

@Resolver()
export class UserResolver {
  @Inject()
  service!: UserService

  @Authorized()
  @Query(() => User)
  profile(@Ctx('user') user: User): User {
    return user
  }

  @Mutation(() => AuthResult)
  signIn(@Arg('token') token: string): Promise<AuthResult> {
    return this.service.signIn(token)
  }

  @Authorized()
  @Mutation(() => Boolean)
  async updatePushToken(
    @Ctx('user') user: User,
    @Arg('token') token: string
  ): Promise<boolean> {
    return this.service.updatePushToken(user, token)
  }

  @Authorized()
  @Mutation(() => Boolean)
  async reorderLists(
    @Ctx('user') user: User,
    @Arg('order', () => [Int]) order: number[]
  ): Promise<boolean> {
    return this.service.reorder(user, order)
  }
}
