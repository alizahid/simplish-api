const { TOKEN_SECRET } = process.env

import { User } from '@prisma/client'
import { sign } from 'jsonwebtoken'
import { Service } from 'typedi'

import { firebase } from '../lib'
import { FirebaseUser } from '../types'

@Service()
export class AuthService {
  async verifyToken(token: string): Promise<FirebaseUser> {
    const { email, uid } = await firebase.auth().verifyIdToken(token)

    return {
      email,
      uid
    }
  }

  createToken({ id }: User): string {
    return sign(
      {
        id
      },
      TOKEN_SECRET
    )
  }
}
