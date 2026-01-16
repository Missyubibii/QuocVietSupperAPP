import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { GlassCard } from '../../../components/ui/GlassCard';
import { DynamicIcon } from '../../../components/ui/DynamicIcon';
import { useAuthStore } from '../store';
import { LoginSchema, type LoginFormData } from '../auth.types';
import { useNotificationStore } from '../../notification/store';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const { login } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { username: '', password: '' },
  });

  useEffect(() => {
    (async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        setBiometricAvailable(hasHardware && isEnrolled);

        const { loadBiometricPreference } = useAuthStore.getState();
        await loadBiometricPreference();
      } catch (error) {
        console.log('[Biometric] Hardware check failed:', error);
        setBiometricAvailable(false);
      }
    })();
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data.username, data.password);

      addNotification(
        'Đăng nhập thành công',
        `Chào mừng ${data.username} quay trở lại!`,
        'SUCCESS'
      );

      if (biometricAvailable) {
        const { enableBiometric } = useAuthStore.getState();
        Alert.alert(
          'Đăng nhập nhanh',
          'Bạn có muốn bật đăng nhập bằng vân tay/FaceID cho lần sau không?',
          [
            {
              text: 'Không',
              style: 'cancel',
              onPress: async () => {
                await enableBiometric(false);
                router.replace('/');
              },
            },
            {
              text: 'Có',
              onPress: async () => {
                await enableBiometric(true);
                router.replace('/');
              },
            },
          ]
        );
      } else {
        router.replace('/');
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('401')) {
        Alert.alert('Đăng nhập thất bại', 'Sai tên đăng nhập hoặc mật khẩu.');
      } else {
        Alert.alert('Lỗi hệ thống', errorMessage || 'Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Đăng nhập bằng sinh trắc học',
        fallbackLabel: 'Sử dụng mật khẩu',
      });

      if (result.success) {
        setLoading(true);
        try {
          await login('test_user', '123456');

          addNotification(
            'Xác thực thành công',
            'Đăng nhập nhanh bằng vân tay/FaceID',
            'SUCCESS'
          );

          router.replace('/');
        } catch (error) {
          Alert.alert('Lỗi', 'Xác thực sinh trắc học thất bại');
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('[Biometric] Authentication error:', error);
      Alert.alert('Lỗi', 'Thiết bị không hỗ trợ hoặc chưa cài đặt');
    }
  };

  const handleMockBiometricLogin = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await login('test_user', '123456');

      addNotification(
        'Mock Login',
        'Đăng nhập giả lập thành công (Dev Mode)',
        'WARNING'
      );

      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Mock biometric login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        contentContainerClassName="flex-1 justify-center px-6"
        className="bg-gradient-to-b from-purple-100 to-blue-100"
        keyboardShouldPersistTaps="handled"
      >
        <GlassCard className="p-8">
          <View className="items-center mb-8">
            <DynamicIcon name="lock" size={64} color="#8B5CF6" />
            <Text className="text-2xl font-bold text-purple-700 mt-4">QUỐC VIỆT SUPER APP</Text>
            <Text className="text-gray-600 mt-1">Đăng nhập để tiếp tục</Text>
          </View>

          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">Tên đăng nhập</Text>
                <View className="flex-row items-center bg-white/60 rounded-xl px-4 py-3 border border-white">
                  <DynamicIcon name="user" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800"
                    placeholder="Nhập tên đăng nhập"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>
                {errors.username && (
                  <Text className="text-red-500 text-sm mt-1">{errors.username.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View className="mb-6">
                <Text className="text-gray-700 mb-2 font-medium">Mật khẩu</Text>
                <View className="flex-row items-center bg-white/60 rounded-xl px-4 py-3 border border-white">
                  <DynamicIcon name="lock" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800"
                    placeholder="Nhập mật khẩu"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    editable={!loading}
                  />
                </View>
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>
                )}
              </View>
            )}
          />

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            className={`bg-purple-600 py-4 rounded-xl ${loading ? 'opacity-50' : ''}`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Text>
          </TouchableOpacity>

          {biometricAvailable && useAuthStore.getState().isBiometricEnabled && (
            <TouchableOpacity
              onPress={handleBiometricLogin}
              disabled={loading}
              className={`mt-4 py-3 border-2 border-purple-600 rounded-xl ${loading ? 'opacity-50' : ''}`}
            >
              <View className="flex-row items-center justify-center">
                <DynamicIcon name="unlock" size={20} color="#8B5CF6" />
                <Text className="text-purple-700 font-semibold ml-2">Đăng nhập bằng sinh trắc học</Text>
              </View>
            </TouchableOpacity>
          )}

          {__DEV__ && !biometricAvailable && (
            <TouchableOpacity
              onPress={handleMockBiometricLogin}
              disabled={loading}
              className={`mt-4 py-3 border-2 border-orange-500 bg-orange-50 rounded-xl ${loading ? 'opacity-50' : ''}`}
            >
              <View className="flex-row items-center justify-center">
                <DynamicIcon name="unlock" size={20} color="#F97316" />
                <Text className="text-orange-600 font-semibold ml-2">Mock Biometric (Dev Only)</Text>
              </View>
            </TouchableOpacity>
          )}
        </GlassCard>

        {__DEV__ && (
          <View className="mt-6 px-4">
            <Text className="text-center text-sm text-gray-700 bg-yellow-100 p-3 rounded-lg">
              🔑 Mock Credentials:{'\n'}
              Username: <Text className="font-bold">any username</Text>{'\n'}
              Password: <Text className="font-bold">123456</Text>
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}