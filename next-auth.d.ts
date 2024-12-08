// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Extend the default Profile interface to include GitHub-specific fields.
   */
  interface Profile {
    id: string;
    login: string;
    bio: string;
  }

  /**
   * Extended Session interface to include a custom `id` property.
   */
  interface Session {
    id: string;
  }

  /**
   * Extended JWT interface to include a custom `id` property.
   */
  interface JWT {
    id: string;
  }
}
