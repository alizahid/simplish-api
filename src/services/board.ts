import { User } from '@prisma/client'
import { Service } from 'typedi'

import { db } from '..'
import { Board } from '../types/models'

@Service()
export class BoardService {
  async fetch(user: User): Promise<Board[]> {
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

  async fetchOne(user: User, id: number): Promise<Board> {
    const board = await db.board.findOne({
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

  async update(id: number, name: string): Promise<Board> {
    const board = await db.board.update({
      data: {
        name
      },
      where: {
        id
      }
    })

    return board
  }

  async delete(id: number): Promise<boolean> {
    await db.board.delete({
      where: {
        id
      }
    })

    return true
  }

  async reorder(id: number, order: number[]): Promise<boolean> {
    await db.board.update({
      data: {
        listOrder: {
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
