import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import { dbUsers } from '../../../database'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here

    Credentials({
      name: 'Custom Login',
      credentials: {
        email: {
          label: 'Correo',
          type: 'email',
          placeholder: 'Dirección de correo',
        },
        password: {
          label: 'Contraseña',
          type: 'password',
          placeholder: 'Contraseña',
        },
      },
      async authorize(credentials) {
        return await dbUsers.checkUserEmailPassword(
          credentials!.email,
          credentials!.password
        )
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  session: {
    maxAge: 2592000, //30 dias
    strategy: 'jwt',
    updateAge: 86400, //cada dia se actualiza
  },

  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        switch (account.type) {
          case 'credentials':
            token.user = user
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(
              user?.email || '',
              user.name || ''
            )

          default:
            break
        }
      }

      return token
    },

    async session({ session, token, user }) {
      session.accessToken = token.accessToken
      session.user = token.user as any

      return session
    },
  },
}

export default NextAuth(authOptions)
