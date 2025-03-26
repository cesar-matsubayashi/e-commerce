import NotificationError from "../../../domain/@shared/notification/notification.error";
import OrderItem from "../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../domain/checkout/repository/order-repository.interface";
import { InputUpdateOrderDto, OutputUpdateOrderDto } from "./update.order.dto";

export default class UpdateOrderUseCase {
  private orderRepository: OrderRepositoryInterface;

  constructor(orderRepository: OrderRepositoryInterface) {
    this.orderRepository = orderRepository;
  }

  async execute(input: InputUpdateOrderDto): Promise<OutputUpdateOrderDto> {
    if (input.items.some((item) => item.id.length === 0)) {
      throw new Error("Item id is required");
    }

    const order = await this.orderRepository.find(input.id);

    let items: OrderItem[] = [];
    input.items.forEach((item) => {
      items.push(
        new OrderItem(
          item.id,
          item.name,
          item.price,
          item.productId,
          item.quantity
        )
      );
    });

    order.changeCustomerId(input.customerId);
    order.changeItems(items);
    order.validate();

    if (order.notification.hasErrors()) {
      throw new NotificationError(order.notification.getErrors());
    }

    await this.orderRepository.update(order);

    return {
      id: order.id,
      customerId: order.customerId,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };
  }
}
