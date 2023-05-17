import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: '9FZID6AKGFVV4J99T3HJ',
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username' },
        password: { label: 'Password', type: 'password', placeholder: 'Password' },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials as any;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/login`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });
        const user = await response.json();
        if (response.ok && user.code === 200) {
          const decodedToken = jwt.verify(user.accessToken, '9FZID6AKGFVV4J99T3HJ');
          return decodedToken;
        } else return null;
      },
    }),
  ],
  pages: {
    signIn: '/member/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },
};

export default NextAuth(authOptions);
