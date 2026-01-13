import { useRouter } from "expo-router";
import { Alert } from "react-native";

/**
 * Action Handler Hook
 * Processes SDUI Action Objects (Pure JSON, no functions)
 *
 * Supported action types:
 * - NAVIGATE: Navigate to a route
 * - API: Make an API call (future)
 * - OPEN_MODAL: Open a modal (future)
 */

export interface AppAction {
  type: "NAVIGATE" | "API" | "OPEN_MODAL";
  target: string;
  payload?: Record<string, any>;
}

export function useActionHandler() {
  const router = useRouter();

  const handleAction = (action?: AppAction) => {
    if (!action) {
      if (__DEV__) {
        console.warn("⚠️ handleAction called with undefined action");
      }
      return;
    }

    switch (action.type) {
      case "NAVIGATE":
        // Navigate to target route
        try {
          router.push(action.target as any);

          if (__DEV__) {
            console.log(`✅ Navigate to: ${action.target}`, action.payload);
          }
        } catch (error) {
          if (__DEV__) {
            console.error("❌ Navigation error:", error);
          }
          Alert.alert(
            "Navigation Error",
            "Could not navigate to the requested screen"
          );
        }
        break;

      case "API":
        // Future: Make API call
        if (__DEV__) {
          console.log(`🌐 API call to: ${action.target}`, action.payload);
          Alert.alert(
            "API Action",
            `Would call: ${action.target}\n\n(Not yet implemented)`
          );
        }
        break;

      case "OPEN_MODAL":
        // Future: Open modal
        if (__DEV__) {
          console.log(`📱 Open modal: ${action.target}`, action.payload);
          Alert.alert(
            "Modal Action",
            `Would open: ${action.target}\n\n(Not yet implemented)`
          );
        }
        break;

      default:
        if (__DEV__) {
          console.warn(`⚠️ Unknown action type: ${(action as any).type}`);
        }
    }
  };

  return { handleAction };
}
