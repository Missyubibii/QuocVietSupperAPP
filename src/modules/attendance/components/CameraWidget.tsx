import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Device from 'expo-device';
import { DynamicIcon } from '../../../components/ui/DynamicIcon';

/**
 * CameraWidget - Photo capture with simulator fallback
 * 
 * Features:
 * - Real camera on physical devices
 * - Mock mode on simulator/Antigravity
 * - Permission handling with UI feedback
 * - Image compression (1024px, 50% quality)
 * 
 * Zero-Config Bug Compliance: Works everywhere
 */

interface CameraWidgetProps {
    onPhotoTaken: (base64: string) => void;
}

export function CameraWidget({ onPhotoTaken }: CameraWidgetProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const [isTakingPhoto, setIsTakingPhoto] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false); // ✅ ADDED
    const cameraRef = useRef<any>(null);

    const isSimulator = !Device.isDevice;

    const handleTakePhoto = async () => {
        // Simulator mode: Mock photo
        if (isSimulator) {
            Alert.alert(
                '📸 Simulator Mode',
                'Camera not available. Using mock photo for testing.',
                [
                    {
                        text: 'Generate Mock Photo',
                        onPress: () => {
                            // Return a small mock base64 (timestamp-based unique ID)
                            const mockPhoto = `MOCK_PHOTO_${Date.now()}`;
                            onPhotoTaken(mockPhoto);

                            if (__DEV__) {
                                console.log('[CameraWidget] Mock photo generated:', mockPhoto.substring(0, 30) + '...');
                            }
                        },
                    },
                    { text: 'Cancel', style: 'cancel' },
                ]
            );
            return;
        }

        // Real device: Capture photo
        if (!cameraRef.current || !isCameraReady) { // ✅ CHECK isCameraReady
            if (__DEV__) {
                console.warn('[CameraWidget] Camera not ready yet');
            }
            return;
        }

        try {
            setIsTakingPhoto(true);

            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.6,
                base64: false,
            });

            // Compress image to reduce size
            const compressed = await ImageManipulator.manipulateAsync(
                photo.uri,
                [{ resize: { width: 1024 } }], // Max width 1024px
                {
                    compress: 0.5, // 50% quality
                    format: ImageManipulator.SaveFormat.JPEG,
                    base64: true
                }
            );

            if (compressed.base64) {
                onPhotoTaken(compressed.base64);

                if (__DEV__) {
                    const sizeKB = Math.round((compressed.base64.length * 0.75) / 1024);
                    console.log(`[CameraWidget] Photo compressed: ${sizeKB}KB`);
                }
            }

            setIsTakingPhoto(false);
        } catch (error) {
            setIsTakingPhoto(false);
            Alert.alert('Camera Error', 'Failed to take photo. Please try again.');

            if (__DEV__) {
                console.error('[CameraWidget] Error:', error);
            }
        }
    };

    // Permission not granted
    if (!permission?.granted) {
        return (
            <View className="flex-1 bg-slate-900 items-center justify-center px-6">
                <DynamicIcon name="camera" size={64} color="#94a3b8" />
                <Text className="text-white text-lg font-bold mt-4 text-center">
                    Camera Permission Required
                </Text>
                <Text className="text-slate-400 text-sm mt-2 text-center">
                    We need camera access to capture your check-in photo
                </Text>
                <TouchableOpacity
                    onPress={requestPermission}
                    className="bg-blue-600 px-8 py-3 rounded-xl mt-6 active:opacity-80"
                >
                    <Text className="text-white font-bold">Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Simulator mode fallback
    if (isSimulator) {
        return (
            <View className="flex-1 bg-slate-900 items-center justify-center px-6">
                <View className="w-20 h-20 bg-slate-700 rounded-full items-center justify-center mb-4">
                    <DynamicIcon name="camera" size={40} color="#94a3b8" />
                </View>
                <Text className="text-slate-400 text-sm mb-1">Simulator Mode</Text>
                <Text className="text-white font-bold text-lg">Camera Not Available</Text>
                <TouchableOpacity
                    onPress={handleTakePhoto}
                    className="bg-blue-600 px-8 py-3 rounded-xl mt-6 active:opacity-80"
                >
                    <Text className="text-white font-bold">📸 Generate Mock Photo</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Real camera
    return (
        <View className="flex-1 relative">
            <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing="front"
                onCameraReady={() => setIsCameraReady(true)} // ✅ ADDED
            >
                {/* Camera overlay */}
                <View className="flex-1 justify-end items-center pb-8">
                    {/* Capture button */}
                    <TouchableOpacity
                        onPress={handleTakePhoto}
                        disabled={isTakingPhoto || !isCameraReady} // ✅ DISABLED until ready
                        className="w-20 h-20 rounded-full border-4 border-white/80 items-center justify-center active:opacity-70"
                        style={{
                            backgroundColor: (isTakingPhoto || !isCameraReady) ? '#94a3b8' : '#FFFFFF',
                        }}
                    >
                        {isTakingPhoto ? (
                            <Text className="text-xs text-white">...</Text>
                        ) : !isCameraReady ? (
                            <Text className="text-xs text-white">⏳</Text> // ✅ SHOW loading
                        ) : (
                            <View className="w-16 h-16 bg-blue-600 rounded-full" />
                        )}
                    </TouchableOpacity>

                    {isTakingPhoto && (
                        <Text className="text-white text-sm mt-2">Processing...</Text>
                    )}
                    {!isCameraReady && !isTakingPhoto && (
                        <Text className="text-white text-sm mt-2">Đang khởi động camera...</Text>
                    )}
                </View>
            </CameraView>
        </View>
    );
}
