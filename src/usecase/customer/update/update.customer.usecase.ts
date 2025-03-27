import EventDispatcher from "../../../domain/@shared/event/event-dispatcher";
import AddressChangedEvent from "../../../domain/customer/event/address-changed.event";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import Address from "../../../domain/customer/value-object/address";
import {
  InputUpdateCustomerDto,
  OutputUpdateCustomerDto,
} from "./update.customer.dto";

export default class UpdateCustomerUseCase {
  private customerRepository: CustomerRepositoryInterface;
  private eventDispatcher: EventDispatcher;

  constructor(
    customerRepository: CustomerRepositoryInterface,
    eventDispatcher: EventDispatcher
  ) {
    this.customerRepository = customerRepository;
    this.eventDispatcher = eventDispatcher;
  }

  async execute(
    input: InputUpdateCustomerDto
  ): Promise<OutputUpdateCustomerDto> {
    const customer = await this.customerRepository.find(input.id);

    customer.changeName(input.name);

    const shoudChangeAddress = customer.Address.equals(input.address);
    if (!shoudChangeAddress) {
      customer.changeAddress(
        new Address(
          input.address.street,
          input.address.number,
          input.address.zip,
          input.address.city
        )
      );
    }

    await this.customerRepository.update(customer);

    if (!shoudChangeAddress) {
      const addressChangedEvent = new AddressChangedEvent({
        id: customer.id,
        name: customer.name,
        address: customer.Address,
      });

      this.eventDispatcher.notify(addressChangedEvent);
    }

    return {
      id: customer.id,
      name: customer.name,
      address: {
        street: customer.Address.street,
        number: customer.Address.number,
        zip: customer.Address.zip,
        city: customer.Address.city,
      },
      rewardPoints: customer.rewardPoints,
    };
  }
}
