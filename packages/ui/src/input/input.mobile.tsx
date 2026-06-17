import {
  Pressable,
  StyleSheet,
  TextInput,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import type { InputProps } from "./input.types";

export type { InputProps } from "./input.types";

export function Input({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  secureTextEntry = false,
  style,
  onSubmit,
}: InputProps) {
  return (
    <Pressable style={styles.wrapper}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        style={[styles.input, multiline && styles.multiline, style as TextStyle]}
        placeholderTextColor="#a1a1aa"
        returnKeyType={multiline ? "default" : "send"}
        onSubmitEditing={onSubmit}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    maxWidth: 512,
  } as ViewStyle,
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d4d4d8",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#18181b",
  } as TextStyle,
  multiline: {
    minHeight: 96,
    textAlignVertical: "top",
  } as TextStyle,
});
