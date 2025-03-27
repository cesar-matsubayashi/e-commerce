import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app).post("/product").send({
      type: "a",
      name: "Product A",
      price: 10,
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product A");
    expect(response.body.price).toBe(10);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "Product A",
    });

    expect(response.status).toBe(500);
  });

  it("should find a product", async () => {
    const response = await request(app).post("/product").send({
      type: "a",
      name: "Product A",
      price: 10,
    });
    expect(response.status).toBe(200);

    const output = await request(app)
      .get(`/product/${response.body.id}`)
      .send();

    expect(output.status).toBe(200);
    expect(output.body.name).toBe("Product A");
    expect(output.body.price).toBe(10);
  });

  it("should find a product xml", async () => {
    const response = await request(app).post("/product").send({
      type: "a",
      name: "Product A",
      price: 10,
    });
    expect(response.status).toBe(200);

    const output = await request(app)
      .get(`/product/${response.body.id}`)
      .set("Accept", "application/xml")
      .send();

    expect(output.status).toBe(200);
    expect(output.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(output.text).toContain(`<product>`);
    expect(output.text).toContain(`<name>Product A</name>`);
    expect(output.text).toContain(`<price>10</price>`);
    expect(output.text).toContain(`</product>`);
  });

  it("should list all products", async () => {
    const response = await request(app).post("/product").send({
      type: "a",
      name: "Product A",
      price: 10,
    });

    expect(response.status).toBe(200);

    const response2 = await request(app).post("/product").send({
      type: "b",
      name: "Product B",
      price: 10,
    });

    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);

    const product = listResponse.body.products[0];
    expect(product.name).toBe("Product A");
    expect(product.price).toBe(10);

    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe("Product B");
    expect(product2.price).toBe(20);
  });

  it("should list all products xml", async () => {
    const response = await request(app).post("/product").send({
      type: "a",
      name: "Product A",
      price: 10,
    });
    expect(response.status).toBe(200);

    const response2 = await request(app).post("/product").send({
      type: "b",
      name: "Product B",
      price: 10,
    });
    expect(response2.status).toBe(200);

    const listResponse = await request(app)
      .get("/product")
      .set("Accept", "application/xml")
      .send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.text).toContain(
      `<?xml version="1.0" encoding="UTF-8"?>`
    );
    expect(listResponse.text).toContain(`<products>`);
    expect(listResponse.text).toContain(`<product>`);
    expect(listResponse.text).toContain(`<name>Product A</name>`);
    expect(listResponse.text).toContain(`<price>10</price>`);
    expect(listResponse.text).toContain(`<name>Product B</name>`);
    expect(listResponse.text).toContain(`<price>20</price>`);
    expect(listResponse.text).toContain(`</product>`);
    expect(listResponse.text).toContain(`</products>`);
  });

  it("should update a product", async () => {
    const response = await request(app).post("/product").send({
      type: "a",
      name: "Product A",
      price: 10,
    });

    expect(response.status).toBe(200);

    const input = {
      id: response.body.id,
      name: "Product A Updated",
      price: 15,
    };

    const output = await request(app).put(`/product/${input.id}`).send(input);

    expect(output.status).toBe(200);
    expect(output.body).toEqual(input);
  });

  it("should update a product xml", async () => {
    const response = await request(app).post("/product").send({
      type: "a",
      name: "Product A",
      price: 10,
    });

    expect(response.status).toBe(200);

    const input = {
      id: response.body.id,
      name: "Product A Updated",
      price: 15,
    };

    const output = await request(app)
      .put(`/product/${input.id}`)
      .set("Accept", "application/xml")
      .send(input);

    expect(output.status).toBe(200);
    expect(output.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(output.text).toContain(`<product>`);
    expect(output.text).toContain(`<name>Product A Updated</name>`);
    expect(output.text).toContain(`<price>15</price>`);
    expect(output.text).toContain(`</product>`);
  });
});
