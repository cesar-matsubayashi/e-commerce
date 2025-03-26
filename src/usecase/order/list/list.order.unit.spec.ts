import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import OrderService from "../../../domain/checkout/service/order.service";
import OrderItem from "../../../domain/checkout/entity/order_item";
import ListOrderUseCase from "./list.order.usecase";

const customer = new Customer("123", "John");
const address = new Address("Street", 123, "Zip", "City");
customer.changeAddress(address);

const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
const order = OrderService.placeOrder(customer, [item]);

const item2 = new OrderItem("i2", "Item 2", 100, "p2", 1);
const item3 = new OrderItem("i3", "Item 3", 100, "p3", 1);
const order2 = OrderService.placeOrder(customer, [item2, item3]);

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([order, order2])),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test find order use case", () => {
  it("should find a order", async () => {
    const orderRepository = MockRepository();
    const listOrderUseCase = new ListOrderUseCase(orderRepository);

    const output = await listOrderUseCase.execute({});

    expect(output.orders.length).toBe(2);
    expect(output.orders[0].id).toBe(order.id);
    expect(output.orders[0].customerId).toBe(order.customerId);
    expect(output.orders[0].items).toEqual([
      {
        id: item.id,
        name: item.name,
        price: item.price,
        productId: item.productId,
        quantity: item.quantity,
        total: item.total(),
      },
    ]);

    expect(output.orders[1].id).toBe(order2.id);
    expect(output.orders[1].customerId).toBe(order2.customerId);
    expect(output.orders[1].items).toEqual([
      {
        id: item2.id,
        name: item2.name,
        price: item2.price,
        productId: item2.productId,
        quantity: item2.quantity,
        total: item2.total(),
      },
      {
        id: item3.id,
        name: item3.name,
        price: item3.price,
        productId: item3.productId,
        quantity: item3.quantity,
        total: item3.total(),
      },
    ]);
  });
});
