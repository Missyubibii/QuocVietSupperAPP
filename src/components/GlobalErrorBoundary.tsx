import React from 'react';
import { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GlassCard } from './ui/GlassCard';
import { DynamicIcon } from './ui/DynamicIcon';
import { useLogStore } from '../core/logger/store';
import { safeStringify } from '../core/logger/types';

/**
 * Global Error Boundary
 * Catches React rendering errors and prevents white screen crashes
 * Logs error to store and shows fallback UI
 */

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to store
    const { addLog } = useLogStore.getState();
    
    addLog(
      'UI_CRASH',
      `React Error: ${error.message}`,
      {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      }
    );

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Log to console in dev mode
    if (__DEV__) {
      console.error('💥 Global Error Boundary caught error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
    }
  }

  handleRestart = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleViewLogs = () => {
    // This will be handled by navigation in the fallback UI
    // We use a global router reference for this
    if (typeof window !== 'undefined' && (window as any).__debug_router) {
      (window as any).__debug_router.push('/debug');
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-gradient-to-b from-red-50 to-orange-50 items-center justify-center px-6">
          <GlassCard className="p-8 w-full max-w-md">
            {/* Error Icon */}
            <View className="items-center mb-6">
              <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4">
                <DynamicIcon name="alert-circle" size={48} color="#EF4444" />
              </View>
              <Text className="text-2xl font-bold text-gray-800 text-center">
                Oops! Something went wrong
              </Text>
              <Text className="text-gray-600 text-center mt-2">
                The app encountered an unexpected error
              </Text>
            </View>

            {/* Error Details (Dev Only) */}
            {__DEV__ && this.state.error && (
              <ScrollView className="bg-red-50 p-4 rounded-lg mb-6 max-h-40">
                <Text className="text-red-700 text-xs font-mono">
                  {this.state.error.message}
                </Text>
                {this.state.error.stack && (
                  <Text className="text-red-600 text-xs font-mono mt-2">
                    {this.state.error.stack.substring(0, 500)}...
                  </Text>
                )}
              </ScrollView>
            )}

            {/* Action Buttons */}
            <View className="space-y-3">
              <TouchableOpacity
                onPress={this.handleRestart}
                className="bg-purple-600 py-4 rounded-xl"
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Restart App
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.handleViewLogs}
                className="bg-orange-500 py-4 rounded-xl"
              >
                <View className="flex-row items-center justify-center">
                  <DynamicIcon name="file" size={20} color="#FFF" />
                  <Text className="text-white font-semibold ml-2">
                    View Debug Logs
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Help Text */}
            <Text className="text-gray-500 text-center text-sm mt-6">
              If this problem persists, please contact support
            </Text>
          </GlassCard>
        </View>
      );
    }

    return this.props.children;
  }
}
