import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import UpdateCustomerUseCase from "./update.customer.usecase";

const createCustomer = () =>
  CustomerFactory.createWithAddress(
    "John",
    new Address("Street", 123, "Zip", "City")
  );

const input = {
  id: "",
  name: "John Updated",
  address: {
    street: "Street Updated",
    number: 1234,
    zip: "Zip Updated",
    city: "City Updated",
  },
};

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test for customer update use case", () => {
  it("should update a customer", async () => {
    const customer = createCustomer();
    const customerRepository = MockRepository();
    customerRepository.find.mockReturnValue(Promise.resolve(customer));
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);

    input.id = customer.id;
    const testInput = { ...input, rewardPoints: "" };

    const output = await customerUpdateUseCase.execute(input);

    expect(output).toEqual(testInput);
  });

  it("should throw an error when name is missing", async () => {
    const customer = createCustomer();
    const customerRepository = MockRepository();
    customerRepository.find.mockReturnValue(Promise.resolve(customer));
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);

    input.id = customer.id;
    const testInput = { ...input, name: "" };

    await expect(customerUpdateUseCase.execute(testInput)).rejects.toThrow(
      "Name is required"
    );
  });

  it("should throw an error when street is missing", async () => {
    const customer = createCustomer();
    const customerRepository = MockRepository();
    customerRepository.find.mockReturnValue(Promise.resolve(customer));
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);

    input.id = customer.id;

    const testInput = {
      ...input,
      address: { ...input.address, street: "" },
    };

    await expect(customerUpdateUseCase.execute(testInput)).rejects.toThrow(
      "Street is required"
    );
  });

  it("should throw an error when zip is missing", async () => {
    const customer = createCustomer();
    const customerRepository = MockRepository();
    customerRepository.find.mockReturnValue(Promise.resolve(customer));
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);

    input.id = customer.id;

    const testInput = {
      ...input,
      address: { ...input.address, zip: "" },
    };

    await expect(customerUpdateUseCase.execute(testInput)).rejects.toThrow(
      "Zip is required"
    );
  });

  it("should throw an error when city is missing", async () => {
    const customer = createCustomer();
    const customerRepository = MockRepository();
    customerRepository.find.mockReturnValue(Promise.resolve(customer));
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);

    input.id = customer.id;

    const testInput = {
      ...input,
      address: { ...input.address, city: "" },
    };

    await expect(customerUpdateUseCase.execute(testInput)).rejects.toThrow(
      "City is required"
    );
  });

  it("should throw an error when zip and city is missing", async () => {
    const customer = createCustomer();
    const customerRepository = MockRepository();
    customerRepository.find.mockReturnValue(Promise.resolve(customer));
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);

    input.id = customer.id;

    const testInput = {
      ...input,
      address: { ...input.address, zip: "", city: "" },
    };

    await expect(customerUpdateUseCase.execute(testInput)).rejects.toThrow(
      "customer: Zip is required,customer: City is required"
    );
  });
});
