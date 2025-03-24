import ValidatorInterface from "../../@shared/validator/validator.interface";
import Order from "../entity/order";
import OrderYupValidator from "../validator/order.yup.validator";

export default class OrderValidatorFactory {
  static create(): ValidatorInterface<Order> {
    return new OrderYupValidator();
  }
}
