import NextAuth from 'next-auth/next';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      username: string;
      nickname: string;
      email: string;
      type: number;
      iat: string;
      exp: string;
    };
  }
}
