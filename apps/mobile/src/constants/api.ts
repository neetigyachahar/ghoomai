import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const API_PATH = '/api/ai/layout';
const WEB_PORT = process.env.EXPO_PUBLIC_WEB_PORT ?? '3000';

function getHostFromExpoDevServer(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;

  if (!hostUri) {
    return null;
  }

  return hostUri.split(':')[0] ?? null;
}

/**
 * Resolve the web API URL for the current runtime.
 *
 * - Android emulator: 10.0.2.2 (alias for host machine localhost)
 * - iOS simulator: localhost
 * - Physical device: same LAN IP as the Expo dev server
 * - Override anytime with EXPO_PUBLIC_AI_API_ENDPOINT
 */
export function getAiApiEndpoint(): string {
  const override = process.env.EXPO_PUBLIC_AI_API_ENDPOINT;

  if (override) {
    return override;
  }

  if (Platform.OS === 'web') {
    return `http://localhost:${WEB_PORT}${API_PATH}`;
  }

  if (Platform.OS === 'android' && !Device.isDevice) {
    return `http://10.0.2.2:${WEB_PORT}${API_PATH}`;
  }

  if (Platform.OS === 'ios' && !Device.isDevice) {
    return `http://localhost:${WEB_PORT}${API_PATH}`;
  }

  const devHost = getHostFromExpoDevServer();

  if (devHost) {
    return `http://${devHost}:${WEB_PORT}${API_PATH}`;
  }

  return `http://localhost:${WEB_PORT}${API_PATH}`;
}

/**
 * Web API origin for travel resource fetches on mobile (no path suffix).
 */
export function getWebApiBase(): string {
  const endpoint = getAiApiEndpoint();
  return endpoint.replace(/\/api\/ai\/layout$/, '');
}
