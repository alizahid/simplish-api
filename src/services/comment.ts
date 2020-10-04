import { User } from '@prisma/client'
import { Service } from 'typedi'

import { db } from '..'
import { Comment } from '../types/models'

@Service()
export class CommentService {
  async create(user: User, itemId: number, body: string): Promise<Comment> {
    const comment = await db.comment.create({
      data: {
        body,
        item: {
          connect: {
            id: itemId
          }
        },
        user: {
          connect: {
            id: user.id
          }
        }
      },
      include: {
        user: true
      }
    })

    return comment
  }

  async delete(id: number): Promise<boolean> {
    await db.comment.delete({
      where: {
        id
      }
    })

    return true
  }
}
