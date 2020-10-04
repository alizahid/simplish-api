import { BoardResolver } from './board'
import { ItemResolver } from './item'
import { ListResolver } from './list'
import { UserResolver } from './user'

export const resolvers = [
  BoardResolver,
  ItemResolver,
  ListResolver,
  UserResolver
] as const
