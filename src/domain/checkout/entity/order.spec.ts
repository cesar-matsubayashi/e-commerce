import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let order = new Order("", "123", []);
    }).toThrowError("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "", []);
    }).toThrowError("CustomerId is required");
  });

  it("should throw error when items is empty", () => {
    expect(() => {
      let order = new Order("123", "123", []);
    }).toThrowError("Items are required");
  });

  it("should calculate total", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    const order = new Order("o1", "c1", [item]);

    let total = order.total();

    expect(order.total()).toBe(200);

    const order2 = new Order("o1", "c1", [item, item2]);
    total = order2.total();
    expect(total).toBe(600);
  });

  it("should throw error if the item qte is less or equal zero 0", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
      const order = new Order("o1", "c1", [item]);
    }).toThrowError("Item quantity must be greater than 0");
  });

  it("should throw error if item id is missing", () => {
    expect(() => {
      const item = new OrderItem("", "Item 1", 100, "p1", 10);
      const order = new Order("o1", "c1", [item]);
    }).toThrowError("Item id is required");
  });

  it("should throw error if item name is missing", () => {
    expect(() => {
      const item = new OrderItem("i1", "", 100, "p1", 10);
      const order = new Order("o1", "c1", [item]);
    }).toThrowError("Item name is required");
  });

  it("should throw error if item productId is missing", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "", 10);
      const order = new Order("o1", "c1", [item]);
    }).toThrowError("Item productId is required");
  });

  it("should throw error if item price is less or equal 0", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 0, "p1", 10);
      const order = new Order("o1", "c1", [item]);
    }).toThrowError("Item price must be greater than 0");
  });

  it("should throw error if item name and productId is missing", () => {
    expect(() => {
      const item = new OrderItem("i1", "", 100, "", 10);
      const order = new Order("o1", "c1", [item]);
    }).toThrowError(
      "order: Item name is required,order: Item productId is required"
    );
  });

  it("should throw error if customerId and item productId is missing", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "", 10);
      const order = new Order("o1", "", [item]);
    }).toThrowError(
      "order: CustomerId is required,order: Item productId is required"
    );
  });
});
