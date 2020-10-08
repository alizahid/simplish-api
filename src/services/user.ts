import { Inject, Service } from 'typedi'
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator'

import { db } from '..'
import { AuthResult } from '../types/graphql'
import { User } from '../types/models'
import { AuthService } from './auth'

@Service()
export class UserService {
  @Inject()
  auth!: AuthService

  async signIn(token: string): Promise<AuthResult> {
    const { email, uid } = await this.auth.verifyToken(token)

    if (!email) {
      throw new Error('Email is required')
    }

    const user = await db.user.upsert({
      create: {
        email,
        firebaseId: uid,
        name: this.generateName()
      },
      update: {},
      where: {
        firebaseId: uid
      }
    })

    const jwt = this.auth.createToken(user)

    return {
      token: jwt,
      user
    }
  }

  async updatePushToken(user: User, token: string): Promise<boolean> {
    await db.user.update({
      data: {
        pushToken: token
      },
      where: {
        id: user.id
      }
    })

    return true
  }

  async reorder(user: User, order: number[]): Promise<boolean> {
    await db.user.update({
      data: {
        listOrder: {
          set: order
        }
      },
      where: {
        id: user.id
      }
    })

    return true
  }

  private generateName(): string {
    return uniqueNamesGenerator({
      dictionaries: [colors, animals],
      separator: '-'
    })
  }
}
