import { User } from '@prisma/client'
import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from 'type-graphql'
import { Inject } from 'typedi'

import { ItemService } from '../services'
import { Roles } from '../types'
import { ItemInput } from '../types/graphql'
import { Item } from '../types/models'

@Resolver()
export class ItemResolver {
  @Inject()
  service!: ItemService

  @Authorized(Roles.LIST_MEMBER)
  @Mutation(() => Item)
  async createItem(
    @Ctx('user') user: User,
    @Arg('listId', () => Int) listId: number,
    @Arg('data') data: ItemInput
  ): Promise<Item> {
    return this.service.create(user, listId, data)
  }

  @Authorized(Roles.ITEM_MEMBER)
  @Mutation(() => Item)
  async updateItem(
    @Arg('itemId', () => Int) itemId: number,
    @Arg('data') data: ItemInput
  ): Promise<Item> {
    return this.service.update(itemId, data)
  }

  @Authorized(Roles.ITEM_MEMBER)
  @Mutation(() => Boolean)
  async deleteItem(@Arg('itemId', () => Int) itemId: number): Promise<boolean> {
    return this.service.delete(itemId)
  }

  @Authorized(Roles.ITEM_MEMBER)
  @Mutation(() => Boolean)
  async toggleItem(
    @Arg('itemId', () => Int) itemId: number,
    @Arg('complete') complete: boolean
  ): Promise<boolean> {
    return this.service.toggle(itemId, complete)
  }

  @Authorized()
  @Mutation(() => Boolean)
  async moveItem(
    @Ctx('user') user: User,
    @Arg('itemId', () => Int) itemId: number,
    @Arg('fromListId', () => Int) fromListId: number,
    @Arg('toListId', () => Int) toListId: number,
    @Arg('fromOrder', () => [Int]) fromOrder: number[],
    @Arg('toOrder', () => [Int]) toOrder: number[]
  ): Promise<boolean> {
    return this.service.move(
      user,
      itemId,
      fromListId,
      toListId,
      fromOrder,
      toOrder
    )
  }
}
