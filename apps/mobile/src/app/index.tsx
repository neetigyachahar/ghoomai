import { AiPromptScreen } from '@repo/widgets/screens/ai-flow';
import { useRouter } from 'expo-router';

import { useMobileKeyboard } from '@/components/mobile-keyboard-screen-shell';

export default function HomeScreen() {
  const router = useRouter();
  const { keyboardVisible } = useMobileKeyboard();

  return (
    <AiPromptScreen
      keyboardVisible={keyboardVisible}
      onNavigateToResult={() => router.push('/result')}
    />
  );
}
