import { useUser, useClerk } from "@clerk/react";

// No context, no provider needed.
// All pages that call useAuth() from this file will just get Clerk data directly.
export function useAuth() {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const user = isSignedIn && clerkUser ? {
    id:       clerkUser.id,
    name:     `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
    email:    clerkUser.emailAddresses[0]?.emailAddress || "",
    imageUrl: clerkUser.imageUrl,
  } : null;

  return {
    user,
    loading: !isLoaded,
    isSignedIn: !!isSignedIn,
    logout: () => signOut(),
  };
}

// No-op provider — keeps any leftover <AuthProvider> in App.jsx from crashing
export function AuthProvider({ children }) {
  return children;
}