import Order from "../../../domain/checkout/entity/order";
import OrderItem from "../../../domain/checkout/entity/order_item";
import UpdateOrderUseCase from "./update.order.usecase";

const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
const order = new Order("o1", "c1", [item]);

const input = {
  id: order.id,
  customerId: "c2",
  items: [
    {
      id: item.id,
      name: "Product 1 Updated",
      productId: "p1 Updated",
      quantity: 2,
      price: 150,
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

describe("Unit test update order use case", () => {
  it("should update a order", async () => {
    const orderRepository = MockRepository();
    const updateOrderUseCase = new UpdateOrderUseCase(orderRepository);

    const output = await updateOrderUseCase.execute(input);

    expect(output).toEqual(input);
  });

  it("should throw an error when customerId is missing", async () => {
    const orderRepository = MockRepository();
    const updateOrderUseCase = new UpdateOrderUseCase(orderRepository);

    const testInput = { ...input, customerId: "" };

    await expect(updateOrderUseCase.execute(testInput)).rejects.toThrow(
      "CustomerId is required"
    );
  });

  it("should throw an error when item id is missing", async () => {
    const orderRepository = MockRepository();
    const updateOrderUseCase = new UpdateOrderUseCase(orderRepository);

    const testInput = {
      ...input,
      items: input.items.map((item) => ({
        ...item,
        id: "",
      })),
    };

    await expect(updateOrderUseCase.execute(testInput)).rejects.toThrow(
      "Item id is required"
    );
  });

  it("should throw an error when item name is missing", async () => {
    const orderRepository = MockRepository();
    const updateOrderUseCase = new UpdateOrderUseCase(orderRepository);

    const testInput = {
      ...input,
      items: input.items.map((item) => ({
        ...item,
        name: "",
      })),
    };

    await expect(updateOrderUseCase.execute(testInput)).rejects.toThrow(
      "Item name is required"
    );
  });

  it("should throw an error when item quantity is less or equal than 0", async () => {
    const orderRepository = MockRepository();
    const updateOrderUseCase = new UpdateOrderUseCase(orderRepository);

    const testInput = {
      ...input,
      items: input.items.map((item) => ({
        ...item,
        quantity: 0,
      })),
    };

    await expect(updateOrderUseCase.execute(testInput)).rejects.toThrow(
      "Item quantity must be greater than 0"
    );
  });

  it("should throw an error when item price is less or equal than 0", async () => {
    const orderRepository = MockRepository();
    const updateOrderUseCase = new UpdateOrderUseCase(orderRepository);

    const testInput = {
      ...input,
      items: input.items.map((item) => ({
        ...item,
        price: -1,
      })),
    };

    await expect(updateOrderUseCase.execute(testInput)).rejects.toThrow(
      "Item price must be greater than 0"
    );
  });
});
