export type FormElement = {
  value: string;
  isValid: boolean;
};

export const formElement = {
  value: '',
  isValid: false,
};

export const validate = (value: string) => {
  let valid = true;

  valid = value.trim() !== '' && valid;

  return valid;
};
