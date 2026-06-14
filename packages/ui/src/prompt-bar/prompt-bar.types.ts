export interface PromptBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  disabled?: boolean;
  loading?: boolean;
}
