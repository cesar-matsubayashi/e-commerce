import CreateCustomerUseCase from "../../../usecase/customer/create/create.customer.usecase";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import SendLog1WhenCustomerIsCreatedHandler from "./handler/send-log1-when-customer-is-created.handler";
import SendLog2WhenCustomerIsCreatedHandler from "./handler/send-log2-when-customer-is-created.handler";

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Customer created events tests", () => {
  it("should notify all event handlers", async () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new SendLog1WhenCustomerIsCreatedHandler();
    const eventHandler2 = new SendLog2WhenCustomerIsCreatedHandler();
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);

    const customerRepository = MockRepository();
    const createCustomerUseCase = new CreateCustomerUseCase(
      customerRepository,
      eventDispatcher
    );

    await createCustomerUseCase.execute({
      name: "John",
      address: {
        street: "Street",
        number: 123,
        zip: "Zip",
        city: "City",
      },
    });

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });
});
