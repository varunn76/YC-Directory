/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint no-use-before-define: 0 */ // --> OFF

import NextAuth, { Profile } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { client } from '@/sanity/lib/client';
import { writeClient } from '@/sanity/lib/write-client';
import { AUTHOR_BY_GITHUB_ID_QUERY } from './sanity/lib/quires';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({
      user,
      profile,
    }: {
      user: any;
      profile?: Profile | undefined;
    }): Promise<boolean | string> {
      // Ensure profile exists if it's required
      if (!profile || !profile.id) {
        console.error('Profile or Profile ID is missing');
        return false; // Deny sign-in if profile or profile.id is not available
      }

      const id = profile.id; // Access safely after checking existence
      const login = profile.login || '';
      const bio = profile.bio || '';

      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });

      if (!existingUser) {
        await writeClient.create({
          _type: 'author',
          id,
          name: user.name || '',
          username: login,
          email: user.email || '',
          image: user.image || '',
          bio,
        });
      }

      return true; // Allow sign-in
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: profile?.id,
          });

        token.id = user?._id;
      }

      return token;
    },
    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});
