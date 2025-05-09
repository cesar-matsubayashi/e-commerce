import OrderRepositoryInterface from "../../../domain/checkout/repository/order-repository.interface";
import { InputFindOrderDto, OutputFindOrderDto } from "./find.order.dto";

export default class FindOrderUseCase {
  private orderRepository: OrderRepositoryInterface;

  constructor(orderRepository: OrderRepositoryInterface) {
    this.orderRepository = orderRepository;
  }

  async execute(input: InputFindOrderDto): Promise<OutputFindOrderDto> {
    const order = await this.orderRepository.find(input.id);

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
