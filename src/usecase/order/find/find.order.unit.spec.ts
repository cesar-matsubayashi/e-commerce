import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import OrderService from "../../../domain/checkout/service/order.service";
import OrderItem from "../../../domain/checkout/entity/order_item";
import FindOrdertUseCase from "./find.order.usecase";

const customer = new Customer("123", "John");
const address = new Address("Street", 123, "Zip", "City");
customer.changeAddress(address);

const item = new OrderItem("i1", "Item 1", 100, "p1", 1);

const order = OrderService.placeOrder(customer, [item]);

const output = {
  id: order.id,
  customerId: customer.id,
  items: [
    {
      id: "i1",
      name: "Item 1",
      productId: "p1",
      quantity: 1,
      price: 100,
    },
  ],
};

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(order)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test find order use case", () => {
  it("should find a order", async () => {
    const orderRepository = MockRepository();
    const findOrderUseCase = new FindOrdertUseCase(orderRepository);

    const result = await findOrderUseCase.execute({ id: order.id });

    expect(result).toEqual(output);
  });

  it("should not find a order", async () => {
    const orderRepository = MockRepository();
    orderRepository.find.mockImplementation(() => {
      throw new Error("Order not found");
    });
    const findOrderUseCase = new FindOrdertUseCase(orderRepository);

    expect(() => {
      return findOrderUseCase.execute({ id: "1" });
    }).rejects.toThrow("Order not found");
  });
});
