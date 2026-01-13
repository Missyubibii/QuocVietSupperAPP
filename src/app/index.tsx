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
	Users,
	Box,
	FileBarChart,
	Briefcase,
	PieChart,
	QrCode,
	UserPlus,
	FileText,
	CalendarDays,
	Search,
	Fingerprint,
	Bell,
	Activity,
	MoreVertical,
	Home,
	BarChart3,
	Settings,
	Plus,
	X,
	LogOut,
	ChevronRight,
} from "lucide-react-native";

// --- MOCK DATA TỪ APP.JS ---
const STATS = [
	{
		label: "Doanh thu",
		value: "2.4 Tỷ",
		unit: "VND",
		change: "+12%",
		color: "text-blue-600",
		bg: "bg-blue-50",
	},
	{
		label: "Deal Mới",
		value: "45",
		unit: "DEALS",
		change: "+5",
		color: "text-violet-600",
		bg: "bg-violet-50",
	},
	{
		label: "Tỉ lệ chốt",
		value: "32%",
		unit: "%",
		change: "-2%",
		color: "text-rose-500",
		bg: "bg-rose-50",
	},
];

const MY_APPS = [
	{
		id: 1,
		name: "Nhân sự",
		icon: Users,
		color: "bg-orange-100",
		iconColor: "#ea580c",
	},
	{
		id: 2,
		name: "Kế toán",
		icon: PieChart,
		color: "bg-blue-100",
		iconColor: "#2563eb",
	},
	{
		id: 3,
		name: "Kho",
		icon: Box,
		color: "bg-emerald-100",
		iconColor: "#059669",
	},
	{
		id: 4,
		name: "Báo cáo",
		icon: FileBarChart,
		color: "bg-purple-100",
		iconColor: "#9333ea",
	},
	{
		id: 5,
		name: "Dự án",
		icon: Briefcase,
		color: "bg-pink-100",
		iconColor: "#db2777",
	},
];

const QUICK_ACTIONS = [
	{ id: "scan", label: "Quét QR", icon: QrCode },
	{ id: "add_user", label: "Thêm Khách", icon: UserPlus },
	{ id: "report", label: "Tạo Báo cáo", icon: FileText },
	{ id: "calendar", label: "Lịch hẹn", icon: CalendarDays },
];

const PIPELINE = [
	{ stage: "Mới", count: 5, color: "bg-blue-500" },
	{ stage: "Liên hệ", count: 8, color: "bg-indigo-500" },
	{ stage: "Gặp", count: 3, color: "bg-violet-500" },
	{ stage: "Đề xuất", count: 2, color: "bg-fuchsia-500" },
	{ stage: "Chốt", count: 12, color: "bg-emerald-500" },
];

// --- COMPONENTS ---

// GlassCard Component (Converted for RN)
const GlassCard = ({ children, className = "", style }: any) => (
	<View
		className={`bg-white/90 border border-white/60 rounded-[20px] shadow-sm ${className}`}
		style={[
			{
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.05,
				shadowRadius: 10,
			},
			style,
		]}
	>
		{children}
	</View>
);

// NavButton Component
const NavButton = ({ icon: Icon, active, onPress }: any) => (
	<TouchableOpacity
		onPress={onPress}
		className={`w-11 h-11 rounded-2xl items-center justify-center ${active ? "bg-blue-50" : ""
			}`}
	>
		<Icon
			size={24}
			color={active ? "#2563eb" : "#94a3b8"}
			strokeWidth={active ? 2.5 : 2}
		/>
	</TouchableOpacity>
);

// --- MAIN SCREEN ---

export default function IndexScreen() {
	const { user, logout } = useAuthStore();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("home");
	const [tapCount, setTapCount] = useState(0);
	const [showSettings, setShowSettings] = useState(false); // State quản lý Modal Setting

	// --- LOGIC ---
	const handleLogout = async () => {
		// Đóng modal trước khi logout để tránh leak
		setShowSettings(false);
		await logout();
		router.replace("/(auth)/login");
	};

	const handleSecretTap = () => {
		const newCount = tapCount + 1;
		setTapCount(newCount);
		if (newCount >= 5) {
			setTapCount(0);
			router.push("/debug");
		} else {
			setTimeout(() => setTapCount(0), 2000);
		}
	};

	return (
		<View className="flex-1 bg-[#F5F5F7]">
			<StatusBar barStyle="dark-content" />

			{/* Background Gradients */}
			<View className="absolute top-[-50] left-[-50] w-[300] h-[300] bg-blue-400/20 rounded-full blur-[80px]" />
			<View className="absolute bottom-[-50] right-[-50] w-[300] h-[300] bg-purple-400/20 rounded-full blur-[80px]" />

			<SafeAreaView className="flex-1">
				{/* --- HEADER --- */}
				<View className="px-5 pt-2 pb-3 flex-row justify-between items-center z-10">
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={handleSecretTap}
						className="flex-row items-center gap-3"
					>
						<View className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-white">
							<Image
								source={{
									uri:
										user?.avatar ||
										"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
								}}
								className="w-full h-full"
							/>
						</View>
						<View>
							<Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
								Xin chào
							</Text>
							<Text className="text-lg font-extrabold text-slate-800 leading-none">
								{user?.name || "Alex Trần"}
							</Text>
						</View>
					</TouchableOpacity>

					{/* Nút Thông Báo (Chỉ UI, không Logout nữa) */}
					<TouchableOpacity className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 items-center justify-center">
						<Bell size={20} color="#475569" strokeWidth={2.5} />
						<View className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
					</TouchableOpacity>
				</View>

				{/* --- SCROLLABLE CONTENT --- */}
				<ScrollView
					className="flex-1 px-5"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 100 }}
				>
					{/* Smart Search */}
					<View className="mb-6 mt-2">
						<View className="bg-white rounded-[18px] h-12 flex-row items-center px-4 gap-3 border border-slate-100 shadow-sm">
							<Search size={20} color="#94a3b8" />
							<TextInput
								placeholder="Tìm kiếm..."
								placeholderTextColor="#94a3b8"
								className="flex-1 text-slate-800 text-sm font-medium h-full"
							/>
							<TouchableOpacity className="p-2 bg-slate-100 rounded-xl">
								<Fingerprint size={20} color="#475569" />
							</TouchableOpacity>
						</View>
					</View>

					{/* My Apps */}
					<View className="mb-7">
						<View className="flex-row justify-between items-center mb-3">
							<Text className="text-sm font-bold text-slate-800">Ứng dụng</Text>
							<TouchableOpacity>
								<Text className="text-blue-600 text-xs font-bold">
									Xem tất cả
								</Text>
							</TouchableOpacity>
						</View>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							className="flex-row gap-4 overflow-visible pb-2"
						>
							{MY_APPS.map((app) => (
								<TouchableOpacity
									key={app.id}
									className="items-center gap-2 mr-4"
									activeOpacity={0.8}
								>
									<View
										className={`w-16 h-16 rounded-[22px] ${app.color} items-center justify-center border-2 border-white`}
									>
										<app.icon
											size={32}
											color={app.iconColor}
											strokeWidth={2}
										/>
									</View>
									<Text className="text-xs font-semibold text-slate-600 text-center">
										{app.name}
									</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>

					{/* Quick Actions */}
					<View className="flex-row flex-wrap justify-between mb-7">
						{QUICK_ACTIONS.map((action) => (
							<TouchableOpacity
								key={action.id}
								className="items-center gap-1.5 w-[23%]"
								activeOpacity={0.7}
							>
								<View className="w-14 h-14 rounded-[20px] bg-white border border-slate-100 items-center justify-center shadow-sm">
									<action.icon size={28} color="#334155" strokeWidth={1.5} />
								</View>
								<Text className="text-[11px] font-bold text-slate-500 text-center">
									{action.label}
								</Text>
							</TouchableOpacity>
						))}
					</View>

					{/* TEST: Navigate to Check-In Screen */}
					<TouchableOpacity
						onPress={() => router.push('/attendance')}
						className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl mb-6 active:opacity-80 shadow-lg"
					>
						<View className="flex-row items-center justify-between">
							<View className="flex-row items-center gap-3">
								<View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center">
									<CalendarDays size={28} color="#FFF" strokeWidth={2.5} />
								</View>
								<View>
									<Text className="text-white font-extrabold text-lg">
										Chấm công (Test)
									</Text>
									<Text className="text-white/80 text-xs">
										Chapter 3: Geofencing + Camera
									</Text>
								</View>
							</View>
							<ChevronRight size={24} color="#FFF" />
						</View>
					</TouchableOpacity>

					{/* Stats Grid */}
					<View className="flex-row flex-wrap gap-3 mb-6">
						{/* Big Card */}
						<GlassCard className="w-full p-5 flex-row justify-between h-32 overflow-hidden">
							<View className="absolute right-0 top-0 bottom-0 w-1/2 bg-blue-50 opacity-50" />

							<View>
								<Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1.5">
									Doanh thu T10
								</Text>
								<View className="flex-row items-baseline gap-2">
									<Text className="text-3xl font-black text-slate-800">
										2.4 <Text className="text-blue-600 text-xl font-bold">Tỷ</Text>
									</Text>
								</View>
								<View className="bg-emerald-50 px-2 py-1 rounded-lg self-start mt-1">
									<Text className="text-xs font-bold text-emerald-600">
										+12% vs tháng trước
									</Text>
								</View>
							</View>
							<View className="h-full justify-end pb-1 flex-row gap-1.5 items-end">
								{[40, 60, 45, 80, 50].map((h, i) => (
									<View
										key={i}
										className="w-2.5 bg-blue-500/20 rounded-t-md"
										style={{ height: `${h}%` }}
									/>
								))}
								<View className="w-2.5 bg-blue-600 rounded-t-md h-full" />
							</View>
						</GlassCard>

						{/* Small Cards */}
						{STATS.slice(1).map((stat, idx) => (
							<GlassCard key={idx} className="p-4 justify-between h-28 w-[48%]">
								<View className="flex-row justify-between items-start">
									<View
										className={`w-10 h-10 rounded-xl ${stat.bg} items-center justify-center`}
									>
										<Activity
											size={20}
											color={
												stat.color.includes("violet") ? "#7c3aed" : "#f43f5e"
											}
											strokeWidth={2.5}
										/>
									</View>
									<View
										className={`px-2 py-0.5 rounded-lg ${stat.change.includes("+") ? "bg-emerald-100" : "bg-rose-100"
											}`}
									>
										<Text
											className={`text-[10px] font-bold ${stat.change.includes("+")
												? "text-emerald-600"
												: "text-rose-600"
												}`}
										>
											{stat.change}
										</Text>
									</View>
								</View>
								<View>
									<Text className="text-xl font-bold text-slate-800">
										{stat.value}
									</Text>
									<Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
										{stat.label}
									</Text>
								</View>
							</GlassCard>
						))}
					</View>

					{/* Pipeline */}
					<View className="mb-6">
						<View className="flex-row justify-between items-center mb-3">
							<Text className="text-sm font-bold text-slate-800">Pipeline</Text>
							<MoreVertical size={20} color="#94a3b8" />
						</View>

						<View className="bg-white p-4 rounded-[24px] border border-slate-100 flex-row justify-between items-end h-36">
							{PIPELINE.map((col, idx) => (
								<View key={idx} className="items-center gap-2 w-[15%]">
									<View
										className={`w-3 rounded-full ${col.color} opacity-80`}
										style={{ height: (col.count / 15) * 100 + 15 }}
									/>
									<Text
										numberOfLines={1}
										className="text-[10px] font-bold text-slate-400 text-center w-full"
									>
										{col.stage}
									</Text>
								</View>
							))}
						</View>
					</View>
				</ScrollView>

				{/* --- SETTINGS MODAL --- */}
				<Modal
					animationType="fade"
					transparent={true}
					visible={showSettings}
					onRequestClose={() => setShowSettings(false)}
				>
					<View className="flex-1 bg-black/40 justify-center items-center px-5">
						<View className="bg-white/95 w-full rounded-[32px] p-6 shadow-2xl border border-white/60">
							{/* Header Modal */}
							<View className="flex-row justify-between items-center mb-6">
								<Text className="text-lg font-bold text-slate-800">Cài đặt & Tài khoản</Text>
								<TouchableOpacity
									onPress={() => setShowSettings(false)}
									className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center"
								>
									<X size={18} color="#64748b" />
								</TouchableOpacity>
							</View>

							{/* Profile Info Large */}
							<View className="items-center mb-8">
								<View className="w-24 h-24 rounded-full border-4 border-blue-50 shadow-sm mb-3 overflow-hidden">
									<Image
										source={{
											uri:
												user?.avatar ||
												"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
										}}
										className="w-full h-full"
									/>
								</View>
								<Text className="text-xl font-extrabold text-slate-800">
									{user?.name || "Alex Trần"}
								</Text>
								<Text className="text-sm text-slate-500 font-medium">
									{user?.position || "CEO & Founder"}
								</Text>
							</View>

							{/* Menu Options */}
							<View className="space-y-3 w-full">
								<TouchableOpacity
									className="flex-row items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 active:bg-slate-100"
									onPress={() => { /* Navigate to system settings */ }}
								>
									<View className="flex-row items-center gap-3">
										<View className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-slate-100">
											<Settings size={20} color="#3b82f6" />
										</View>
										<Text className="font-bold text-slate-700">Cấu hình hệ thống</Text>
									</View>
									<ChevronRight size={20} color="#cbd5e1" />
								</TouchableOpacity>

								{/* Logout Button */}
								<TouchableOpacity
									className="flex-row items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100 active:bg-red-100 mt-2"
									onPress={handleLogout}
								>
									<View className="flex-row items-center gap-3">
										<View className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-red-100">
											<LogOut size={20} color="#ef4444" />
										</View>
										<Text className="font-bold text-red-500">Đăng xuất</Text>
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

				{/* --- NAVIGATION ISLAND --- */}
				<View className="absolute bottom-6 left-0 right-0 items-center">
					<View className="w-[88%] bg-white/95 border border-white/60 rounded-[28px] p-2 flex-row justify-between items-center shadow-lg shadow-black/5">
						<NavButton
							icon={Home}
							active={activeTab === "home"}
							onPress={() => setActiveTab("home")}
						/>
						<NavButton
							icon={Users}
							active={activeTab === "users"}
							onPress={() => setActiveTab("users")}
						/>

						{/* Center Big Button */}
						<TouchableOpacity
							activeOpacity={0.9}
							className="relative -mt-10 mx-2 shadow-xl shadow-blue-500/40"
							onPress={() => { }}
						>
							<View className="w-14 h-14 bg-blue-600 rounded-full items-center justify-center border-[5px] border-[#F5F5F7]">
								<Plus size={28} color="#FFF" strokeWidth={3} />
							</View>
						</TouchableOpacity>

						<NavButton
							icon={BarChart3}
							active={activeTab === "stats"}
							onPress={() => setActiveTab("stats")}
						/>
						{/* Nút Setting: Mở Modal thay vì chuyển Tab */}
						<NavButton
							icon={Settings}
							active={activeTab === "settings" || showSettings} // Active khi modal mở
							onPress={() => setShowSettings(true)}
						/>
					</View>
				</View>
			</SafeAreaView>
		</View>
	);
}