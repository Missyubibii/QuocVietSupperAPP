import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-slate-800">Settings</Text>
        <Text className="text-slate-500 mt-2">Coming soon in future chapters</Text>
      </View>
    </SafeAreaView>
  );
}
