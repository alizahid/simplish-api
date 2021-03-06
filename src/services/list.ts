import { User } from '@prisma/client'
import { Service } from 'typedi'

import { db } from '..'
import { sortBoard, sortLists } from '../lib'
import { List } from '../types/models'

@Service()
export class ListService {
  async fetch(user: User, boardId?: number): Promise<List[]> {
    if (boardId) {
      const board = await db.board.findOne({
        include: {
          lists: true
        },
        where: {
          id: boardId
        }
      })

      if (!board) {
        throw new Error('Board not found')
      }

      const lists = sortBoard(board, board.lists)

      return lists
    }

    const lists = await db.list.findMany({
      where: {
        board: {
          none: {
            id: undefined
          }
        },
        users: {
          every: {
            id: user.id
          }
        }
      }
    })

    return sortLists(user, lists)
  }

  async create(user: User, name: string, boardId?: number): Promise<List> {
    const list = await db.list.create({
      data: {
        board: boardId
          ? {
              connect: {
                id: boardId
              }
            }
          : undefined,
        name,
        users: {
          connect: {
            id: user.id
          }
        }
      }
    })

    if (boardId) {
      const board = await db.board.findOne({
        where: {
          id: boardId
        }
      })

      if (!board) {
        throw new Error('Board not found')
      }

      await db.board.update({
        data: {
          listOrder: {
            set: [...board.listOrder, list.id]
          }
        },
        where: {
          id: boardId
        }
      })
    } else {
      await db.user.update({
        data: {
          listOrder: {
            set: [...user.listOrder, list.id]
          }
        },
        where: {
          id: user.id
        }
      })
    }

    return list
  }

  async update(id: number, name: string): Promise<List> {
    const list = await db.list.update({
      data: {
        name
      },
      where: {
        id
      }
    })

    return list
  }

  async delete(user: User, id: number): Promise<boolean> {
    await db.list.delete({
      where: {
        id
      }
    })

    await db.user.update({
      data: {
        listOrder: {
          set: user.listOrder.filter((index) => index !== id)
        }
      },
      where: {
        id: user.id
      }
    })

    return true
  }

  async reorder(id: number, order: number[]): Promise<boolean> {
    await db.list.update({
      data: {
        itemOrder: {
          set: order
        }
      },
      where: {
        id
      }
    })

    return true
  }
}
