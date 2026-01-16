import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Device from 'expo-device';
import { getDistance } from 'geolib';
import {
    MapPin, Camera, CheckCircle2, XCircle, RefreshCw, ArrowLeft,
    Navigation, ShieldCheck
} from 'lucide-react-native';
import { useNotificationStore } from '../../notification/store';

// --- CẤU HÌNH TỌA ĐỘ ---
const OFFICE_LOCATION = {
    latitude: 18.67486,
    longitude: 105.68106,
    name: "CÔNG TY TNHH CÔNG NGHỆ QUỐC VIỆT",
};
const ALLOWED_RADIUS = 200;

type Step = 'LOCATION_VERIFY' | 'FACE_VERIFY' | 'SUCCESS';

export default function CheckInScreen() {
    const router = useRouter();
    const cameraRef = useRef<any>(null);
    const isDevice = Device.isDevice;
    const { addNotification } = useNotificationStore();
    const [step, setStep] = useState<Step>('LOCATION_VERIFY');
    const [permission, requestPermission] = useCameraPermissions();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [address, setAddress] = useState<string>("Đang lấy dữ liệu...");
    const [locStatus, setLocStatus] = useState<'CHECKING' | 'VALID' | 'INVALID'>('CHECKING');
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    // --- LOGIC: LOCATION ---
    useEffect(() => {
        if (step === 'LOCATION_VERIFY') verifyLocation();
    }, [step]);

    const verifyLocation = async () => {
        setLocStatus('CHECKING');
        setAddress("Đang định vị vệ tinh...");
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Cần quyền', 'Vui lòng cho phép truy cập vị trí.');
            router.back();
            return;
        }

        try {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
            setLocation(loc);
            const dist = getDistance(
                { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
                { latitude: OFFICE_LOCATION.latitude, longitude: OFFICE_LOCATION.longitude }
            );
            setDistance(dist);

            try {
                const reverse = await Location.reverseGeocodeAsync({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude
                });
                if (reverse.length > 0) {
                    const addr = reverse[0];
                    const fullAddr = [addr.streetNumber, addr.street, addr.district, addr.city || addr.subregion].filter(Boolean).join(', ');
                    setAddress(fullAddr || "Không xác định tên đường");
                }
            } catch (err) {
                setAddress(`${loc.coords.latitude.toFixed(5)}, ${loc.coords.longitude.toFixed(5)}`);
            }

            setLocStatus(dist <= ALLOWED_RADIUS ? 'VALID' : 'INVALID');
        } catch (e) {
            setAddress("Lỗi định vị. Vui lòng thử lại.");
            setLocStatus('INVALID');
        }
    };

    // --- LOGIC: CAMERA & NOTIFICATION ---
    const handleFaceCapture = async () => {
        if (isDevice && cameraRef.current && !isCapturing) {
            try {
                setIsCapturing(true);
                const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
                const manipulated = await ImageManipulator.manipulateAsync(
                    photo.uri,
                    [{ resize: { width: 600 } }],
                    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                );
                setCapturedImage(manipulated.uri);

                const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                addNotification(
                    'Chấm công thành công',
                    `Bạn đã check-in vào lúc ${time} tại văn phòng.`,
                    'SUCCESS'
                );

                setStep('SUCCESS');
            } catch (error) {
                Alert.alert("Lỗi", "Không chụp được ảnh.");
            } finally {
                setIsCapturing(false);
            }
        } else if (!isDevice) {
            // Mock Simulator
            setTimeout(() => {
                setCapturedImage("https://via.placeholder.com/300");
                addNotification('Chấm công Mock', 'Check-in giả lập thành công', 'WARNING');
                setStep('SUCCESS');
            }, 1000);
        }
    };

    // --- HEADER COMPONENT ---
    const renderHeader = (title: string, subtitle: string) => (
        <View className="px-6 py-4 border-b border-slate-100 bg-white shadow-sm z-10">
            <View className="flex-row items-center gap-3">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center border border-slate-100">
                    <ArrowLeft size={20} color="#334155" />
                </TouchableOpacity>
                <View>
                    <Text className="text-lg font-bold text-slate-800">{title}</Text>
                    <Text className="text-xs text-slate-500 font-medium">{subtitle}</Text>
                </View>
            </View>
        </View>
    );

    // --- BƯỚC 1: VỊ TRÍ ---
    if (step === 'LOCATION_VERIFY') {
        return (
            <SafeAreaView className="flex-1 bg-white">
                {renderHeader("Bước 1/2", "Xác thực vị trí làm việc")}
                <View className="flex-1 items-center justify-center px-6">
                    <View className={`w-32 h-32 rounded-full items-center justify-center mb-6 shadow-xl ${locStatus === 'CHECKING' ? 'bg-blue-50' : locStatus === 'VALID' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                        {locStatus === 'CHECKING' && <ActivityIndicator size="large" color="#3b82f6" />}
                        {locStatus === 'VALID' && <MapPin size={48} color="#059669" />}
                        {locStatus === 'INVALID' && <XCircle size={48} color="#ef4444" />}
                    </View>
                    <Text className="text-xl font-bold text-slate-800 text-center mb-2">
                        {locStatus === 'CHECKING' ? 'Đang định vị...' : locStatus === 'VALID' ? 'Vị trí Hợp lệ!' : 'Bạn đang ở quá xa!'}
                    </Text>
                    <View className="bg-slate-50 p-5 rounded-2xl w-full mb-8 border border-slate-200">
                        <View className="flex-row gap-2 mb-2 items-center">
                            <Navigation size={16} color="#64748b" />
                            <Text className="text-xs font-bold text-slate-500 uppercase">Vị trí hiện tại</Text>
                        </View>
                        <Text className="text-slate-800 font-medium text-base">{address}</Text>
                        {distance !== null && (
                            <Text className={`text-xs mt-2 font-bold ${distance <= ALLOWED_RADIUS ? 'text-emerald-700' : 'text-rose-700'}`}>
                                Khoảng cách: {distance}m {distance > ALLOWED_RADIUS && '(Yêu cầu < 200m)'}
                            </Text>
                        )}
                    </View>
                    {locStatus === 'VALID' && (
                        <TouchableOpacity onPress={() => setStep('FACE_VERIFY')} className="w-full bg-blue-600 py-4 rounded-xl items-center shadow-lg active:opacity-90">
                            <Text className="text-white font-bold text-base">Tiếp tục: Chụp ảnh</Text>
                        </TouchableOpacity>
                    )}
                    {(locStatus === 'INVALID' || (locStatus === 'CHECKING' && !location)) && locStatus !== 'CHECKING' && (
                        <TouchableOpacity onPress={verifyLocation} className="w-full bg-slate-800 py-4 rounded-xl items-center flex-row justify-center gap-2 active:opacity-90">
                            <RefreshCw size={18} color="#FFF" />
                            <Text className="text-white font-bold">Thử lại</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    // --- BƯỚC 2: CAMERA (FIXED LAYOUT) ---
    if (step === 'FACE_VERIFY') {
        if (!permission?.granted && permission?.canAskAgain) requestPermission();

        return (
            <View className="flex-1 bg-black">
                {/* 1. Camera Layer (Nằm dưới cùng) */}
                <CameraView
                    ref={cameraRef}
                    style={StyleSheet.absoluteFill} // Dùng absoluteFill thay vì flex:1
                    facing="front"
                />

                {/* 2. UI Overlay Layer (Nằm đè lên trên, cùng cấp với CameraView) */}
                <SafeAreaView className="flex-1 justify-between">
                    {/* Header */}
                    <View className="px-6 py-4 flex-row items-center justify-between">
                        <TouchableOpacity onPress={() => setStep('LOCATION_VERIFY')} className="w-10 h-10 bg-black/50 rounded-full items-center justify-center border border-white/20">
                            <ArrowLeft size={24} color="#FFF" />
                        </TouchableOpacity>
                        <View className="bg-black/50 px-4 py-2 rounded-full border border-white/20">
                            <Text className="text-white font-bold text-sm">Bước 2/2: Xác thực khuôn mặt</Text>
                        </View>
                        <View className="w-10" />
                    </View>

                    {/* Face Frame */}
                    <View className="items-center justify-center">
                        <View className="w-72 h-96 border-2 border-white/30 rounded-[48px] relative overflow-hidden bg-black/10">
                            <View className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-emerald-400 rounded-tl-3xl" />
                            <View className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-emerald-400 rounded-tr-3xl" />
                            <View className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-emerald-400 rounded-bl-3xl" />
                            <View className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-emerald-400 rounded-br-3xl" />
                        </View>
                        <Text className="text-white/90 mt-6 font-medium text-center bg-black/50 px-6 py-2 rounded-full overflow-hidden">
                            Giữ khuôn mặt thẳng
                        </Text>
                    </View>

                    {/* Footer Button */}
                    <View className="p-10 items-center">
                        <TouchableOpacity
                            onPress={handleFaceCapture}
                            disabled={isCapturing}
                            className="w-20 h-20 bg-white rounded-full items-center justify-center border-4 border-blue-500/30 shadow-lg"
                        >
                            {isCapturing ? <ActivityIndicator color="#2563eb" /> : <View className="w-16 h-16 bg-blue-600 rounded-full" />}
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    // --- BƯỚC 3: THÀNH CÔNG ---
    if (step === 'SUCCESS') {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
                <View className="w-28 h-28 bg-emerald-100 rounded-full items-center justify-center mb-6">
                    <ShieldCheck size={56} color="#059669" />
                </View>
                <Text className="text-2xl font-bold text-slate-800 text-center mb-2">Chấm công Thành công!</Text>
                <Text className="text-slate-500 text-center mb-10 px-8">Dữ liệu đã được ghi nhận.</Text>
                <View className="bg-slate-50 p-5 rounded-2xl w-full mb-8 flex-row items-center gap-4 border border-slate-100">
                    {capturedImage && <Image source={{ uri: capturedImage }} className="w-20 h-20 rounded-xl bg-slate-200" />}
                    <View>
                        <Text className="text-xs text-slate-400 font-bold uppercase mb-1">Thời gian</Text>
                        <Text className="text-slate-800 font-bold text-xl">{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</Text>
                        <Text className="text-slate-500 text-sm">{new Date().toLocaleDateString('vi-VN')}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => router.replace('/')} className="w-full bg-slate-900 py-4 rounded-xl items-center shadow-lg active:opacity-90">
                    <Text className="text-white font-bold text-base">Về trang chủ</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return null;
}