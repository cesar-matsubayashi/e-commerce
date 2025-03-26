import { v4 as uuid } from "uuid";
import { app, sequelize } from "../express";
import request from "supertest";

let customer: any;
let customer2: any;
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

    customer2 = await request(app)
      .post("/customer")
      .send({
        name: "Jane",
        address: {
          street: "Street 1",
          city: "City 1",
          number: 1232,
          zip: "123456",
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

  it("should find an order", async () => {
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

    const order = await request(app).get(`/order/${response.body.id}`).send();

    expect(order.status).toBe(200);
    expect(order.body.customerId).toBe(customer.body.id);
    expect(order.body.items.length).toBe(2);
    expect(order.body.items[0].name).toBe(productA.body.name);
    expect(order.body.items[0].productId).toBe(productA.body.id);
    expect(order.body.items[0].price).toBe(productA.body.price);
    expect(order.body.items[0].quantity).toBe(2);
    expect(order.body.items[1].name).toBe(productB.body.name);
    expect(order.body.items[1].productId).toBe(productB.body.id);
    expect(order.body.items[1].price).toBe(productB.body.price);
    expect(order.body.items[1].quantity).toBe(1);
  });

  it("should find an order xml", async () => {
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

    const order = await request(app)
      .get(`/order/${response.body.id}`)
      .set("Accept", "application/xml")
      .send();

    expect(order.status).toBe(200);
    expect(order.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(order.text).toContain(`<order>`);
    expect(order.text).toContain(
      `<customerId>${customer.body.id}</customerId>`
    );
    expect(order.text).toContain(`<items>`);
    expect(order.text).toContain(`<item>`);
    expect(order.text).toContain(`<name>${productA.body.name}</name>`);
    expect(order.text).toContain(`<productId>${productA.body.id}</productId>`);
    expect(order.text).toContain(`<quantity>2</quantity>`);
    expect(order.text).toContain(`<price>${productA.body.price}</price>`);
    expect(order.text).toContain(`<name>${productB.body.name}</name>`);
    expect(order.text).toContain(`<productId>${productB.body.id}</productId>`);
    expect(order.text).toContain(`<quantity>1</quantity>`);
    expect(order.text).toContain(`<price>${productB.body.price}</price>`);
    expect(order.text).toContain(`</item>`);
    expect(order.text).toContain(`</items>`);
    expect(order.text).toContain(`</order>`);
  });

  it("should list all orders", async () => {
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

    const response2 = await request(app)
      .post("/order")
      .send({
        customerId: customer2.body.id,
        items: [
          {
            id: uuid(),
            name: productA.body.name,
            productId: productA.body.id,
            quantity: 3,
            price: productA.body.price,
          },
        ],
      });
    expect(response2.status).toBe(200);

    const orderList = await request(app).get(`/order`).send();

    expect(orderList.status).toBe(200);
    expect(orderList.body.orders.length).toBe(2);

    const order1 = orderList.body.orders[0];
    expect(order1.customerId).toBe(customer.body.id);
    expect(order1.items.length).toBe(2);
    expect(order1.items[0].name).toBe(productA.body.name);
    expect(order1.items[0].productId).toBe(productA.body.id);
    expect(order1.items[0].price).toBe(productA.body.price);
    expect(order1.items[0].quantity).toBe(2);
    expect(order1.items[1].name).toBe(productB.body.name);
    expect(order1.items[1].productId).toBe(productB.body.id);
    expect(order1.items[1].price).toBe(productB.body.price);
    expect(order1.items[1].quantity).toBe(1);

    const order2 = orderList.body.orders[1];
    expect(order2.customerId).toBe(customer2.body.id);
    expect(order2.items.length).toBe(1);
    expect(order2.items[0].name).toBe(productA.body.name);
    expect(order2.items[0].productId).toBe(productA.body.id);
    expect(order2.items[0].price).toBe(productA.body.price);
    expect(order2.items[0].quantity).toBe(3);
  });

  it("should list all orders xml", async () => {
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

    const response2 = await request(app)
      .post("/order")
      .send({
        customerId: customer2.body.id,
        items: [
          {
            id: uuid(),
            name: productA.body.name,
            productId: productA.body.id,
            quantity: 3,
            price: productA.body.price,
          },
        ],
      });
    expect(response2.status).toBe(200);

    const order = await request(app)
      .get(`/order`)
      .set("Accept", "application/xml")
      .send();

    expect(order.status).toBe(200);
    expect(order.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(order.text).toContain(`<orders>`);
    expect(order.text).toContain(`<order>`);
    expect(order.text).toContain(
      `<customerId>${customer.body.id}</customerId>`
    );
    expect(order.text).toContain(`<items>`);
    expect(order.text).toContain(`<item>`);
    expect(order.text).toContain(`<name>${productA.body.name}</name>`);
    expect(order.text).toContain(`<productId>${productA.body.id}</productId>`);
    expect(order.text).toContain(`<quantity>2</quantity>`);
    expect(order.text).toContain(`<price>${productA.body.price}</price>`);
    expect(order.text).toContain(`<name>${productB.body.name}</name>`);
    expect(order.text).toContain(`<productId>${productB.body.id}</productId>`);
    expect(order.text).toContain(`<quantity>1</quantity>`);
    expect(order.text).toContain(`<price>${productB.body.price}</price>`);
    expect(order.text).toContain(
      `<customerId>${customer2.body.id}</customerId>`
    );
    expect(order.text).toContain(`<name>${productA.body.name}</name>`);
    expect(order.text).toContain(`<productId>${productA.body.id}</productId>`);
    expect(order.text).toContain(`<quantity>2</quantity>`);
    expect(order.text).toContain(`<price>${productA.body.price}</price>`);
    expect(order.text).toContain(`<quantity>3</quantity>`);
    expect(order.text).toContain(`</item>`);
    expect(order.text).toContain(`</items>`);
    expect(order.text).toContain(`</order>`);
    expect(order.text).toContain(`</orders>`);
  });

  it("should update an order", async () => {
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
        ],
      });

    const input = {
      id: response.body.id,
      customerId: customer2.body.id,
      items: [
        {
          id: response.body.items[0].id,
          name: productB.body.name,
          productId: productB.body.id,
          quantity: 1,
          price: productB.body.price,
        },
      ],
    };

    const output = await request(app)
      .put(`/order/${response.body.id}`)
      .send(input);

    expect(output.status).toBe(200);
    expect(output.body).toEqual(input);
  });

  it("should update an order xml", async () => {
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
        ],
      });

    const input = {
      id: response.body.id,
      customerId: customer2.body.id,
      items: [
        {
          id: response.body.items[0].id,
          name: productB.body.name,
          productId: productB.body.id,
          quantity: 1,
          price: productB.body.price,
        },
      ],
    };

    const output = await request(app)
      .put(`/order/${response.body.id}`)
      .set("Accept", "application/xml")
      .send(input);

    expect(output.status).toBe(200);
    expect(output.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(output.text).toContain(`<order>`);
    expect(output.text).toContain(
      `<customerId>${customer2.body.id}</customerId>`
    );
    expect(output.text).toContain(`<items>`);
    expect(output.text).toContain(`<item>`);
    expect(output.text).toContain(`<name>${productB.body.name}</name>`);
    expect(output.text).toContain(`<productId>${productB.body.id}</productId>`);
    expect(output.text).toContain(`<quantity>1</quantity>`);
    expect(output.text).toContain(`<price>${productB.body.price}</price>`);
    expect(output.text).toContain(`</item>`);
    expect(output.text).toContain(`</items>`);
    expect(output.text).toContain(`</order>`);
  });
});
