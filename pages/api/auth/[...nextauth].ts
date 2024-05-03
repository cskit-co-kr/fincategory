import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import KakaoProvider from 'next-auth/providers/kakao';
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
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/board/signin',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};

export default NextAuth(authOptions);
