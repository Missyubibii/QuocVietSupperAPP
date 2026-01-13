import React from 'react';
import { View, Text } from 'react-native';
import type { WidgetBlock, WidgetType } from './types';

/**
 * SDUI Layout Engine - The heart of Server-Driven UI
 * Maps JSON widget blocks to React components
 */

// Placeholder widgets for demonstration
const HeaderBannerWidget: React.FC<WidgetBlock> = ({ title, data }) => (
  <View className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl mx-4 my-2">
    <Text className="text-white text-2xl font-bold">{title || data?.title}</Text>
    {data?.subtitle && <Text className="text-white/90 mt-1">{data.subtitle}</Text>}
  </View>
);

const GridMenuWidget: React.FC<WidgetBlock> = ({ title, data }) => (
  <View className="p-4">
    {title && <Text className="text-lg font-semibold mb-3">{title}</Text>}
    <View className="flex-row flex-wrap gap-2">
      {data?.items?.map((item: any, index: number) => (
        <View key={index} className="bg-white/80 p-4 rounded-xl border border-white/60">
          <Text>{item.label}</Text>
        </View>
      ))}
    </View>
  </View>
);

const InfoCardWidget: React.FC<WidgetBlock> = ({ title, data }) => (
  <View className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-white/60 mx-4 my-2">
    {title && <Text className="text-base font-semibold mb-2">{title}</Text>}
    <Text className="text-gray-700">{data?.message || 'No content'}</Text>
  </View>
);

// Error widget for unknown types (dev mode only)
const ErrorWidget: React.FC<{ type: string }> = ({ type }) => (
  <View className="bg-red-500/20 p-4 rounded-lg mx-4 my-2 border border-red-500">
    <Text className="text-red-700 font-bold">⚠️ Unknown Widget Type: {type}</Text>
    <Text className="text-red-600 text-sm mt-1">
      This widget type is not registered in WIDGET_REGISTRY.
    </Text>
  </View>
);

// Widget Registry - Maps widget types to components
const WIDGET_REGISTRY: Record<WidgetType, React.FC<WidgetBlock>> = {
  HEADER_BANNER: HeaderBannerWidget,
  GRID_MENU: GridMenuWidget,
  INFO_CARD: InfoCardWidget,
  // Placeholders for future widgets
  TASK_LIST: InfoCardWidget, // Will be replaced in Chapter 4
  QUICK_ACTIONS: GridMenuWidget, // Will be replaced later
};

// Main Layout Engine Component
interface LayoutEngineProps {
  layout: WidgetBlock[];
}

export const LayoutEngine: React.FC<LayoutEngineProps> = ({ layout }) => {
  if (!layout || layout.length === 0) {
    return (
      <View className="p-4">
        <Text className="text-gray-500 text-center">No widgets to display</Text>
      </View>
    );
  }

  return (
    <View>
      {layout.map((block) => {
        const WidgetComponent = WIDGET_REGISTRY[block.type];

        if (!WidgetComponent) {
          // Show error in dev mode, hide in production
          return __DEV__ ? (
            <ErrorWidget key={block.id} type={block.type} />
          ) : null;
        }

        return <WidgetComponent key={block.id} {...block} />;
      })}
    </View>
  );
};
