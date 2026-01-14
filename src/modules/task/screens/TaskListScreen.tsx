import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useTaskStore } from '../store';
import { Task } from '../task.types';
import { TaskItem } from '../components/TaskItem';
import { TaskFilterTabs } from '../components/TaskFilterTabs';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { DynamicIcon } from '../../../components/ui/DynamicIcon';

export default function TaskListScreen() {
    const router = useRouter();
    const {
        tasks,
        currentFilter,
        isLoading,
        error,
        setFilter,
        fetchTasks,
        clearError
    } = useTaskStore();

    useEffect(() => {
        fetchTasks();
    }, []);

    const renderItem = useCallback(({ item }: { item: Task }) => (
        <TaskItem
            task={item}
            onPress={(task) => {
                // TODO: Navigate to task detail screen
                if (__DEV__) {
                    console.log('Task pressed:', task.id);
                }
            }}
        />
    ), []);

    const keyExtractor = useCallback((item: Task) => item.id.toString(), []);

    // Error State (full screen if no tasks)
    if (error && tasks.length === 0) {
        return (
            <View className="flex-1 bg-slate-50">
                <TaskFilterTabs current={currentFilter} onChange={setFilter} />
                <ErrorState
                    message={error}
                    onRetry={() => {
                        clearError();
                        fetchTasks();
                    }}
                />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-50">
            {/* Error Toast (if tasks exist but operation failed) */}
            {error && (
                <View className="bg-red-100 border-l-4 border-red-500 p-3 mx-4 mt-2 rounded">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-red-700 flex-1 text-sm">{error}</Text>
                        <TouchableOpacity onPress={clearError} className="ml-2">
                            <DynamicIcon name="x" size={18} color="#DC2626" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Filter Tabs */}
            <TaskFilterTabs current={currentFilter} onChange={setFilter} />

            {/* Task List with FlashList */}
            <FlashList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                estimatedItemSize={120} // CRITICAL for performance
                refreshing={isLoading}
                onRefresh={fetchTasks}
                ListEmptyComponent={<EmptyState filter={currentFilter} />}
                contentContainerStyle={{ paddingVertical: 8 }}
            />

            {/* FAB (Floating Action Button) */}
            <TouchableOpacity
                onPress={() => router.push('/task/create')}
                className="absolute bottom-6 right-6 w-16 h-16 bg-blue-600 rounded-full items-center justify-center shadow-lg active:opacity-80"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 8,
                }}
            >
                <DynamicIcon name="plus" size={24} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
}
