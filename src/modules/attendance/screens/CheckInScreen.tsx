import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeLocation } from '../../../core/hardware/useSafeLocation';
import { CameraWidget } from '../components/CameraWidget';
import { attendanceMockRepo } from '../attendance.mock';
import { DynamicIcon } from '../../../components/ui/DynamicIcon';
import { GlassCard } from '../../../components/ui/GlassCard';

/**
 * CheckInScreen - Attendance Check-In/Out
 * 
 * Features:
 * - Realtime clock
 * - Camera widget
 * - Text-based location display (Zero-Config, no Maps API)
 * - Geofencing validation
 * - Debug buttons (DEV only)
 * 
 * TODO: Chapter 3.8 - Wrap this in useMutation with networkMode: 'offlineFirst'
 * This will enable offline sync when network is unavailable
 */

export default function CheckInScreen() {
    const location = useSafeLocation();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [photoBase64, setPhotoBase64] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [debugLocation, setDebugLocation] = useState<{ lat: number; lng: number } | null>(null);

    // Realtime clock (updates every second)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Get current location (real or debug overr ide)
    const getCurrentLocation = () => {
        if (debugLocation) {
            return {
                latitude: debugLocation.lat,
                longitude: debugLocation.lng,
            };
        }
        return location.coords
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            }
            : null;
    };

    // Handle Check-In
    const handleCheckIn = async () => {
        const coords = getCurrentLocation();

        if (!coords) {
            Alert.alert('Error', 'Location not available. Please try again.');
            return;
        }

        try {
            setIsChecking(true);

            // Call mock repository
            const response = await attendanceMockRepo.checkIn({
                latitude: coords.latitude,
                longitude: coords.longitude,
                photo_base64: photoBase64 || undefined,
                is_mock: location.is_mock || !!debugLocation,
                timestamp: new Date().toISOString(),
            });

            // Success
            Alert.alert('✅ Success', response.message);
            setIsChecking(false);
            setPhotoBase64(null); // Reset photo
            setDebugLocation(null); // Reset debug location
        } catch (error: any) {
            setIsChecking(false);

            const message = error.message || 'Unknown error';

            if (message.startsWith('OUT_OF_RANGE:')) {
                // Geofencing error
                Alert.alert('📍 Too Far from Office', message.replace('OUT_OF_RANGE:', ''));
            } else if (message.startsWith('IMAGE_TOO_LARGE:')) {
                // Image size error
                Alert.alert('📷 Image Too Large', message.replace('IMAGE_TOO_LARGE:', ''));
            } else {
                // Generic error
                Alert.alert('❌ Error', message);
            }
        }
    };

    // Debug: Simulate locations (DEV only)
    const handleDebugLocation = (preset: 'near' | 'far' | 'office' | 'reset') => {
        if (preset === 'reset') {
            setDebugLocation(null);
            Alert.alert('Debug', 'Using real location');
            return;
        }

        const coords = attendanceMockRepo.debugSimulateLocation(preset);
        setDebugLocation({ lat: coords.lat, lng: coords.lng });

        const labels = {
            near: '185m from office (✅ Within geofence)',
            far: '500m from office (❌ Outside geofence)',
            office: 'At office (0m)',
        };

        Alert.alert('Debug Location', labels[preset]);
    };

    const coords = getCurrentLocation();
    const officeInfo = attendanceMockRepo.getOfficeLocation();

    return (
        <SafeAreaView className="flex-1 bg-slate-100">
            {/* Header with Realtime Clock */}
            <View className="px-5 py-4 bg-white border-b border-slate-200">
                <Text className="text-2xl font-bold text-slate-800">Check-In</Text>
                <View className="flex-row items-center gap-2 mt-1">
                    <DynamicIcon name="clock" size={16} color="#64748b" />
                    <Text className="text-slate-500 font-medium">
                        {currentTime.toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        })}
                    </Text>
                    <Text className="text-slate-400 text-sm ml-2">
                        {currentTime.toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                        })}
                    </Text>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Camera Widget (50% height) */}
                <View style={{ height: 300 }}>
                    <CameraWidget
                        onPhotoTaken={(base64) => {
                            setPhotoBase64(base64);
                            Alert.alert('Photo Captured', 'Photo ready for check-in');
                        }}
                    />
                </View>

                {/* Location Info Card */}
                <View className="p-4">
                    <GlassCard className="p-4">
                        <View className="flex-row items-center gap-2 mb-3">
                            <DynamicIcon name="map-pin" size={20} color="#3b82f6" />
                            <Text className="text-lg font-bold text-slate-800">Your Location</Text>
                        </View>

                        {location.loading ? (
                            <Text className="text-slate-500">📡 Getting location...</Text>
                        ) : coords ? (
                            <View>
                                {/* Coordinates (Text-based, Zero-Config safe) */}
                                <View className="bg-slate-50 p-3 rounded-lg mb-2">
                                    <Text className="text-xs text-slate-500 mb-1">Latitude</Text>
                                    <Text className="text-sm font-mono font-bold text-slate-700">
                                        {coords.latitude.toFixed(6)}
                                    </Text>
                                </View>
                                <View className="bg-slate-50 p-3 rounded-lg mb-2">
                                    <Text className="text-xs text-slate-500 mb-1">Longitude</Text>
                                    <Text className="text-sm font-mono font-bold text-slate-700">
                                        {coords.longitude.toFixed(6)}
                                    </Text>
                                </View>

                                {/* Status badges */}
                                <View className="flex-row flex-wrap gap-2 mt-2">
                                    {(location.is_mock || debugLocation) && (
                                        <View className="bg-orange-100 px-3 py-1.5 rounded-lg">
                                            <Text className="text-orange-700 text-xs font-bold">
                                                ⚠️ Mock Location
                                            </Text>
                                        </View>
                                    )}
                                    {photoBase64 && (
                                        <View className="bg-green-100 px-3 py-1.5 rounded-lg">
                                            <Text className="text-green-700 text-xs font-bold">
                                                ✅ Photo Ready
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ) : (
                            <Text className="text-red-500">❌ Location unavailable</Text>
                        )}
                    </GlassCard>

                    {/* Office Info */}
                    <GlassCard className="p-4 mt-3">
                        <View className="flex-row items-center gap-2 mb-2">
                            <DynamicIcon name="home" size={18} color="#8b5cf6" />
                            <Text className="font-bold text-slate-700">Office Location</Text>
                        </View>
                        <Text className="text-sm text-slate-600">
                            {officeInfo.name} ({officeInfo.latitude.toFixed(4)}, {officeInfo.longitude.toFixed(4)})
                        </Text>
                        <Text className="text-xs text-slate-500 mt-1">
                            Geofence radius: {officeInfo.geofence_radius}m
                        </Text>
                    </GlassCard>
                </View>

                {/* Debug Buttons (DEV only) */}
                {__DEV__ && (
                    <View className="px-4 pb-4">
                        <Text className="text-xs font-bold text-orange-600 mb-2">
                            🛠️ Debug Location Simulation
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                            <TouchableOpacity
                                onPress={() => handleDebugLocation('office')}
                                className="bg-blue-500 px-4 py-2 rounded-lg"
                            >
                                <Text className="text-white text-xs font-bold">📍 At Office</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDebugLocation('near')}
                                className="bg-emerald-500 px-4 py-2 rounded-lg"
                            >
                                <Text className="text-white text-xs font-bold">🟢 Near (185m)</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDebugLocation('far')}
                                className="bg-rose-500 px-4 py-2 rounded-lg"
                            >
                                <Text className="text-white text-xs font-bold">🔴 Far (500m)</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDebugLocation('reset')}
                                className="bg-slate-500 px-4 py-2 rounded-lg"
                            >
                                <Text className="text-white text-xs font-bold">♻️ Reset</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Check-In Button */}
            <View className="p-4 bg-white border-t border-slate-200">
                <TouchableOpacity
                    onPress={handleCheckIn}
                    disabled={isChecking || !coords}
                    className={`py-4 rounded-xl items-center flex-row justify-center gap-2 ${isChecking || !coords ? 'bg-slate-300' : 'bg-blue-600 active:opacity-80'
                        }`}
                >
                    {isChecking ? (
                        <Text className="text-white font-bold text-lg">Checking...</Text>
                    ) : (
                        <>
                            <DynamicIcon name="check-circle" size={24} color="#FFF" />
                            <Text className="text-white font-bold text-lg">Check-In Now</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
