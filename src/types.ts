export interface FormValues {
  [key: string]: string | number | boolean | Date | undefined;
}

export interface FormBuilderProps {
  onSubmit: (data: FormValues) => void;
}
