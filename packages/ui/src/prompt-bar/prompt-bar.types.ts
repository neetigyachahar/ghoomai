export interface PromptBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** Omits outer border/radius — use inside a shared prompt composer shell. */
  embedded?: boolean;
}
