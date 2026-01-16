import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Task } from '../task.types';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { formatDate, isOverdue } from '../utils/dateHelpers';

interface TaskItemProps {
    task: Task;
    onPress: (task: Task) => void;
    onLongPress?: (task: Task) => void; // 1. Thêm prop onLongPress
    isSelected?: boolean; // 2. Thêm prop isSelected
}

export const TaskItem = React.memo<TaskItemProps>(
    ({ task, onPress, onLongPress, isSelected }) => {
        const overdueStatus = isOverdue(task.due_date, task.status);

        return (
            <Pressable
                onPress={() => onPress(task)}
                onLongPress={() => onLongPress && onLongPress(task)} // 3. Gắn sự kiện
                delayLongPress={300}
                className={`p-4 mb-2 mx-4 rounded-xl border active:opacity-70 ${
                    // 4. Đổi màu nền khi được chọn
                    isSelected
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white border-slate-200'
                    }`}
            >
                {/* Header: Title + Priority Badge */}
                <View className="flex-row items-start justify-between mb-2">
                    <Text className={`text-base font-bold flex-1 pr-2 ${isSelected ? 'text-blue-900' : 'text-slate-800'}`} numberOfLines={2}>
                        {task.title}
                    </Text>
                    <PriorityBadge priority={task.priority} />
                </View>

                {/* Description (if any) */}
                {task.description && (
                    <Text className="text-sm text-slate-600 mb-3" numberOfLines={2}>
                        {task.description}
                    </Text>
                )}

                {/* Footer: Assignee + Due Date */}
                <View className="flex-row items-center justify-between mt-2">
                    {/* Assignee */}
                    <View className="flex-row items-center flex-1">
                        {task.assignee_avatar ? (
                            <Image
                                source={{ uri: task.assignee_avatar }}
                                className="w-6 h-6 rounded-full"
                            />
                        ) : (
                            <View className="w-6 h-6 rounded-full bg-slate-300" />
                        )}
                        <Text className="text-xs text-slate-600 ml-2" numberOfLines={1}>
                            {task.assignee_name}
                        </Text>
                    </View>

                    {/* Due Date */}
                    <View className="flex-row items-center">
                        {overdueStatus && (
                            <Text className="text-red-600 text-xs mr-1">⚠️</Text>
                        )}
                        <Text
                            className={`text-xs font-medium ${overdueStatus ? 'text-red-600' : 'text-slate-500'
                                }`}
                        >
                            {formatDate(task.due_date)}
                        </Text>
                    </View>
                </View>

                {/* Status Badge */}
                <View className="mt-3">
                    <StatusBadge status={task.status} />
                </View>
            </Pressable>
        );
    }
);

TaskItem.displayName = 'TaskItem';