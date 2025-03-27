import { number } from "yup";
import CreateCustomerUseCase from "./create.customer.usecase";
import EventDispatcher from "../../../domain/@shared/event/event-dispatcher";

const input = {
  name: "John",
  address: {
    street: "Street",
    number: 123,
    zip: "Zip",
    city: "City",
  },
};

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test create customer use case", () => {
  it("should create a customer", async () => {
    const customerRepository = MockRepository();
    const eventDispatcher = new EventDispatcher();
    const customerCreateUseCase = new CreateCustomerUseCase(
      customerRepository,
      eventDispatcher
    );

    const output = await customerCreateUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      address: {
        street: input.address.street,
        number: input.address.number,
        zip: input.address.zip,
        city: input.address.city,
      },
      rewardPoints: 0,
    });
  });

  it("should throw an error when name is missing", async () => {
    const customerRepository = MockRepository();
    const eventDispatcher = new EventDispatcher();
    const customerCreateUseCase = new CreateCustomerUseCase(
      customerRepository,
      eventDispatcher
    );

    const testInput = { ...input, name: "" };

    await expect(customerCreateUseCase.execute(testInput)).rejects.toThrow(
      "Name is required"
    );
  });

  it("should throw an error when street is missing", async () => {
    const customerRepository = MockRepository();
    const eventDispatcher = new EventDispatcher();
    const customerCreateUseCase = new CreateCustomerUseCase(
      customerRepository,
      eventDispatcher
    );

    const testInput = {
      ...input,
      address: { ...input.address, street: "" },
    };

    await expect(customerCreateUseCase.execute(testInput)).rejects.toThrow(
      "Street is required"
    );
  });

  it("should throw an error when number is missing", async () => {
    const customerRepository = MockRepository();
    const eventDispatcher = new EventDispatcher();
    const customerCreateUseCase = new CreateCustomerUseCase(
      customerRepository,
      eventDispatcher
    );

    const testInput = {
      ...input,
      address: { ...input.address, zip: "" },
    };

    await expect(customerCreateUseCase.execute(testInput)).rejects.toThrow(
      "Zip is required"
    );
  });

  it("should throw an error when street and zip is missing", async () => {
    const customerRepository = MockRepository();
    const eventDispatcher = new EventDispatcher();
    const customerCreateUseCase = new CreateCustomerUseCase(
      customerRepository,
      eventDispatcher
    );

    const testInput = {
      ...input,
      address: { ...input.address, street: "", zip: "" },
    };

    await expect(customerCreateUseCase.execute(testInput)).rejects.toThrow(
      "customer: Street is required,customer: Zip is required"
    );
  });
});
