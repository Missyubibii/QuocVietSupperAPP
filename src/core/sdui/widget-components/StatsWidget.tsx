import React from 'react';
import { View, Text } from 'react-native';
import { GlassCard } from '../../../components/ui/GlassCard';
import { DynamicIcon } from '../../../components/ui/DynamicIcon';

/**
 * StatsWidget - Statistics grid with main revenue card + sub stats
 * Features:
 * - 2-column responsive grid
 * - Main stat spans 2 columns with mini bar chart
 * - Sub stats with color-coded change indicators
 */

interface StatItem {
  label: string;
  value: string;
  unit?: string;
  change: string;
  color: string;
  bg: string;
}

interface StatsWidgetProps {
  data: {
    mainStat: {
      label: string;
      value: string;
      unit: string;
      change: string;
      chartData: number[]; // Heights for mini bar chart (0-100)
    };
    subStats: StatItem[];
  };
}

export function StatsWidget({ data }: StatsWidgetProps) {
  const { mainStat, subStats } = data;

  return (
    <View className="px-5 mb-6">
      <View className="flex-row flex-wrap gap-3">
        {/* Main Revenue Card (Full Width) */}
        <GlassCard
          className="p-5 flex-row items-center justify-between"
          style={{ width: '100%', height: 112 }}
        >
          <View className="flex-1">
            <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1.5">
              {mainStat.label}
            </Text>
            <View className="flex-row items-baseline gap-2 flex-wrap">
              <Text className="text-3xl font-black text-slate-800 tracking-tight">
                {mainStat.value}
              </Text>
              <Text className="text-blue-600 text-xl font-black">{mainStat.unit}</Text>
              <View className="bg-emerald-50 px-2 py-1 rounded-lg">
                <Text className="text-xs font-bold text-emerald-500">{mainStat.change}</Text>
              </View>
            </View>
          </View>

          {/* Mini bar chart */}
          <View className="flex-row items-end gap-1.5 h-12">
            {mainStat.chartData.map((height, i) => {
              const isLast = i === mainStat.chartData.length - 1;
              return (
                <View
                  key={i}
                  className={isLast ? 'bg-blue-600 rounded-t-md' : 'bg-blue-500/20 rounded-t-md'}
                  style={{
                    width: 10,
                    height: `${height}%`,
                  }}
                />
              );
            })}
          </View>
        </GlassCard>

        {/* Sub Stats (2 columns) */}
        {subStats.map((stat, idx) => (
          <GlassCard
            key={idx}
            className="p-4 justify-between bg-white"
            style={{ width: '48%', height: 112 }}
          >
            <View className="flex-row justify-between items-start">
              <View className={`w-10 h-10 rounded-xl ${stat.bg} items-center justify-center`}>
                <DynamicIcon name="activity" size={20} color={stat.color.replace('text-', '#')} strokeWidth={2.5} />
              </View>
              <View
                className={`px-2 py-0.5 rounded-lg ${
                  stat.change.includes('+') ? 'bg-emerald-100' : 'bg-rose-100'
                }`}
              >
                <Text
                  className={`text-[11px] font-bold ${
                    stat.change.includes('+') ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {stat.change}
                </Text>
              </View>
            </View>
            <View>
              <Text className="text-xl font-bold text-slate-800">{stat.value}</Text>
              <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                {stat.label}
              </Text>
            </View>
          </GlassCard>
        ))}
      </View>
    </View>
  );
}
