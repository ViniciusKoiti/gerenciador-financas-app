export interface FormValidationErrors {
  [key: string]: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormValidationErrors;
}
