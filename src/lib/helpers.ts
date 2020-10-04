import Prisma from '@prisma/client'
import { sortBy } from 'lodash'

import * as Models from '../types/models'

export const sortLists = (
  user: Prisma.User,
  lists: Models.List[]
): Models.List[] => sortBy(lists, ({ id }) => user.listOrder.indexOf(id))

type List = Prisma.List & Models.List

export const sortItems = (list: List): List => ({
  ...list,
  items: sortBy(list.items, ({ id }) => list.itemOrder.indexOf(id))
})
