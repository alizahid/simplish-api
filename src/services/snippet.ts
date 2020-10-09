import { User } from '@prisma/client'
import { Service } from 'typedi'

import { db } from '..'
import { SnippetInput } from '../types/graphql'
import { Snippet } from '../types/models'

@Service()
export class SnippetService {
  async fetch(user: User): Promise<Snippet[]> {
    const snippets = await db.snippet.findMany({
      orderBy: {
        id: 'desc'
      },
      where: {
        users: {
          every: {
            id: user.id
          }
        }
      }
    })

    return snippets
  }

  async create(user: User, data: SnippetInput): Promise<Snippet> {
    const snippet = await db.snippet.create({
      data: {
        ...data,
        users: {
          connect: {
            id: user.id
          }
        }
      }
    })

    return snippet
  }

  async update(id: number, data: SnippetInput): Promise<Snippet> {
    const snippet = await db.snippet.update({
      data,
      where: {
        id
      }
    })

    return snippet
  }

  async delete(id: number): Promise<boolean> {
    await db.snippet.delete({
      where: {
        id
      }
    })

    return true
  }
}
