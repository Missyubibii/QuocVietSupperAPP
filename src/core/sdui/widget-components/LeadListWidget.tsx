import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { useActionHandler, type AppAction } from '../../hooks/useActionHandler';

/**
 * LeadListWidget - Customer/Lead list with FlashList
 * Features:
 * - 60fps scrolling with FlashList
 * - Optimized image caching with expo-image
 * - Action object handling per lead
 */

interface Lead {
  id: number;
  name: string;
  role: string;
  status: string;
  value: string;
  avatar: string;
  tagColor: string;
  action?: AppAction;
}

interface LeadListWidgetProps {
  data: {
    title?: string;
    leads: Lead[];
  };
}

export function LeadListWidget({ data }: LeadListWidgetProps) {
  const { handleAction } = useActionHandler();

  const renderLead = ({ item }: { item: Lead }) => (
    <TouchableOpacity
      onPress={() => handleAction(item.action)}
      className="bg-white p-3.5 rounded-[20px] shadow-sm border border-slate-100 flex-row items-center gap-3.5 mb-2.5 active:opacity-80"
    >
      {/* Avatar */}
      <Image
        source={{ uri: item.avatar }}
        style={{ width: 44, height: 44, borderRadius: 16 }}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      {/* Info */}
      <View className="flex-1">
        <Text className="font-bold text-slate-800 text-sm" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-xs text-slate-500 font-medium mt-0.5" numberOfLines={1}>
          {item.role}
        </Text>
      </View>

      {/* Value & Status */}
      <View className="items-end">
        <Text className="text-xs font-extrabold text-blue-600">{item.value}</Text>
        <View className={`mt-1 px-2 py-0.5 rounded ${item.tagColor}`}>
          <Text className="text-[9px] font-bold uppercase">{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="px-5">
      {data.title && (
        <Text className="text-sm font-bold text-slate-800 mb-3">{data.title}</Text>
      )}
      <View style={{ minHeight: 2 }}>
        <FlashList
          data={data.leads}
          renderItem={renderLead}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false} // Main ScrollView handles scrolling
        />
      </View>
    </View>
  );
}
