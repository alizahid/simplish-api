const { TOKEN_SECRET } = process.env

import { User } from '@prisma/client'
import { AuthenticationError } from 'apollo-server'
import { Request } from 'express'
import { verify } from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'

import { db } from '..'
import { AuthToken, Context, Roles } from '../types'

export const authChecker: AuthChecker<Context> = async (
  {
    args: { boardId, commentId, itemId, listId, snippetId },
    context: { user }
  },
  roles
): Promise<boolean> => {
  if (roles.length > 0) {
    if (!user) {
      return false
    }

    if (roles.includes(Roles.BOARD_MEMBER)) {
      const board = await db.board.findOne({
        include: {
          users: true
        },
        where: {
          id: boardId
        }
      })

      return !!board?.users.find(({ id }) => id === user.id)
    }

    if (roles.includes(Roles.LIST_MEMBER)) {
      const list = await db.list.findOne({
        include: {
          users: true
        },
        where: {
          id: listId
        }
      })

      return !!list?.users.find(({ id }) => id === user.id)
    }

    if (roles.includes(Roles.COMMENT_OWNER)) {
      const comment = await db.comment.findOne({
        where: {
          id: commentId
        }
      })

      return comment?.userId === user.id
    }

    if (roles.includes(Roles.SNIPPET_MEMBER)) {
      const snippet = await db.snippet.findOne({
        include: {
          users: true
        },
        where: {
          id: snippetId
        }
      })

      return !!snippet?.users.find(({ id }) => id === user.id)
    }

    if (roles.includes(Roles.ITEM_MEMBER)) {
      const item = await db.item.findOne({
        include: {
          list: {
            include: {
              board: {
                include: {
                  users: true
                }
              },
              users: true
            }
          }
        },
        where: {
          id: itemId
        }
      })

      return !!(
        item?.list.users.find(({ id }) => id === user.id) ||
        item?.list.board.map((board) =>
          board.users.find(({ id }) => id === user.id)
        )
      )
    }
  }

  return !!user
}

export const getUser = async (request: Request): Promise<User | undefined> => {
  const header = request.cookies?.token || request.headers?.authorization

  if (!header) {
    return
  }

  const token = header.substr(7)

  if (!token) {
    throw new AuthenticationError('Invalid token')
  }

  const { id } = verify(token, TOKEN_SECRET) as AuthToken

  if (!id) {
    throw new AuthenticationError('Invalid token')
  }

  const user = await db.user.findOne({
    where: {
      id
    }
  })

  if (!user) {
    throw new AuthenticationError('User not found')
  }

  return user
}
