import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidUsernameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const invalidCharacters = /[\s!@#$%^&*(),.?":{}|<>]/; // Matches spaces OR any of the special characters
    const hasInvalidCharacter = invalidCharacters.test(control.value);
    return hasInvalidCharacter ? { 'invalidUsername': true } : null;
  };
}