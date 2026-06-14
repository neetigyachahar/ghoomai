export interface QuestionSheetProps {
  question: string;
  options?: string[];
  freeTextValue: string;
  onFreeTextChange: (text: string) => void;
  onSelectOption: (option: string) => void;
  onFreeTextSubmit: () => void;
  disabled?: boolean;
  loading?: boolean;
}
