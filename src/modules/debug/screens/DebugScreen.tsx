import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useLogStore } from '../../../core/logger/store';
import { safeStringify } from '../../../core/logger/types';
import { GlassCard } from '../../../components/ui/GlassCard';
import { DynamicIcon } from '../../../components/ui/DynamicIcon';
import type { LogEntry } from '../../../core/logger/types';

export default function DebugScreen() {
  const { logs, clearLogs, getLogsAsString } = useLogStore();
  const router = useRouter();
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  // Color mapping for log types
  const getLogColor = (type: string): string => {
    switch (type) {
      case 'API_ERR':
      case 'ZOD_ERR':
      case 'UI_CRASH':
        return '#EF4444'; // Red
      case 'API_REQ':
        return '#3B82F6'; // Blue
      case 'API_RES':
        return '#10B981'; // Green
      case 'SYSTEM':
        return '#6B7280'; // Gray
      default:
        return '#8B5CF6'; // Purple
    }
  };

  // Get background color for log type badge
  const getBadgeColor = (type: string): string => {
    switch (type) {
      case 'API_ERR':
      case 'ZOD_ERR':
      case 'UI_CRASH':
        return '#FEE2E2'; // Light red
      case 'API_REQ':
        return '#DBEAFE'; // Light blue
      case 'API_RES':
        return '#D1FAE5'; // Light green
      case 'SYSTEM':
        return '#F3F4F6'; // Light gray
      default:
        return '#EDE9FE'; // Light purple
    }
  };

  const handleClearLogs = () => {
    Alert.alert(
      'Clear All Logs?',
      'This will delete all log entries. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearLogs();
            Alert.alert('Success', 'All logs cleared');
          },
        },
      ]
    );
  };

  const handleCopyAll = async () => {
    const logsText = getLogsAsString();
    await Clipboard.setStringAsync(logsText);
    Alert.alert('Success', 'All logs copied to clipboard');
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const renderLogItem = ({ item }: { item: LogEntry }) => {
    const color = getLogColor(item.type);
    const badgeColor = getBadgeColor(item.type);

    return (
      <TouchableOpacity
        onPress={() => setSelectedLog(item)}
        className="mb-2"
      >
        <GlassCard className="p-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center flex-1">
              <View
                style={{ backgroundColor: badgeColor }}
                className="px-2 py-1 rounded"
              >
                <Text style={{ color }} className="text-xs font-bold">
                  {item.type}
                </Text>
              </View>
              <Text className="text-gray-500 text-xs ml-2">
                {formatTime(item.timestamp)}
              </Text>
            </View>
            <DynamicIcon name="chevron-right" size={20} color="#9CA3AF" />
          </View>
          <Text className="text-gray-800 font-medium" numberOfLines={2}>
            {item.title}
          </Text>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <View className="px-4 py-3 bg-white/80 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3 p-2 rounded-lg bg-gray-100"
            >
              <Text className="text-xl">←</Text>
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-bold text-gray-800">Debug Logs</Text>
              <Text className="text-sm text-gray-600">{logs.length} / 50 entries</Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleCopyAll}
              className="mr-2 p-2 rounded-lg bg-blue-100"
              disabled={logs.length === 0}
            >
              <DynamicIcon name="file" size={20} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleClearLogs}
              className="p-2 rounded-lg bg-red-100"
              disabled={logs.length === 0}
            >
              <DynamicIcon name="x" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Log List */}
      {logs.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <DynamicIcon name="file" size={64} color="#D1D5DB" />
          <Text className="text-gray-500 text-lg font-medium mt-4">No logs yet</Text>
          <Text className="text-gray-400 text-center mt-2">
            Logs will appear here as you use the app
          </Text>
        </View>
      ) : (
        <FlashList
          data={logs}
          renderItem={renderLogItem}
          contentContainerStyle={{ padding: 16 }}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* Detail Modal */}
      <Modal
        visible={selectedLog !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedLog(null)}
      >
        <SafeAreaView className="flex-1 bg-gray-100">
          {selectedLog && (
            <>
              {/* Modal Header */}
              <View className="px-4 py-3 bg-white border-b border-gray-200">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View
                      style={{ backgroundColor: getBadgeColor(selectedLog.type) }}
                      className="px-3 py-1 rounded self-start"
                    >
                      <Text
                        style={{ color: getLogColor(selectedLog.type) }}
                        className="text-sm font-bold"
                      >
                        {selectedLog.type}
                      </Text>
                    </View>
                    <Text className="text-gray-600 text-sm mt-1">
                      {formatTime(selectedLog.timestamp)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedLog(null)}
                    className="p-2 rounded-lg bg-gray-100"
                  >
                    <DynamicIcon name="x" size={24} color="#374151" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Modal Content */}
              <ScrollView className="flex-1 p-4">
                <GlassCard className="p-4 mb-4">
                  <Text className="text-gray-700 font-semibold mb-2">Title:</Text>
                  <Text className="text-gray-800">{selectedLog.title}</Text>
                </GlassCard>

                <GlassCard className="p-4">
                  <Text className="text-gray-700 font-semibold mb-2">Details:</Text>
                  <ScrollView horizontal>
                    <Text className="text-gray-800 font-mono text-xs">
                      {typeof selectedLog.details === 'string'
                        ? selectedLog.details
                        : safeStringify(selectedLog.details, 2)}
                    </Text>
                  </ScrollView>
                </GlassCard>
              </ScrollView>
            </>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
