
import axios from 'axios';
import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
// import https from 'https';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          const response = await axios.post(
            process.env.BACKEND_URL + 'auth/login',
            credentials
          );
          const user = response.data;
          if (user) {
            return user;
          } else {
            return { msg: 'Something went wrong please try again later', error: true };
          }
        } catch (error) {
          return { ...error.response.data, error: true };
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // To check is user is allowed to sign in
    async signIn({ user, account, token }) {
      if (user?.error === true) {
        throw new Error(user?.msg);
      }
      return true
    },

    async jwt({ token, user, account }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      const { user } = token
      session = { ...session, token: token.token, user };
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
