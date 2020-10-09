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

import { SnippetService } from '../services'
import { Roles } from '../types'
import { SnippetInput } from '../types/graphql'
import { Snippet } from '../types/models'

@Resolver()
export class SnippetResolver {
  @Inject()
  service!: SnippetService

  @Authorized()
  @Query(() => [Snippet])
  async snippets(@Ctx('user') user: User): Promise<Snippet[]> {
    return this.service.fetch(user)
  }

  @Authorized()
  @Mutation(() => Snippet)
  async createSnippet(
    @Ctx('user') user: User,
    @Arg('data') data: SnippetInput
  ): Promise<Snippet> {
    return this.service.create(user, data)
  }

  @Authorized(Roles.SNIPPET_MEMBER)
  @Mutation(() => Snippet)
  async updateSnippet(
    @Arg('snippetId', () => Int) snippetId: number,
    @Arg('data') data: SnippetInput
  ): Promise<Snippet> {
    return this.service.update(snippetId, data)
  }

  @Authorized(Roles.SNIPPET_MEMBER)
  @Mutation(() => Boolean)
  async deleteSnippet(
    @Arg('snippetId', () => Int) snippetId: number
  ): Promise<boolean> {
    return this.service.delete(snippetId)
  }
}
