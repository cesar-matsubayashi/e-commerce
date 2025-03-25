import { v4 as uuid } from "uuid";
import CreateOrdertUseCase from "./create.order.usecase";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";

const customer = new Customer("123", "John");
const address = new Address("Street", 123, "Zip", "City");
customer.changeAddress(address);

const input = {
  customerId: customer.id,
  items: [
    {
      id: expect.any(String),
      name: "Product 1",
      productId: uuid(),
      quantity: 1,
      price: 100,
    },
  ],
};

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

const MockCustomerRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test create order use case", () => {
  it("should create a order", async () => {
    const orderRepository = MockRepository();
    const customerRepository = MockCustomerRepository();

    const orderCreateUseCase = new CreateOrdertUseCase(
      orderRepository,
      customerRepository
    );

    const output = await orderCreateUseCase.execute(input);

    expect(output).toEqual({ ...input, id: expect.any(String) });
    expect(customer.rewardPoints).toBe(50);
  });

  it("should throw an error when customerId is missing", async () => {
    const orderRepository = MockRepository();
    const customerRepository = MockCustomerRepository();
    customerRepository.find.mockImplementation(() => {
      throw new Error("Customer not found");
    });

    const orderCreateUseCase = new CreateOrdertUseCase(
      orderRepository,
      customerRepository
    );

    const testInput = { ...input, customerId: "" };

    await expect(orderCreateUseCase.execute(testInput)).rejects.toThrow(
      "Customer not found"
    );
  });

  it("should throw an error when item id is missing", async () => {
    const orderRepository = MockRepository();
    const customerRepository = MockCustomerRepository();

    const orderCreateUseCase = new CreateOrdertUseCase(
      orderRepository,
      customerRepository
    );

    const testInput = {
      ...input,
      items: input.items.map((item) => ({
        ...item,
        id: "",
      })),
    };

    await expect(orderCreateUseCase.execute(testInput)).rejects.toThrow(
      "Item id is required"
    );
  });

  it("should throw an error when item name is missing", async () => {
    const orderRepository = MockRepository();
    const customerRepository = MockCustomerRepository();

    const orderCreateUseCase = new CreateOrdertUseCase(
      orderRepository,
      customerRepository
    );

    const testInput = {
      ...input,
      items: input.items.map((item) => ({
        ...item,
        name: "",
      })),
    };

    await expect(orderCreateUseCase.execute(testInput)).rejects.toThrow(
      "Item name is required"
    );
  });

  it("should throw an error when item quantity is less or equal than 0", async () => {
    const orderRepository = MockRepository();
    const customerRepository = MockCustomerRepository();

    const orderCreateUseCase = new CreateOrdertUseCase(
      orderRepository,
      customerRepository
    );

    const testInput = {
      ...input,
      items: input.items.map((item) => ({
        ...item,
        quantity: 0,
      })),
    };

    await expect(orderCreateUseCase.execute(testInput)).rejects.toThrow(
      "Item quantity must be greater than 0"
    );
  });

  it("should throw an error when item price is less or equal than 0", async () => {
    const orderRepository = MockRepository();
    const customerRepository = MockCustomerRepository();

    const orderCreateUseCase = new CreateOrdertUseCase(
      orderRepository,
      customerRepository
    );

    const testInput = {
      ...input,
      items: input.items.map((item) => ({
        ...item,
        price: -1,
      })),
    };

    await expect(orderCreateUseCase.execute(testInput)).rejects.toThrow(
      "Item price must be greater than 0"
    );
  });
});
