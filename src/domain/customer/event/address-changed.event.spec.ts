import UpdateCustomerUseCase from "../../../usecase/customer/update/update.customer.usecase";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerFactory from "../factory/customer.factory";
import Address from "../value-object/address";
import SendLogWhenAddressIsChangedHandler from "./handler/send-log-when-addredd-is-changed.handler";

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };
};

describe("Customer address changed events tests", () => {
  it("should notify all event handlers", async () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendLogWhenAddressIsChangedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("AddressChangedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"][0]
    ).toMatchObject(eventHandler);

    const customer = CustomerFactory.createWithAddress(
      "John",
      new Address("Street", 123, "Zip", "City")
    );
    const customerRepository = MockRepository();
    customerRepository.find.mockReturnValue(Promise.resolve(customer));
    const updateCustomerUseCase = new UpdateCustomerUseCase(
      customerRepository,
      eventDispatcher
    );

    await updateCustomerUseCase.execute({
      id: customer.id,
      name: "John",
      address: {
        street: "Street Updated",
        number: 1234,
        zip: "Zip Updated",
        city: "City Updated",
      },
    });

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should not notify event handlers if address doesn't change", async () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendLogWhenAddressIsChangedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("AddressChangedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"][0]
    ).toMatchObject(eventHandler);

    const customer = CustomerFactory.createWithAddress(
      "John",
      new Address("Street", 123, "Zip", "City")
    );
    const customerRepository = MockRepository();
    customerRepository.find.mockReturnValue(Promise.resolve(customer));
    const updateCustomerUseCase = new UpdateCustomerUseCase(
      customerRepository,
      eventDispatcher
    );

    await updateCustomerUseCase.execute({
      id: customer.id,
      name: "John Updated",
      address: {
        street: "Street",
        number: 123,
        zip: "Zip",
        city: "City",
      },
    });

    expect(spyEventHandler).toHaveBeenCalledTimes(0);
  });
});
