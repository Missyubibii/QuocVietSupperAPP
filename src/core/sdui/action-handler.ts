import { Linking } from 'react-native';
import { router } from 'expo-router';
import type { AppAction } from './types';

/**
 * Handle actions triggered by SDUI widgets
 * Supports navigation, external links, and API calls
 */
export async function handleAction(action: AppAction): Promise<void> {
  try {
    switch (action.type) {
      case 'NATIVE_SCREEN':
        // Navigate to screen using Expo Router
        router.push({
          pathname: action.screen as any,
          params: action.params,
        });
        break;

      case 'LINK':
        // Open external URL
        const canOpen = await Linking.canOpenURL(action.url);
        if (canOpen) {
          await Linking.openURL(action.url);
        } else {
          console.warn(`[ActionHandler] Cannot open URL: ${action.url}`);
        }
        break;

      case 'API_CALL':
        // This will be implemented when integrating with specific features
        console.log(`[ActionHandler] API call to ${action.endpoint} (method: ${action.method || 'GET'})`);
        // TODO: Implement API call logic with loading states
        break;

      default:
        console.warn('[ActionHandler] Unknown action type:', action);
    }
  } catch (error) {
    console.error('[ActionHandler] Failed to handle action:', action, error);
  }
}
