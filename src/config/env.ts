import { z } from "zod";

// Define strict schema for environment variables
const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z
    .string()
    .url("EXPO_PUBLIC_API_URL must be a valid URL"),
  EXPO_PUBLIC_USE_MOCK: z.union([z.literal("true"), z.literal("false")]),
});

// Validate environment variables - FAIL FAST if invalid
function validateEnv() {
  try {
    const parsed = envSchema.parse({
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      EXPO_PUBLIC_USE_MOCK: process.env.EXPO_PUBLIC_USE_MOCK,
    });

    return {
      apiUrl: parsed.EXPO_PUBLIC_API_URL,
      useMock: parsed.EXPO_PUBLIC_USE_MOCK === "true",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((err) => `- ${err.path.join(".")}: ${err.message}`)
        .join("\n");

      throw new Error(
        `❌ Environment Configuration Error:\n\n${errorMessages}\n\n` +
          `Please check your .env file and ensure all required variables are set correctly.`
      );
    }
    throw error;
  }
}

// Export validated environment config
export const env = validateEnv();

// Export type for TypeScript autocomplete
export type Env = typeof env;
