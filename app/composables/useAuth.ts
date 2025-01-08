import type { SignInSchema } from "~~/shared/schemas/auth";

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
  accessToken: string;
}

export const useAuth = () => {
  const user = useState("user", () => null as AuthResponse["user"] | null);
  const accessToken = useState("access_token", () => null as string | null);

  const signIn = async (credentials: SignInSchema) => {
    try {
      const response = await $fetch<AuthResponse>("/api/auth/sign-in", {
        method: "POST",
        body: credentials,
      });

      user.value = response.user;
      accessToken.value = response.accessToken;

      // Check for redirect
      const redirect = useState('redirect')
      const redirectPath = redirect.value || '/console'
      redirect.value = null // Clear the redirect
      
      // Navigate to saved path or default
      await navigateTo(redirectPath)

      return response;
    } catch (error: any) {
      // Extract error message from the response
      const message =
        error?.response?._data?.message ||
        error.message ||
        "Something went wrong";
      throw createError({
        statusCode: error.statusCode || 500,
        message,
      });
    }
  };

  const signUp = async (credentials: SignInSchema) => {
    try {
      const response = await $fetch<AuthResponse>("/api/auth/sign-up", {
        method: "POST",
        body: credentials,
      });

      user.value = response.user;
      accessToken.value = response.accessToken;

      return response;
    } catch (error: any) {
      const message =
        error?.response?._data?.message ||
        error.message ||
        "Something went wrong";
      throw createError({
        statusCode: error.statusCode || 500,
        message,
      });
    }
  };

  const signOut = async () => {
    try {
      await $fetch("/api/auth/sign-out", { method: "POST" });
      // user.value = null;
      // accessToken.value = null;
      // Force reload to clear any cached state
      window.location.href = '/auth/sign-in'
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return {
    user,
    accessToken,
    signIn,
    signUp,
    signOut,
  };
};
