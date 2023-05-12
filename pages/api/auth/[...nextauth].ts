import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
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
        if (response.ok && user) {
          return user;
        } else return null;
      },
    }),
  ],
  // session: {
  //   strategy: 'jwt',
  // },
};

export default NextAuth(authOptions);
