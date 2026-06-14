import { AiResultScreen } from '@repo/widgets/screens/ai-flow';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AiResultScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
