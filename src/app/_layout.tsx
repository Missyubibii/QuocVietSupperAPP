import 'react-native-get-random-values';
import "../global.css";
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useRouter, useSegments, Stack, SplashScreen } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../config/query-client';
import { useAuthStore } from '../modules/auth/store';
import { GlobalErrorBoundary } from '../components/GlobalErrorBoundary';
import { useSystemCheck } from '../core/hooks/useSystemCheck';
import * as Notifications from 'expo-notifications';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// 2. Cấu hình Handler: Quy định cách thông báo hiển thị khi App đang mở
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowBanner: true, // Thay thế shouldShowAlert
		shouldShowList: true,   // Thay thế shouldShowAlert
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

export default function RootLayout() {
	const { isAuthenticated, isHydrated, hydrate } = useAuthStore();
	const segments = useSegments();
	const router = useRouter();

	useSystemCheck();

	useEffect(() => {
		(window as any).__debug_router = router;
	}, [router]);

	useEffect(() => {
		hydrate();
	}, []);

	useEffect(() => {
		registerForPushNotificationsAsync();
	}, []);

	async function registerForPushNotificationsAsync() {
		if (Platform.OS === 'android') {
			// Android bắt buộc phải có Channel mới hiện thông báo
			await Notifications.setNotificationChannelAsync('default', {
				name: 'default',
				importance: Notifications.AndroidImportance.MAX, // Mức cao nhất: Hiện pop-up, có tiếng
				vibrationPattern: [0, 250, 250, 250],
				lightColor: '#FF231F7C',
			});
		}

		// Kiểm tra quyền hiện tại
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;

		// Nếu chưa có quyền -> Hỏi xin người dùng
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}

		if (finalStatus !== 'granted') {
			console.log('Không được cấp quyền thông báo!');
			return;
		}
	}

	useEffect(() => {
		if (!isHydrated) return;
		const inAuthGroup = segments[0] === '(auth)';
		if (isAuthenticated && inAuthGroup) {
			router.replace('/');
		} else if (!isAuthenticated && !inAuthGroup) {
			router.replace('/(auth)/login');
		}
		SplashScreen.hideAsync();
	}, [isAuthenticated, isHydrated, segments]);

	return (
		<GlobalErrorBoundary>
			<QueryClientProvider client={queryClient}>
				<SafeAreaProvider>
					{/* 🔴 QUAN TRỌNG: screenOptions={{ headerShown: false }} để tắt header mặc định */}
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						<Stack.Screen name="(auth)" options={{ headerShown: false }} />

						{/* Các màn hình con khác */}
						<Stack.Screen name="profile/index" options={{ headerShown: false }} />

						{/* Modal Task - Sửa màu oklch thành HEX */}
						<Stack.Screen
							name="task/create"
							options={{
								presentation: 'modal',
								headerShown: true,
								headerTitle: 'Tạo công việc mới',
								headerStyle: { backgroundColor: '#FFFFFF' },
								headerTintColor: '#E11D48', // ✅ Đã sửa màu đỏ
								headerTitleStyle: { fontWeight: 'bold', color: '#1F2937' },
								headerShadowVisible: false,
							}}
						/>
					</Stack>
				</SafeAreaProvider>
			</QueryClientProvider>
		</GlobalErrorBoundary>
	);
}