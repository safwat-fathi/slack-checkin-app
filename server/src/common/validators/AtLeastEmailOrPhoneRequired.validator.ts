import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { BookingFieldDto } from 'src/businesses/dto/create-booking-confirmation.dto';

@ValidatorConstraint({ name: 'AtLeastEmailOrPhoneRequired', async: false })
export class AtLeastEmailOrPhoneRequired
  implements ValidatorConstraintInterface
{
  validate(fields: BookingFieldDto[], args: ValidationArguments) {
    if (!fields || fields.length === 0) return false;

    return fields.some(
      (field) =>
        (field.name === 'email' || field.name === 'phone') &&
        field.required === true,
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'At least one of email or phone must be required in the booking fields.';
  }
}
