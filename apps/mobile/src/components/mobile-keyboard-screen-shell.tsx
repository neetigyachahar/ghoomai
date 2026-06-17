import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  type KeyboardEvent,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// Gboard/Android often reports screenY at the key row, not the accessory toolbar.
const ANDROID_ACCESSORY_BAR = 48;
const KEYBOARD_GAP = 20;

interface MobileKeyboardContextValue {
  keyboardVisible: boolean;
}

const MobileKeyboardContext = createContext<MobileKeyboardContextValue>({
  keyboardVisible: false,
});

export function useMobileKeyboard() {
  return useContext(MobileKeyboardContext);
}

function getKeyboardLift(viewBottom: number, event: KeyboardEvent) {
  const accessoryOffset =
    Platform.OS === 'android' ? ANDROID_ACCESSORY_BAR : 0;
  const keyboardTop = event.endCoordinates.screenY - accessoryOffset;
  const overlap = viewBottom - keyboardTop;
  return Math.max(overlap, 0) + KEYBOARD_GAP;
}

export function MobileKeyboardScreenShell({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const contentRef = useRef<View>(null);
  const keyboardEventRef = useRef<KeyboardEvent | null>(null);
  const measureTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const measureKeyboardOffset = useCallback((event: KeyboardEvent) => {
    contentRef.current?.measureInWindow((_x, y, _width, height) => {
      const viewBottom = y + height;
      const nextOffset = getKeyboardLift(viewBottom, event);
      setKeyboardOffset((current) => Math.max(current, nextOffset));
    });
  }, []);

  const scheduleMeasurements = useCallback((event: KeyboardEvent) => {
    keyboardEventRef.current = event;
    measureTimersRef.current.forEach(clearTimeout);
    measureTimersRef.current = [];

    const delays = Platform.OS === 'android' ? [0, 80, 180] : [0];

    delays.forEach((delay) => {
      const timer = setTimeout(() => {
        measureKeyboardOffset(event);
      }, delay);
      measureTimersRef.current.push(timer);
    });
  }, [measureKeyboardOffset]);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event: KeyboardEvent) => {
      setKeyboardVisible(true);
      setKeyboardOffset(0);
      scheduleMeasurements(event);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      measureTimersRef.current.forEach(clearTimeout);
      measureTimersRef.current = [];
      keyboardEventRef.current = null;
      setKeyboardVisible(false);
      setKeyboardOffset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
      measureTimersRef.current.forEach(clearTimeout);
    };
  }, [scheduleMeasurements]);

  const contentPaddingBottom =
    Platform.OS === 'android'
      ? keyboardVisible
        ? keyboardOffset
        : insets.bottom
      : keyboardVisible
        ? 0
        : insets.bottom;

  const content = (
    <View
      ref={contentRef}
      style={[styles.content, { paddingBottom: contentPaddingBottom }]}
    >
      <MobileKeyboardContext.Provider value={{ keyboardVisible }}>
        {children}
      </MobileKeyboardContext.Provider>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView style={styles.keyboard} behavior="padding">
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  keyboard: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
