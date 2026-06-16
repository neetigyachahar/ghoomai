import { useEffect, useState } from "react";
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

const MIN_INPUT_HEIGHT = 38;
const MAX_INPUT_HEIGHT = 128;

export function PromptBar({
  value,
  onChangeText,
  placeholder = "What's on your mind?",
  onSubmit,
  disabled = false,
  loading = false,
  embedded = false,
}: PromptBarProps) {
  const canSubmit = value.trim().length > 0 && !disabled && !loading;
  const showActiveButton = canSubmit || loading;
  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);

  useEffect(() => {
    if (!value) {
      setInputHeight(MIN_INPUT_HEIGHT);
    }
  }, [value]);

  const inputRow = (
    <>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        editable={!disabled && !loading}
        multiline
        scrollEnabled={inputHeight >= MAX_INPUT_HEIGHT}
        style={[styles.input, { height: Math.max(MIN_INPUT_HEIGHT, inputHeight) }]}
        onContentSizeChange={(event) => {
          const nextHeight = event.nativeEvent.contentSize.height;
          setInputHeight(Math.min(Math.max(MIN_INPUT_HEIGHT, nextHeight), MAX_INPUT_HEIGHT));
        }}
        returnKeyType="send"
        blurOnSubmit={false}
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
          showActiveButton ? styles.sendButtonActive : styles.sendButtonInactive,
          !showActiveButton && styles.sendButtonDisabled,
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
    </>
  );

  if (embedded) {
    return <View style={styles.embeddedRow}>{inputRow}</View>;
  }

  return <View style={styles.container}>{inputRow}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
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
    textAlignVertical: "top",
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
  embeddedRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 6,
    minHeight: 52,
  },
});
