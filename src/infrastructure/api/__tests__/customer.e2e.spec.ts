import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for customer", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const response = await request(app)
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

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("John");
    expect(response.body.address.street).toBe("Street");
    expect(response.body.address.city).toBe("City");
    expect(response.body.address.number).toBe(123);
    expect(response.body.address.zip).toBe("12345");
  });

  it("should not create a customer", async () => {
    const response = await request(app).post("/customer").send({
      name: "John",
    });

    expect(response.status).toBe(500);
  });

  it("should find a customer", async () => {
    const response = await request(app)
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

    expect(response.status).toBe(200);

    const customer = await request(app)
      .get(`/customer/${response.body.id}`)
      .send();

    expect(customer.status).toBe(200);
    expect(customer.body.name).toBe("John");
    expect(customer.body.address.street).toBe("Street");
  });

  it("should find a customer xml", async () => {
    const response = await request(app)
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

    expect(response.status).toBe(200);

    const customer = await request(app)
      .get(`/customer/${response.body.id}`)
      .set("Accept", "application/xml")
      .send();

    expect(customer.status).toBe(200);
    expect(customer.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(customer.text).toContain(`<customer>`);
    expect(customer.text).toContain(`<name>John</name>`);
    expect(customer.text).toContain(`<address>`);
    expect(customer.text).toContain(`<street>Street</street>`);
    expect(customer.text).toContain(`<city>City</city>`);
    expect(customer.text).toContain(`<number>123</number>`);
    expect(customer.text).toContain(`<zip>12345</zip>`);
    expect(customer.text).toContain(`</address>`);
    expect(customer.text).toContain(`</customer>`);
  });

  it("should list all customers", async () => {
    const response = await request(app)
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

    expect(response.status).toBe(200);

    const response2 = await request(app)
      .post("/customer")
      .send({
        name: "Jane",
        address: {
          street: "Street 2",
          city: "City 2",
          number: 1234,
          zip: "12345",
        },
      });

    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/customer").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.customers.length).toBe(2);

    const customer = listResponse.body.customers[0];
    expect(customer.name).toBe("John");
    expect(customer.address.street).toBe("Street");

    const customer2 = listResponse.body.customers[1];
    expect(customer2.name).toBe("Jane");
    expect(customer2.address.street).toBe("Street 2");
  });

  it("should list all customers xml", async () => {
    const response = await request(app)
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
    expect(response.status).toBe(200);

    const response2 = await request(app)
      .post("/customer")
      .send({
        name: "Jane",
        address: {
          street: "Street 2",
          city: "City 2",
          number: 1234,
          zip: "12345",
        },
      });
    expect(response2.status).toBe(200);

    const listResponseXML = await request(app)
      .get("/customer")
      .set("Accept", "application/xml")
      .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(
      `<?xml version="1.0" encoding="UTF-8"?>`
    );
    expect(listResponseXML.text).toContain(`<customers>`);
    expect(listResponseXML.text).toContain(`<customer>`);
    expect(listResponseXML.text).toContain(`<name>John</name>`);
    expect(listResponseXML.text).toContain(`<address>`);
    expect(listResponseXML.text).toContain(`<street>Street</street>`);
    expect(listResponseXML.text).toContain(`<city>City</city>`);
    expect(listResponseXML.text).toContain(`<number>123</number>`);
    expect(listResponseXML.text).toContain(`<zip>12345</zip>`);
    expect(listResponseXML.text).toContain(`</address>`);
    expect(listResponseXML.text).toContain(`</customer>`);
    expect(listResponseXML.text).toContain(`<name>Jane</name>`);
    expect(listResponseXML.text).toContain(`<street>Street 2</street>`);
    expect(listResponseXML.text).toContain(`<city>City 2</city>`);
    expect(listResponseXML.text).toContain(`<number>1234</number>`);
    expect(listResponseXML.text).toContain(`</customers>`);
  });

  it("should update a customer", async () => {
    const response = await request(app)
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
    expect(response.status).toBe(200);

    const input = {
      id: response.body.id,
      name: "John Updated",
      address: {
        street: "Street Updated",
        number: 1234,
        zip: "12345678",
        city: "City Updated",
      },
    };
    const output = await request(app)
      .put(`/customer/${response.body.id}`)
      .send(input);

    expect(output.status).toBe(200);
    expect(output.body).toEqual(input);
  });

  it("should update a customer xml", async () => {
    const response = await request(app)
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
    expect(response.status).toBe(200);

    const input = {
      id: response.body.id,
      name: "John Updated",
      address: {
        street: "Street Updated",
        number: 1234,
        zip: "12345678",
        city: "City Updated",
      },
    };
    const output = await request(app)
      .put(`/customer/${response.body.id}`)
      .set("Accept", "application/xml")
      .send(input);

    expect(output.status).toBe(200);
    expect(output.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(output.text).toContain(`<customer>`);
    expect(output.text).toContain(`<name>John Updated</name>`);
    expect(output.text).toContain(`<address>`);
    expect(output.text).toContain(`<street>Street Updated</street>`);
    expect(output.text).toContain(`<city>City Updated</city>`);
    expect(output.text).toContain(`<number>1234</number>`);
    expect(output.text).toContain(`<zip>12345678</zip>`);
    expect(output.text).toContain(`</address>`);
    expect(output.text).toContain(`</customer>`);
  });
});
