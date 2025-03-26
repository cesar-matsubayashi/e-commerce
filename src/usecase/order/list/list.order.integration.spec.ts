import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import OrderService from "../../../domain/checkout/service/order.service";
import OrderItem from "../../../domain/checkout/entity/order_item";
import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import OrderModel from "../../../infrastructure/order/repository/sequilize/order.model";
import OrderItemModel from "../../../infrastructure/order/repository/sequilize/order-item.model";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import OrderRepository from "../../../infrastructure/order/repository/sequilize/order.repository";
import ListOrderUseCase from "./list.order.usecase";

describe("Integration test find order use case", () => {
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
    const customer = new Customer("123", "John");
    const address = new Address("Street", 123, "Zip", "City");
    customer.changeAddress(address);
    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("p1", "Product 1", 100);
    const product2 = new Product("p2", "Product 2", 200);
    const product3 = new Product("p3", "Product 3", 300);
    await productRepository.create(product1);
    await productRepository.create(product2);
    await productRepository.create(product3);

    const item1 = new OrderItem(
      "i1",
      product1.name,
      product1.price,
      product1.id,
      1
    );
    const item2 = new OrderItem(
      "i2",
      product2.name,
      product2.price,
      product2.id,
      1
    );
    const item3 = new OrderItem(
      "i3",
      product3.name,
      product3.price,
      product3.id,
      1
    );

    const order = OrderService.placeOrder(customer, [item1]);
    const order2 = OrderService.placeOrder(customer, [item2, item3]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    await orderRepository.create(order2);

    const listOrderUseCase = new ListOrderUseCase(orderRepository);

    const output = await listOrderUseCase.execute({});

    expect(output.orders.length).toBe(2);
    expect(output.orders[0].id).toBe(order.id);
    expect(output.orders[0].customerId).toBe(order.customerId);
    expect(output.orders[0].items).toEqual([
      {
        id: item1.id,
        name: item1.name,
        price: item1.price,
        productId: item1.productId,
        quantity: item1.quantity,
        total: item1.total(),
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
