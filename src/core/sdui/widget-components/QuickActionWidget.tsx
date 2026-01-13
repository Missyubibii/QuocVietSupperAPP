import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DynamicIcon, type IconName } from '../../../components/ui/DynamicIcon';
import { useActionHandler, type AppAction } from '../../hooks/useActionHandler';

/**
 * QuickActionWidget - 4-column grid of action buttons
 * Features:
 * - Responsive grid layout
 * - Action object handling (SDUI compliant)
 * - Touch feedback
 */

interface QuickAction {
  id: string;
  label: string;
  icon: IconName;
  action?: AppAction;
}

interface QuickActionWidgetProps {
  data: {
    actions: QuickAction[];
  };
}

export function QuickActionWidget({ data }: QuickActionWidgetProps) {
  const { handleAction } = useActionHandler();

  return (
    <View className="px-5 mb-7">
      <View className="flex-row flex-wrap justify-between">
        {data.actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={() => handleAction(action.action)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="flex-col items-center gap-1.5 mb-4"
            style={{ width: '23%' }} // 4 columns with gap
          >
            <View className="w-14 h-14 rounded-[20px] bg-white border border-slate-100 shadow-sm items-center justify-center active:bg-slate-50">
              <DynamicIcon name={action.icon} size={28} color="#334155" strokeWidth={1.5} />
            </View>
            <Text
              className="text-[11px] font-bold text-slate-500 text-center leading-tight"
              numberOfLines={2}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
