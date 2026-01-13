import "../global.css"; // CRITICAL: Must be first import for NativeWind v4
import { useEffect } from 'react';
import { useRouter, useSegments, Slot, SplashScreen } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../config/query-client';
import { useAuthStore } from '../modules/auth/store';
import { GlobalErrorBoundary } from '../components/GlobalErrorBoundary';
import { useSystemCheck } from '../core/hooks/useSystemCheck';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, isHydrated, hydrate } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Run system checks on mount
  useSystemCheck();

  // Store router reference for error boundary
  useEffect(() => {
    (window as any).__debug_router = router;
  }, [router]);

  // Hydrate auth state on mount
  useEffect(() => {
    hydrate();
  }, []);

  // Protected routing logic
  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration to complete

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      // Authenticated user trying to access login -> Redirect to home
      router.replace('/');
    } else if (!isAuthenticated && !inAuthGroup) {
      // Unauthenticated user trying to access protected route -> Redirect to login
      router.replace('/(auth)/login');
    }

    // Hide splash screen after routing decision made
    SplashScreen.hideAsync();
  }, [isAuthenticated, isHydrated, segments]);

  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <Slot />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}
