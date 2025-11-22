import type { NextAuthConfig } from 'next-auth'

// Edge-compatible config (no Prisma, no bcrypt)
// Used by middleware for lightweight auth checks
export default {
  providers: [],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
      }
      return session
    },
  },
} satisfies NextAuthConfig
