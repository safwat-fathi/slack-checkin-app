import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class UniqueDaysConstraint implements ValidatorConstraintInterface {
  validate(days: any[], _args: ValidationArguments) {
    if (!Array.isArray(days)) return true;
    const daySet = new Set();
    for (const dayEntry of days) {
      if (daySet.has(dayEntry.day)) {
        return false;
      }
      daySet.add(dayEntry.day);
    }
    return true;
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Days within an availability must be unique.';
  }
}
