import { User } from '@prisma/client'
import { Service } from 'typedi'

import { db } from '..'
import { Board } from '../types/models'

@Service()
export class BoardService {
  async fetchAll(user: User): Promise<Board[]> {
    const boards = await db.board.findMany({
      where: {
        users: {
          some: {
            id: user.id
          }
        }
      }
    })

    return boards
  }

  async fetchOne(id: number): Promise<Board> {
    const board = await db.board.findOne({
      include: {
        lists: true
      },
      where: {
        id
      }
    })

    if (!board) {
      throw new Error('Board not found')
    }

    return board
  }

  async create(user: User, name: string): Promise<Board> {
    const board = await db.board.create({
      data: {
        name,
        users: {
          connect: {
            id: user.id
          }
        }
      }
    })

    return board
  }

  async delete(id: number): Promise<boolean> {
    await db.item.deleteMany({
      where: {
        list: {
          board: {
            every: {
              id
            }
          }
        }
      }
    })

    await db.list.deleteMany({
      where: {
        board: {
          every: {
            id
          }
        }
      }
    })

    await db.board.delete({
      where: {
        id
      }
    })

    return true
  }
}
