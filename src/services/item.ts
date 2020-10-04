import { User } from '@prisma/client'
import { Inject, Service } from 'typedi'

import { db } from '..'
import { ItemInput } from '../types/graphql'
import { Item } from '../types/models'
import { ListService } from './list'

@Service()
export class ItemService {
  @Inject()
  lists!: ListService

  async create(user: User, listId: number, data: ItemInput): Promise<Item> {
    const list = await db.list.findOne({
      where: {
        id: listId
      }
    })

    if (!list) {
      throw new Error('List not found')
    }

    const item = await db.item.create({
      data: {
        ...data,
        list: {
          connect: {
            id: listId
          }
        },
        user: {
          connect: {
            id: user.id
          }
        }
      },
      include: {
        assignees: true
      }
    })

    await db.list.update({
      data: {
        itemOrder: {
          set: [item.id, ...list.itemOrder]
        }
      },
      where: {
        id: listId
      }
    })

    return item
  }

  async update(id: number, data: ItemInput): Promise<Item> {
    const item = await db.item.update({
      data,
      where: {
        id
      }
    })

    return item
  }

  async delete(id: number): Promise<boolean> {
    const item = await db.item.findOne({
      include: {
        list: true
      },
      where: {
        id
      }
    })

    if (!item) {
      throw new Error('Item not found')
    }

    await db.item.deleteMany({
      where: {
        id,
        listId: item.list.id
      }
    })

    await db.list.update({
      data: {
        itemOrder: {
          set: item.list.itemOrder.filter((index) => index !== id)
        }
      },
      where: {
        id: item.list.id
      }
    })

    return true
  }

  async toggle(id: number, complete: boolean): Promise<boolean> {
    await db.item.update({
      data: {
        complete: {
          set: complete
        }
      },
      where: {
        id
      }
    })

    return complete
  }
}
