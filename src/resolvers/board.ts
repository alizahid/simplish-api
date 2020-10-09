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

import { BoardService } from '../services'
import { Roles } from '../types'
import { Board } from '../types/models'

@Resolver()
export class BoardResolver {
  @Inject()
  service!: BoardService

  @Authorized()
  @Query(() => [Board])
  async boards(@Ctx('user') user: User): Promise<Board[]> {
    return this.service.fetch(user)
  }

  @Authorized(Roles.BOARD_MEMBER)
  @Query(() => Board)
  async board(
    @Ctx('user') user: User,
    @Arg('boardId', () => Int) boardId: number
  ): Promise<Board> {
    return this.service.fetchOne(user, boardId)
  }

  @Authorized()
  @Mutation(() => Board)
  async createBoard(
    @Ctx('user') user: User,
    @Arg('name') name: string
  ): Promise<Board> {
    return this.service.create(user, name)
  }

  @Authorized(Roles.BOARD_MEMBER)
  @Mutation(() => Board)
  async updateBoard(
    @Arg('boardId', () => Int) boardId: number,
    @Arg('name') name: string
  ): Promise<Board> {
    return this.service.update(boardId, name)
  }

  @Authorized(Roles.BOARD_MEMBER)
  @Mutation(() => Boolean)
  async deleteBoard(
    @Arg('boardId', () => Int) boardId: number
  ): Promise<boolean> {
    return this.service.delete(boardId)
  }

  @Authorized(Roles.BOARD_MEMBER)
  @Mutation(() => Boolean)
  async reorderBoard(
    @Arg('boardId', () => Int) boardId: number,
    @Arg('order', () => [Int]) order: number[]
  ): Promise<boolean> {
    return this.service.reorder(boardId, order)
  }
}
