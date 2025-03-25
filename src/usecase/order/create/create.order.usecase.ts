import OrderItem from "../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../domain/checkout/repository/order-repository.interface";
import OrderService from "../../../domain/checkout/service/order.service";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import { InputCreateOrderDto, OutputCreateOrderDto } from "./create.order.dto";

export default class CreateOrdertUseCase {
  private orderRepository: OrderRepositoryInterface;
  private customerRepository: CustomerRepositoryInterface;

  constructor(
    orderRepository: OrderRepositoryInterface,
    customerRepository: CustomerRepositoryInterface
  ) {
    this.orderRepository = orderRepository;
    this.customerRepository = customerRepository;
  }

  async execute(input: InputCreateOrderDto): Promise<OutputCreateOrderDto> {
    const customer = await this.customerRepository.find(input.customerId);

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

    const order = OrderService.placeOrder(customer, items);

    await this.orderRepository.create(order);
    await this.customerRepository.update(customer);

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
