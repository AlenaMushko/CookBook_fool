import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'AtLeastOneOf' })
export class AtLeastOneOfConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments): boolean {
    const properties = args.constraints as string[];
    const object = args.object as Record<string, unknown>;

    return properties.some((property) => {
      const value = object[property];
      return typeof value === 'string' ? value.trim().length > 0 : !!value;
    });
  }

  defaultMessage(args: ValidationArguments): string {
    const properties = (args.constraints as string[]).join(' or ');
    return `At least one of ${properties} must be provided`;
  }
}

/** Property-level helper if needed; prefer `@Validate(AtLeastOneOfConstraint, [...])` on class. */
export function AtLeastOneOf(
  properties: string[],
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string | symbol) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints: properties,
      validator: AtLeastOneOfConstraint,
    });
  };
}
