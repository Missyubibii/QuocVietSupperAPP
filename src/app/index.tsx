import React, { useState } from "react";
import {
	View,
	Text,
	ScrollView,
	StatusBar,
	TouchableOpacity,
	Image,
	TextInput,
	Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "../modules/auth/store";
import {
	Users, Box, FileBarChart, Briefcase, PieChart, QrCode, UserPlus,
	FileText, CalendarDays, Search, Fingerprint, Bell, Activity,
	MoreVertical, Home, BarChart3, Settings, Plus, X, LogOut, ChevronRight
} from "lucide-react-native";

// --- DỮ LIỆU MẪU ---
const STATS = [
	{ label: "Doanh thu", value: "2.4 Tỷ", unit: "VND", change: "+12%", color: "text-blue-600", bg: "bg-blue-50" },
	{ label: "Deal Mới", value: "45", unit: "DEALS", change: "+5", color: "text-violet-600", bg: "bg-violet-50" },
];

const MY_APPS = [
	{ id: 1, name: "Nhân sự", icon: Users, color: "bg-orange-100", iconColor: "#ea580c" },
	{ id: 2, name: "Kế toán", icon: PieChart, color: "bg-blue-100", iconColor: "#2563eb" },
	{ id: 3, name: "Kho", icon: Box, color: "bg-emerald-100", iconColor: "#059669" },
	{ id: 4, name: "Báo cáo", icon: FileBarChart, color: "bg-purple-100", iconColor: "#9333ea" },
	{ id: 5, name: "Dự án", icon: Briefcase, color: "bg-pink-100", iconColor: "#db2777" },
];

const QUICK_ACTIONS = [
	{ id: "scan", label: "Quét QR", icon: QrCode },
	{ id: "add_user", label: "Thêm Khách", icon: UserPlus },
	{ id: "report", label: "Tạo Báo cáo", icon: FileText },
	{ id: "calendar", label: "Lịch hẹn", icon: CalendarDays },
];

// --- COMPONENTS ---
const GlassCard = ({ children, className = "", style }: any) => (
	<View
		className={`bg-white border border-slate-100 rounded-[20px] shadow-sm ${className}`} // Xóa bg-white/90 để fix dark mode leak
		style={[{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }, style]}
	>
		{children}
	</View>
);

const NavButton = ({ icon: Icon, active, onPress }: any) => (
	<TouchableOpacity
		onPress={onPress}
		className={`w-11 h-11 rounded-2xl items-center justify-center ${active ? "bg-blue-50" : "bg-transparent"}`}
	>
		<Icon size={24} color={active ? "#2563eb" : "#94a3b8"} strokeWidth={active ? 2.5 : 2} />
	</TouchableOpacity>
);

// --- MAIN SCREEN ---
export default function IndexScreen() {
	const { user, logout } = useAuthStore();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("home");
	const [showSettings, setShowSettings] = useState(false);

	const handleLogout = async () => {
		setShowSettings(false);
		await logout();
		router.replace("/(auth)/login");
	};

	return (
		// BẮT BUỘC: bg-slate-50 để ép nền sáng, bất chấp Dark Mode hệ thống
		<View className="flex-1 bg-slate-50">
			<StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

			<SafeAreaView className="flex-1">
				{/* HEADER */}
				<View className="px-5 pt-2 pb-3 flex-row justify-between items-center">
					<TouchableOpacity activeOpacity={0.7} onPress={() => setShowSettings(true)} className="flex-row items-center gap-3">
						<View className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-white">
							<Image source={{ uri: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" }} className="w-full h-full" />
						</View>
						<View>
							<Text className="text-[11px] font-bold text-slate-400 uppercase">Xin chào</Text>
							<Text className="text-lg font-extrabold text-slate-900 leading-none">{user?.name || "Alex Trần"}</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 items-center justify-center">
						<Bell size={20} color="#475569" strokeWidth={2.5} />
						<View className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
					</TouchableOpacity>
				</View>

				<ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
					{/* SEARCH */}
					<View className="mb-6 mt-2">
						<View className="bg-white rounded-[18px] h-12 flex-row items-center px-4 gap-3 border border-slate-200 shadow-sm">
							<Search size={20} color="#94a3b8" />
							<TextInput
								placeholder="Tìm kiếm..."
								placeholderTextColor="#94a3b8"
								className="flex-1 text-slate-800 text-sm font-medium h-full" // Ép màu chữ
							/>
							<TouchableOpacity className="p-2 bg-slate-100 rounded-xl"><Fingerprint size={20} color="#475569" /></TouchableOpacity>
						</View>
					</View>

					{/* MY APPS */}
					<View className="mb-6">
						<View className="flex-row justify-between items-center mb-3">
							<Text className="text-sm font-bold text-slate-800">Ứng dụng</Text>
							<Text className="text-blue-600 text-xs font-bold">Xem tất cả</Text>
						</View>
						<ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4 overflow-visible py-1">
							{MY_APPS.map((app) => (
								<TouchableOpacity key={app.id} className="items-center gap-2 mr-4" activeOpacity={0.8}>
									<View className={`w-16 h-16 rounded-[22px] ${app.color} items-center justify-center border-2 border-white shadow-sm`}>
										<app.icon size={32} color={app.iconColor} strokeWidth={2} />
									</View>
									<Text className="text-xs font-semibold text-slate-600 text-center">{app.name}</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>

					{/* QUICK ACTIONS */}
					<View className="flex-row flex-wrap justify-between mb-6">
						{QUICK_ACTIONS.map((action) => (
							<TouchableOpacity key={action.id} className="items-center gap-1.5 w-[23%]" activeOpacity={0.7}>
								<View className="w-14 h-14 rounded-[20px] bg-white border border-slate-100 items-center justify-center shadow-sm">
									<action.icon size={26} color="#475569" strokeWidth={1.5} />
								</View>
								<Text className="text-[11px] font-bold text-slate-500 text-center">{action.label}</Text>
							</TouchableOpacity>
						))}
					</View>

					{/* --- NÚT CHẤM CÔNG (SỬA GIAO DIỆN) --- */}
					<TouchableOpacity
						onPress={() => router.push('/attendance')}
						activeOpacity={0.9}
						className="mb-6 shadow-lg shadow-blue-500/30"
					>
						{/* Sử dụng bg-blue-600 để đảm bảo hiển thị rõ ràng */}
						<View className="bg-blue-600 p-4 rounded-[24px] flex-row items-center justify-between relative overflow-hidden">
							{/* Decorative circles (overlay white with opacity) */}
							<View className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
							<View className="absolute -left-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />

							<View className="flex-row items-center gap-4">
								<View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center border border-white/20">
									<CalendarDays size={24} color="#FFF" strokeWidth={2.5} />
								</View>
								<View>
									<Text className="text-white font-extrabold text-lg">Chấm công</Text>
									<Text className="text-blue-100 text-xs font-medium">Bắt đầu ca làm việc</Text>
								</View>
							</View>
							<View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
								<ChevronRight size={20} color="#2563eb" />
							</View>
						</View>
					</TouchableOpacity>

					{/* STATS GRID */}
					<View className="flex-row flex-wrap gap-3 mb-6">
						{STATS.map((stat, idx) => (
							<GlassCard key={idx} className="p-4 justify-between h-28 w-[48%] bg-white">
								<View className="flex-row justify-between items-start">
									<View className={`w-10 h-10 rounded-xl ${stat.bg} items-center justify-center`}>
										<Activity size={20} color={stat.color.includes("blue") ? "#2563eb" : "#7c3aed"} strokeWidth={2.5} />
									</View>
									<View className={`px-2 py-0.5 rounded-lg bg-slate-100`}>
										<Text className={`text-[10px] font-bold text-slate-600`}>{stat.change}</Text>
									</View>
								</View>
								<View>
									<Text className="text-xl font-bold text-slate-900">{stat.value}</Text>
									<Text className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{stat.label}</Text>
								</View>
							</GlassCard>
						))}
					</View>
				</ScrollView>

				{/* SETTINGS MODAL */}
				<Modal animationType="fade" transparent={true} visible={showSettings} onRequestClose={() => setShowSettings(false)}>
					<View className="flex-1 bg-black/50 justify-center items-center px-5">
						<View className="bg-white w-full rounded-[32px] p-6 shadow-2xl">
							<View className="flex-row justify-between items-center mb-6">
								<Text className="text-lg font-bold text-slate-800">Cài đặt</Text>
								<TouchableOpacity onPress={() => setShowSettings(false)} className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center"><X size={18} color="#64748b" /></TouchableOpacity>
							</View>
							{/* Menu Items... */}
							<TouchableOpacity className="flex-row items-center gap-3 p-4 bg-red-50 rounded-xl mt-4" onPress={handleLogout}>
								<LogOut size={20} color="#ef4444" />
								<Text className="font-bold text-red-500">Đăng xuất</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

				{/* BOTTOM NAV */}
				<View className="absolute bottom-6 left-0 right-0 items-center">
					<View className="w-[88%] bg-white border border-slate-100 rounded-[28px] p-2 flex-row justify-between items-center shadow-lg shadow-slate-200/50">
						<NavButton icon={Home} active={activeTab === "home"} onPress={() => setActiveTab("home")} />
						<NavButton icon={Users} active={activeTab === "users"} onPress={() => setActiveTab("users")} />
						<TouchableOpacity activeOpacity={0.9} className="relative -mt-10 mx-2 shadow-xl shadow-blue-500/30">
							<View className="w-14 h-14 bg-blue-600 rounded-full items-center justify-center border-[4px] border-slate-50">
								<Plus size={28} color="#FFF" strokeWidth={3} />
							</View>
						</TouchableOpacity>
						<NavButton icon={BarChart3} active={activeTab === "stats"} onPress={() => setActiveTab("stats")} />
						<NavButton icon={Settings} active={activeTab === "settings" || showSettings} onPress={() => setShowSettings(true)} />
					</View>
				</View>
			</SafeAreaView>
		</View>
	);
}