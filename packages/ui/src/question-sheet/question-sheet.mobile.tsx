import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { OptionChip } from "../option-chip/option-chip.mobile";
import { SendArrowIcon } from "../send-arrow-icon/send-arrow-icon.mobile";
import { colors } from "../theme/colors";
import type { QuestionSheetProps } from "./question-sheet.types";

export type { QuestionSheetProps } from "./question-sheet.types";

export function QuestionSheet({
  question,
  options = [],
  freeTextValue,
  onFreeTextChange,
  onSelectOption,
  onFreeTextSubmit,
  disabled = false,
  loading = false,
}: QuestionSheetProps) {
  const canSubmitFreeText =
    freeTextValue.trim().length > 0 && !disabled && !loading;
  const showActiveButton = canSubmitFreeText || loading;

  return (
    <View style={styles.sheet}>
      <Text style={styles.question}>{question}</Text>

      {options.length > 0 ? (
        <View style={styles.options}>
          {options.map((option) => (
            <OptionChip
              key={option}
              label={option}
              onPress={() => onSelectOption(option)}
              disabled={disabled || loading}
            />
          ))}
        </View>
      ) : null}

      <View style={styles.freeTextRow}>
        <TextInput
          value={freeTextValue}
          onChangeText={onFreeTextChange}
          placeholder="Something else..."
          placeholderTextColor={colors.textMuted}
          editable={!disabled && !loading}
          style={styles.freeTextInput}
          returnKeyType="send"
          onSubmitEditing={() => {
            if (canSubmitFreeText) {
              onFreeTextSubmit();
            }
          }}
        />
        <Pressable
          onPress={onFreeTextSubmit}
          disabled={!canSubmitFreeText}
          style={[
            styles.sendButton,
            showActiveButton
              ? styles.sendButtonActive
              : styles.sendButtonInactive,
            !showActiveButton && styles.sendButtonDisabled,
          ]}
          accessibilityLabel="Send answer"
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <SendArrowIcon
              size={16}
              color={canSubmitFreeText ? "#ffffff" : colors.textMuted}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
    borderRadius: 16,
    padding: 16,
  },
  question: {
    fontSize: 17,
    fontWeight: "500",
    lineHeight: 24,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  freeTextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSubtle,
    borderRadius: 12,
    padding: 6,
  },
  freeTextInput: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: colors.textPrimary,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
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
    opacity: 0.4,
  },
});
