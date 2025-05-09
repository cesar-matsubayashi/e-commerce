import ValidatorInterface from "../../@shared/validator/validator.interface";
import Address from "./address";
import AddressYupValidator from "./address.yup.validator";

export default class AddressValidatorFactory {
  static create(): ValidatorInterface<Address> {
    return new AddressYupValidator();
  }
}
