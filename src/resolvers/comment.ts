import { User } from '@prisma/client'
import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from 'type-graphql'
import { Inject } from 'typedi'

import { CommentService } from '../services'
import { Roles } from '../types'
import { Comment } from '../types/models'

@Resolver()
export class CommentResolver {
  @Inject()
  service!: CommentService

  @Authorized(Roles.ITEM_MEMBER)
  @Mutation(() => Comment)
  async createComment(
    @Ctx('user') user: User,
    @Arg('itemId', () => Int) itemId: number,
    @Arg('body') body: string
  ): Promise<Comment> {
    return this.service.create(user, itemId, body)
  }

  @Authorized(Roles.COMMENT_OWNER)
  @Mutation(() => Boolean)
  async deleteComment(
    @Arg('commentId', () => Int) commentId: number
  ): Promise<boolean> {
    return this.service.delete(commentId)
  }
}
