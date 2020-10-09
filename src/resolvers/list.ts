import { User } from '@prisma/client'
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

import { ListService } from '../services'
import { Roles } from '../types'
import { List } from '../types/models'

@Resolver()
export class ListResolver {
  @Inject()
  service!: ListService

  @Authorized()
  @Query(() => [List])
  async lists(
    @Ctx('user') user: User,
    @Arg('boardId', () => Int, {
      nullable: true
    })
    boardId?: number
  ): Promise<List[]> {
    return this.service.fetch(user, boardId)
  }

  @Authorized()
  @Mutation(() => List)
  async createList(
    @Ctx('user') user: User,
    @Arg('name') name: string,
    @Arg('boardId', () => Int, {
      nullable: true
    })
    boardId?: number
  ): Promise<List> {
    return this.service.create(user, name, boardId)
  }

  @Authorized(Roles.LIST_MEMBER)
  @Mutation(() => List)
  async updateList(
    @Arg('listId', () => Int) listId: number,
    @Arg('name') name: string
  ): Promise<List> {
    return this.service.update(listId, name)
  }

  @Authorized(Roles.LIST_MEMBER)
  @Mutation(() => Boolean)
  async deleteList(
    @Ctx('user') user: User,
    @Arg('listId', () => Int) listId: number
  ): Promise<boolean> {
    return this.service.delete(user, listId)
  }

  @Authorized(Roles.LIST_MEMBER)
  @Mutation(() => Boolean)
  async reorderList(
    @Arg('listId', () => Int) listId: number,
    @Arg('order', () => [Int]) order: number[]
  ): Promise<boolean> {
    return this.service.reorder(listId, order)
  }
}
