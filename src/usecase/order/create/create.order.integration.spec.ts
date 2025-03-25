import { v4 as uuid } from "uuid";
import CreateOrdertUseCase from "./create.order.usecase";
import { Sequelize } from "sequelize-typescript";
import OrderModel from "../../../infrastructure/order/repository/sequilize/order.model";
import OrderItemModel from "../../../infrastructure/order/repository/sequilize/order-item.model";
import OrderRepository from "../../../infrastructure/order/repository/sequilize/order.repository";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";

const input = {
  customerId: "123",
  items: [
    {
      id: uuid(),
      name: "Product 1",
      productId: "123",
      quantity: 1,
      price: 100,
    },
  ],
};

const customer = new Customer("123", "Customer 1");
const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
customer.changeAddress(address);

describe("Unit test create order use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();

    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 100);
    await productRepository.create(product);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a order and update a customer", async () => {
    const orderRepository = new OrderRepository();
    const customerRepository = new CustomerRepository();

    const orderCreateUseCase = new CreateOrdertUseCase(
      orderRepository,
      customerRepository
    );

    const output = await orderCreateUseCase.execute(input);
    expect(output).toEqual({ ...input, id: expect.any(String) });

    const customerOutput = await customerRepository.find(customer.id);
    expect(customerOutput.rewardPoints).toBe(50);
  });

  it("should throw an error when customerId is missing", async () => {
    const orderRepository = new OrderRepository();
    const customerRepository = new CustomerRepository();

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
    const orderRepository = new OrderRepository();
    const customerRepository = new CustomerRepository();

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
    const orderRepository = new OrderRepository();
    const customerRepository = new CustomerRepository();

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
    const orderRepository = new OrderRepository();
    const customerRepository = new CustomerRepository();

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
    const orderRepository = new OrderRepository();
    const customerRepository = new CustomerRepository();

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
