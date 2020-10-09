import { Field, InputType, ObjectType } from 'type-graphql'

import { User } from './models'

// objects

@ObjectType()
export class AuthResult {
  @Field()
  token!: string

  @Field(() => User)
  user!: User
}

// inputs

@InputType()
export class ItemInput {
  @Field()
  body!: string

  @Field(() => String, {
    nullable: true
  })
  description?: string

  @Field(() => String, {
    nullable: true
  })
  date?: string
}

@InputType()
export class SnippetInput {
  @Field()
  name!: string

  @Field()
  language!: string

  @Field()
  content!: string

  @Field(() => [String])
  tags!: string[]
}
