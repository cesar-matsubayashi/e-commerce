import Order from "../../../domain/checkout/entity/order";
import OrderRepositoryInterface from "../../../domain/checkout/repository/order-repository.interface";
import { InputListOrderDto, OutputListOrderDto } from "./list.order.dto";

export default class ListOrderUseCase {
  private orderRepository: OrderRepositoryInterface;

  constructor(orderRepository: OrderRepositoryInterface) {
    this.orderRepository = orderRepository;
  }

  async execute(input: InputListOrderDto): Promise<OutputListOrderDto> {
    const orders = await this.orderRepository.findAll();
    return OutputMapper.toOutput(orders);
  }
}

class OutputMapper {
  static toOutput(orders: Order[]): OutputListOrderDto {
    return {
      orders: orders.map((order) => ({
        id: order.id,
        customerId: order.customerId,
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          total: item.total(),
        })),
      })),
    };
  }
}
