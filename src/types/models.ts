import Prisma from '@prisma/client'
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class User
  implements
    Omit<
      Prisma.User,
      'firebaseId' | 'pushToken' | 'listOrder' | 'createdAt' | 'updatedAt'
    > {
  @Field(() => Int)
  id!: number

  @Field()
  name!: string

  @Field()
  email!: string
}

@ObjectType()
export class List implements Omit<Prisma.List, 'itemOrder' | 'updatedAt'> {
  @Field(() => Int)
  id!: number

  @Field()
  name!: string

  @Field(() => [Item], {
    nullable: true
  })
  items?: Item[]

  @Field()
  createdAt!: Date
}

@ObjectType()
export class Item implements Omit<Prisma.Item, 'listId' | 'userId'> {
  @Field(() => Int)
  id!: number

  @Field()
  body!: string

  @Field()
  complete!: boolean

  @Field(() => String, {
    nullable: true
  })
  description!: string | null

  @Field(() => Date, {
    nullable: true
  })
  date!: Date | null

  @Field(() => [User], {
    nullable: true
  })
  assignees?: User[]

  @Field(() => [Comment], {
    nullable: true
  })
  comments?: Comment[]

  @Field(() => User, {
    nullable: true
  })
  user?: User

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

@ObjectType()
export class Comment
  implements Omit<Prisma.Comment, 'itemId' | 'userId' | 'updatedAt'> {
  @Field(() => Int)
  id!: number

  @Field()
  body!: string

  @Field(() => User)
  user!: User

  @Field()
  createdAt!: Date
}

@ObjectType()
export class Board implements Omit<Prisma.Board, 'listOrder' | 'updatedAt'> {
  @Field(() => Int)
  id!: number

  @Field()
  name!: string

  @Field(() => [List], {
    nullable: true
  })
  lists?: List[]

  @Field()
  createdAt!: Date
}
