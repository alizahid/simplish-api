import { User } from '@prisma/client'
import { Service } from 'typedi'

import { db } from '..'
import { sortBoard } from '../lib'
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

    const lists = sortBoard(board, board.lists)

    return {
      ...board,
      lists
    }
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
}
