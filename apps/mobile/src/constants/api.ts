import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const WEB_PORT = process.env.EXPO_PUBLIC_WEB_PORT ?? '3000';

function getHostFromExpoDevServer(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;

  if (!hostUri) {
    return null;
  }

  return hostUri.split(':')[0] ?? null;
}

function getDevLocalApiBase(): string {
  if (Platform.OS === 'web') {
    return `http://localhost:${WEB_PORT}`;
  }

  if (Platform.OS === 'android' && !Device.isDevice) {
    return `http://10.0.2.2:${WEB_PORT}`;
  }

  if (Platform.OS === 'ios' && !Device.isDevice) {
    return `http://localhost:${WEB_PORT}`;
  }

  const devHost = getHostFromExpoDevServer();

  if (devHost) {
    return `http://${devHost}:${WEB_PORT}`;
  }

  return `http://localhost:${WEB_PORT}`;
}

/**
 * API origin for all backend requests.
 *
 * - Set EXPO_PUBLIC_API_BASE_URL to your Firebase function URL or Next.js host
 * - Leave unset during local dev to auto-detect the machine running Next.js
 */
export function getApiBase(): string {
  const configured = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

  if (configured) {
    return configured;
  }

  return getDevLocalApiBase();
}
