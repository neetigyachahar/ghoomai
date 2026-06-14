import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { colors } from "../theme/colors";
import { SendArrowIcon } from "../send-arrow-icon/send-arrow-icon.mobile";
import type { PromptBarProps } from "./prompt-bar.types";

export type { PromptBarProps } from "./prompt-bar.types";

export function PromptBar({
  value,
  onChangeText,
  placeholder = "What's on your mind?",
  onSubmit,
  disabled = false,
  loading = false,
}: PromptBarProps) {
  const canSubmit = value.trim().length > 0 && !disabled && !loading;

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        editable={!disabled && !loading}
        style={styles.input}
        returnKeyType="send"
        onSubmitEditing={() => {
          if (canSubmit) {
            onSubmit?.();
          }
        }}
      />
      <Pressable
        onPress={onSubmit}
        disabled={!canSubmit}
        style={[
          styles.sendButton,
          canSubmit ? styles.sendButtonActive : styles.sendButtonInactive,
          !canSubmit && styles.sendButtonDisabled,
        ]}
        accessibilityLabel="Send"
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <SendArrowIcon
            color={canSubmit ? "#ffffff" : colors.textMuted}
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
    borderRadius: 16,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 6,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    color: colors.textPrimary,
    paddingVertical: 8,
    paddingHorizontal: 0,
    margin: 0,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonActive: {
    backgroundColor: colors.accent,
  },
  sendButtonInactive: {
    backgroundColor: colors.bgSubtle,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  sendButtonDisabled: {
    opacity: 1,
  },
});
