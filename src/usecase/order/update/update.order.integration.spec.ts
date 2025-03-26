import { Sequelize } from "sequelize-typescript";
import OrderItem from "../../../domain/checkout/entity/order_item";
import UpdateOrderUseCase from "./update.order.usecase";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import OrderItemModel from "../../../infrastructure/order/repository/sequilize/order-item.model";
import OrderModel from "../../../infrastructure/order/repository/sequilize/order.model";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import Address from "../../../domain/customer/value-object/address";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import OrderService from "../../../domain/checkout/service/order.service";
import OrderRepository from "../../../infrastructure/order/repository/sequilize/order.repository";

const product1 = new Product("123", "Product 1", 100);
const product2 = new Product("1234", "Product 2", 200);

const customer1 = CustomerFactory.createWithAddress(
  "John",
  new Address("Street 1", 1, "Zipcode 1", "City 1")
);
const customer2 = CustomerFactory.createWithAddress(
  "Jane",
  new Address("Street 2", 2, "Zipcode 2", "City 2")
);

const item = new OrderItem("i1", product1.name, product1.price, product1.id, 1);
const order = OrderService.placeOrder(customer1, [item]);

item.changeItem(product2, 1);

const input = {
  id: order.id,
  customerId: customer2.id,
  items: [
    {
      id: item.id,
      name: item.name,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    },
  ],
};

describe("Integration test update order use case", () => {
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
    await customerRepository.create(customer1);
    await customerRepository.create(customer2);

    const productRepository = new ProductRepository();
    await productRepository.create(product1);
    await productRepository.create(product2);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
  });

  afterEach(async () => {
    await sequelize.close();
  });
  it("should update a order", async () => {
    const orderRepository = new OrderRepository();
    const updateOrderUseCase = new UpdateOrderUseCase(orderRepository);

    const output = await updateOrderUseCase.execute(input);

    expect(output).toEqual(input);
  });

  it("should throw an error when customerId is missing", async () => {
    const orderRepository = new OrderRepository();
    const updateOrderUseCase = new UpdateOrderUseCase(orderRepository);

    const testInput = { ...input, customerId: "" };

    await expect(updateOrderUseCase.execute(testInput)).rejects.toThrow(
      "CustomerId is required"
    );
  });

  it("should throw an error when item id is missing", async () => {
    const orderRepository = new OrderRepository();
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
    const orderRepository = new OrderRepository();
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
    const orderRepository = new OrderRepository();
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
    const orderRepository = new OrderRepository();
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
