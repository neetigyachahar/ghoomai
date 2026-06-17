import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AiFlowShell } from '@repo/widgets/screens/ai-flow';

import {
  MobileKeyboardScreenShell,
  useMobileKeyboard,
} from '@/components/mobile-keyboard-screen-shell';
import { getApiBase } from '@/constants/api';

const API_BASE = getApiBase();

function AppShell() {
  const { keyboardVisible } = useMobileKeyboard();

  return (
    <AiFlowShell apiBase={API_BASE} keyboardVisible={keyboardVisible}>
      <Stack screenOptions={{ headerShown: false }} />
    </AiFlowShell>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <MobileKeyboardScreenShell>
          <AppShell />
        </MobileKeyboardScreenShell>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
