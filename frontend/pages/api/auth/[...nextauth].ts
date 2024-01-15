import NextAuth, { Session, Awaitable, User } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

type ExtendedUserType = User & { accessToken: string };

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: String(process.env.GITHUB_ID),
      clientSecret: String(process.env.GITHUB_SECRET),
    }),
  ],
  secret: String(process.env.JWT_SECRET),
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }: any) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as ExtendedUserType).accessToken = token.accessToken;
      return session;
    },
  },
});
