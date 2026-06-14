import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AiFlowShell } from '@repo/widgets/screens/ai-flow';

import { getAiApiEndpoint } from '@/constants/api';

const API_ENDPOINT = getAiApiEndpoint();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AiFlowShell apiEndpoint={API_ENDPOINT}>
        <Stack screenOptions={{ headerShown: false }} />
      </AiFlowShell>
    </ThemeProvider>
  );
}
