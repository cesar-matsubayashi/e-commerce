import OrderFactory from "./order.factory";
import OrderItem from "../entity/order_item";

describe("Order factory unit test", () => {
  it("should create an order", () => {
    const item = new OrderItem("i123", "Product 1", 100, "p123", 1);

    const order = OrderFactory.create("c123", [item]);

    expect(order.customerId).toBe("c123");
    expect(order.items.length).toBe(1);
    expect(order.items[0].id).toBe("i123");
    expect(order.items[0].name).toBe("Product 1");
    expect(order.items[0].price).toBe(100);
    expect(order.items[0].productId).toBe("p123");
    expect(order.items[0].quantity).toBe(1);
  });
});
