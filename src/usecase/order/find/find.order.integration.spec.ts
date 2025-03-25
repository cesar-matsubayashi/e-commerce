import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import OrderService from "../../../domain/checkout/service/order.service";
import OrderItem from "../../../domain/checkout/entity/order_item";
import FindOrdertUseCase from "./find.order.usecase";
import OrderRepository from "../../../infrastructure/order/repository/sequilize/order.repository";
import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import OrderModel from "../../../infrastructure/order/repository/sequilize/order.model";
import OrderItemModel from "../../../infrastructure/order/repository/sequilize/order-item.model";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";

describe("Unit test find order use case", () => {
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
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "John");
    const address = new Address("Street", 123, "Zip", "City");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 100);
    await productRepository.create(product);

    const item = new OrderItem(
      "i1",
      product.name,
      product.price,
      product.id,
      1
    );

    const orderRepository = new OrderRepository();
    const findOrderUseCase = new FindOrdertUseCase(orderRepository);

    const order = OrderService.placeOrder(customer, [item]);
    await orderRepository.create(order);

    const output = {
      id: order.id,
      customerId: "123",
      items: [
        {
          id: item.id,
          name: "Product 1",
          productId: "123",
          quantity: 1,
          price: 100,
        },
      ],
    };

    const result = await findOrderUseCase.execute({ id: order.id });
    expect(result).toEqual(output);
  });

  it("should not find a order", async () => {
    const orderRepository = new OrderRepository();
    const findOrderUseCase = new FindOrdertUseCase(orderRepository);

    expect(() => {
      return findOrderUseCase.execute({ id: "1" });
    }).rejects.toThrow("Order not found");
  });
});
