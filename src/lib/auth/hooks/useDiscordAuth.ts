import { useState } from 'react';
import { signIn } from 'next-auth/react';
import {
  AUTH_MESSAGES,
  DEFAULT_LOGIN_REDIRECT,
} from '@/lib/auth/constants/auth';

interface UseDiscordAuthProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDiscordAuth = ({
  onSuccess,
  onError,
}: UseDiscordAuthProps = {}) => {
  const [loading, setLoading] = useState(false);

  const handleDiscordSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn('discord', {
        callbackUrl: DEFAULT_LOGIN_REDIRECT,
        redirect: false,
      });

      if (result?.error) {
        onError?.(
          new Error(result.error || AUTH_MESSAGES.ERROR_DISCORD_SIGNIN_FAILED)
        );
      } else if (result?.ok) {
        onSuccess?.();
      }
    } catch (error) {
      onError?.(
        error instanceof Error
          ? error
          : new Error(AUTH_MESSAGES.ERROR_DISCORD_SIGNIN_FAILED)
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleDiscordSignIn,
  };
};
