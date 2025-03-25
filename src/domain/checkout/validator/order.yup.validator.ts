import ValidatorInterface from "../../@shared/validator/validator.interface";
import * as yup from "yup";
import Order from "../entity/order";

export default class OrderYupValidator implements ValidatorInterface<Order> {
  validate(entity: Order): void {
    try {
      yup
        .object()
        .shape({
          id: yup.string().required("Id is required"),
          customerId: yup.string().required("CustomerId is required"),
          items: yup
            .array()
            .of(
              yup.object({
                id: yup.string().required("Item id is required"),
                name: yup.string().required("Item name is required"),
                productId: yup.string().required("Item productId is required"),
                quantity: yup
                  .number()
                  .required("Item quantity is required")
                  .min(1, "Item quantity must be greater than 0"),
                price: yup
                  .number()
                  .required("Item price is required")
                  .min(0.01, "Item price must be greater than 0"),
              })
            )
            .min(1, "Items are required"),
        })
        .validateSync(
          {
            id: entity.id,
            customerId: entity.customerId,
            items: entity.items,
          },
          {
            abortEarly: false,
          }
        );
    } catch (errors) {
      const e = errors as yup.ValidationError;
      e.errors.forEach((error) => {
        entity.notification.addError({
          context: "order",
          message: error,
        });
      });
    }
  }
}
