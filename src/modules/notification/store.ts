import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

export type NotificationType = "SUCCESS" | "INFO" | "WARNING" | "ERROR";

export interface Notification {
	id: string;
	title: string;
	message: string;
	type: NotificationType;
	timestamp: number;
	isRead: boolean;
}

interface NotificationState {
	notifications: Notification[];
	unreadCount: number;
	addNotification: (
		title: string,
		message: string,
		type?: NotificationType
	) => void;
	markAllAsRead: () => void;
	markAsRead: (id: string) => void;
	clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
	persist(
		(set) => ({
			notifications: [],
			unreadCount: 0,

			addNotification: async (title, message, type = "INFO") => {
				const newNotif: Notification = {
					id: Math.random().toString(36).substr(2, 9),
					title,
					message,
					type,
					timestamp: Date.now(),
					isRead: false,
				};

				set((state) => ({
					notifications: [newNotif, ...state.notifications],
					unreadCount: state.unreadCount + 1,
				}));

				try {
					await Notifications.scheduleNotificationAsync({
						content: {
							title: title,
							body: message,
							data: { type },
						},
						trigger: null, // null nghĩa là hiện ngay lập tức
					});
				} catch (error) {
					console.log("Error sending push notification:", error);
				}
			},

			markAsRead: (id) => {
				set((state) => {
					const newNotifications = state.notifications.map((n) =>
						n.id === id ? { ...n, isRead: true } : n
					);
					return {
						notifications: newNotifications,
						unreadCount: newNotifications.filter((n) => !n.isRead).length,
					};
				});
			},

			markAllAsRead: () => {
				set((state) => ({
					notifications: state.notifications.map((n) => ({
						...n,
						isRead: true,
					})),
					unreadCount: 0,
				}));
			},

			clearAll: () => set({ notifications: [], unreadCount: 0 }),
		}),
		{
			name: "notification-storage",
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
