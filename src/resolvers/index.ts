import { BoardResolver } from './board'
import { ItemResolver } from './item'
import { ListResolver } from './list'
import { SnippetResolver } from './snippet'
import { UserResolver } from './user'

export const resolvers = [
  BoardResolver,
  ItemResolver,
  ListResolver,
  SnippetResolver,
  UserResolver
] as const
