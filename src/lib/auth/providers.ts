// Assuming utils and constants are in lib/auth/utils and lib/auth/constants
import { getEnvVar } from '@/lib/utils/env';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';
import TwitterProvider from 'next-auth/providers/twitter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { AUTH_MESSAGES, USER_ROLES } from '@/lib/auth/constants/auth';

/**
 * Provider-configuration for NextAuth
 */
export const configureProviders = () => [
  GoogleProvider({
    clientId: getEnvVar('GOOGLE_CLIENT_ID'),
    clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        role: USER_ROLES.USER,
      };
    },
  }),
  GitHubProvider({
    clientId: getEnvVar('GITHUB_CLIENT_ID'),
    clientSecret: getEnvVar('GITHUB_CLIENT_SECRET'),
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name || profile.login,
        email: profile.email,
        image: profile.avatar_url,
        role: USER_ROLES.USER,
      };
    },
  }),
  DiscordProvider({
    clientId: getEnvVar('DISCORD_CLIENT_ID'),
    clientSecret: getEnvVar('DISCORD_CLIENT_SECRET'),
    profile(profile) {
      return {
        id: profile.id,
        name: profile.username,
        email: profile.email,
        image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
        role: USER_ROLES.USER,
      };
    },
  }),
  TwitterProvider({
    clientId: getEnvVar('TWITTER_CLIENT_ID'),
    clientSecret: getEnvVar('TWITTER_CLIENT_SECRET'),
    version: '2.0',
    authorization: {
      params: {
        scope: 'users.read tweet.read offline.access',
      },
    },
    userinfo: {
      url: 'https://api.twitter.com/2/users/me',
      params: {
        'user.fields': 'profile_image_url,name,username',
      },
    },
    profile(profile: {
      data: {
        id: string;
        name: string;
        email?: string;
        profile_image_url?: string;
      };
    }) {
      return {
        id: profile.data.id,
        name: profile.data.name,
        // email is not always available in Twitter API v2 without elevated access,
        // but we'll try to map it if present or handle it gracefully.
        // Note: NextAuth Twitter 2.0 profile structure might be different.
        // Usually it's converting the response.
        // Let's rely on default profile mapping if possible or check docs structure.
        // For v2, profile.data contains the user info.
        email:
          profile.data.email ??
          `twitter-${profile.data.id}@no-email.twitter.com`,
        image: profile.data.profile_image_url,
        role: USER_ROLES.USER,
      };
    },
  }),
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Lösenord', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error(AUTH_MESSAGES.ERROR_MISSING_FIELDS);
      }

      // Convert email to lowercase before database lookup
      const lowerCaseEmail = credentials.email.toLowerCase();

      const user = await prisma.user.findUnique({
        where: { email: lowerCaseEmail }, // Use lowercased email for lookup
      });

      if (!user || !user.password) {
        // User not found (or OAuth user trying to login with credentials)
        console.warn(
          `Login attempt failed for ${lowerCaseEmail}: User not found or no password set.`
        );
        throw new Error('User not found'); // Keep error generic for security
      }

      // Validate password first
      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.password
      );

      if (!isPasswordValid) {
        // Use a specific internal error to indicate incorrect password
        throw new Error('Incorrect password');
      }

      // Check if user has verified their email first after password is validated
      if (!user.emailVerified) {
        throw new Error('EMAIL_NOT_VERIFIED');
      }

      return user;
    },
  }),
];
