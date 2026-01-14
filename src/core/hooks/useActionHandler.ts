/**
 * src/core/hooks/useActionHandler.ts
 */
import { useCallback } from "react";
import { useRouter } from "expo-router";
import { Alert, Linking } from "react-native";
import { Action } from "../sdui/types";

export const useActionHandler = () => {
  const router = useRouter();

  const handleAction = useCallback(
    (action?: Action) => {
      if (!action) return;

      // 1. Xử lý tính năng đang phát triển
      if (action.type === "COMING_SOON") {
        Alert.alert(
          "Tính năng mới",
          "Chức năng này đang được phát triển và sẽ sớm ra mắt!",
          [{ text: "Đã hiểu", style: "default" }]
        );
        return;
      }

      // 2. Xử lý điều hướng
      if (action.type === "NAVIGATE" || action.type === "LINK") {
        // Mock data dùng 'target', Legacy code dùng 'url'
        // @ts-ignore
        const destination = action.target || action.url;

        if (destination) {
          if (destination.startsWith("http")) {
            Linking.openURL(destination);
          } else {
            // @ts-ignore
            router.push(destination);
          }
        }
        return;
      }

      // 3. Xử lý Modal (Tạm thời alert để debug nếu chưa làm component Modal)
      if (action.type === "OPEN_MODAL") {
        console.log("Open Modal:", action);
        // Logic mở modal sẽ implement sau
        Alert.alert(
          "Modal",
          `Mở modal: ${
            // @ts-ignore
            action.target
          }`
        );
      }
    },
    [router]
  );

  return { handleAction };
};
