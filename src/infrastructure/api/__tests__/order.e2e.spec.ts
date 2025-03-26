import { v4 as uuid } from "uuid";
import { app, sequelize } from "../express";
import request from "supertest";

let customer: any;
let productA: any;
let productB: any;

describe("E2E test for order", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });

    customer = await request(app)
      .post("/customer")
      .send({
        name: "John",
        address: {
          street: "Street",
          city: "City",
          number: 123,
          zip: "12345",
        },
      });

    productA = await request(app).post("/product").send({
      type: "a",
      name: "Product A",
      price: 100,
    });

    productB = await request(app).post("/product").send({
      type: "b",
      name: "Product B",
      price: 150,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a order", async () => {
    const response = await request(app)
      .post("/order")
      .send({
        customerId: customer.body.id,
        items: [
          {
            id: uuid(),
            name: productA.body.name,
            productId: productA.body.id,
            quantity: 2,
            price: productA.body.price,
          },
          {
            id: uuid(),
            name: productB.body.name,
            productId: productB.body.id,
            quantity: 1,
            price: productB.body.price,
          },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.customerId).toBe(customer.body.id);
    expect(response.body.items.length).toBe(2);
    expect(response.body.items[0].name).toBe(productA.body.name);
    expect(response.body.items[0].productId).toBe(productA.body.id);
    expect(response.body.items[0].price).toBe(productA.body.price);
    expect(response.body.items[0].quantity).toBe(2);
    expect(response.body.items[1].name).toBe(productB.body.name);
    expect(response.body.items[1].productId).toBe(productB.body.id);
    expect(response.body.items[1].price).toBe(productB.body.price);
    expect(response.body.items[1].quantity).toBe(1);
  });

  it("should not create an order", async () => {
    const response = await request(app)
      .post("/order")
      .send({
        customerId: "123",
        items: [
          {
            id: uuid(),
            name: productA.body.name,
            productId: productA.body.id,
            quantity: 2,
            price: productA.body.price,
          },
          {
            id: uuid(),
            name: productB.body.name,
            productId: productB.body.id,
            quantity: 1,
            price: productB.body.price,
          },
        ],
      });

    expect(response.status).toBe(500);
  });
});
