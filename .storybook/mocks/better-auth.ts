// Storybook 用の空モック
export const betterAuth = () => ({});

// better-auth/react 用のモック
export const createAuthClient = () => ({
  signIn: {
    social: () => Promise.resolve(),
  },
  signOut: () => Promise.resolve(),
  useSession: () => ({
    data: null,
    isPending: false,
  }),
});

export const signIn = { social: () => Promise.resolve() };
export const signOut = () => Promise.resolve();
export const useSession = () => ({ data: null, isPending: false });
