import { User } from '@prisma/client'

export type AuthToken = {
  id: number
}

export type Context = {
  user?: User
}

export type FirebaseUser = {
  email?: string
  uid: string
}

export enum Roles {
  BOARD_MEMBER = 'BOARD_MEMBER',
  COMMENT_OWNER = 'COMMENT_OWNER',
  ITEM_MEMBER = 'ITEM_MEMBER',
  LIST_MEMBER = 'LIST_MEMBER'
}
