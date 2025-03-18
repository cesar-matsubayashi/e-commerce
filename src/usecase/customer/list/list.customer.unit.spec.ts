import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import ListCustomerUseCase from "./list.customer.usecase";

const customer1 = CustomerFactory.createWithAddress(
  "John Doe",
  new Address("Street 1", 1, "12345", "City")
);

const customer2 = CustomerFactory.createWithAddress(
  "Jane Doe",
  new Address("Street 2", 2, "123456", "City 2")
);

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2])),
    find: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test for listing customer use case", () => {
  it("should list customers", async () => {
    const repository = MockRepository();
    const useCase = new ListCustomerUseCase(repository);

    const output = await useCase.execute({});

    expect(output.customers.length).toBe(2);
    expect(output.customers[0].id).toBe(customer1.id);
    expect(output.customers[0].name).toBe(customer1.name);
    expect(output.customers[0].address).toEqual({
      street: customer1.Address.street,
      number: customer1.Address.number,
      zip: customer1.Address.zip,
      city: customer1.Address.city,
    });

    expect(output.customers[1].id).toBe(customer2.id);
    expect(output.customers[1].name).toBe(customer2.name);
    expect(output.customers[1].address).toEqual({
      street: customer2.Address.street,
      number: customer2.Address.number,
      zip: customer2.Address.zip,
      city: customer2.Address.city,
    });
  });
});
