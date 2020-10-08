import Prisma from '@prisma/client'
import { sortBy } from 'lodash'

import * as Models from '../types/models'

export const sortLists = (
  user: Prisma.User,
  lists: Models.List[]
): Models.List[] => sortBy(lists, ({ id }) => user.listOrder.indexOf(id))

export const sortBoard = (
  board: Prisma.Board,
  lists: Models.List[]
): Models.List[] => sortBy(lists, ({ id }) => board.listOrder.indexOf(id))

export const sortItems = (
  { itemOrder }: Prisma.List,
  items: Prisma.Item[]
): Models.Item[] => sortBy(items, ({ id }) => itemOrder.indexOf(id))
