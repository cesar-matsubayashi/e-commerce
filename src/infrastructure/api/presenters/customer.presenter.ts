import { toXML } from "jstoxml";
import { OutputListCustomerDto } from "../../../usecase/customer/list/list.customer.dto";
import { OutputFindCustomerDto } from "../../../usecase/customer/find/find.customer.dto";

export default class CustomerPresenter {
  static toXML(data: OutputFindCustomerDto): string {
    const xmlOption = {
      header: true,
      indent: " ",
      newLine: "\n",
      allowEmpty: true,
    };

    return toXML(
      {
        customer: {
          id: data.id,
          name: data.name,
          address: {
            street: data.address.street,
            number: data.address.number,
            zip: data.address.zip,
            city: data.address.city,
          },
        },
      },
      xmlOption
    );
  }

  static listXML(data: OutputListCustomerDto): string {
    const xmlOption = {
      header: true,
      indent: " ",
      newLine: "\n",
      allowEmpty: true,
    };

    return toXML(
      {
        customers: {
          customer: data.customers.map((customer) => ({
            id: customer.id,
            name: customer.name,
            address: {
              street: customer.address.street,
              number: customer.address.number,
              zip: customer.address.zip,
              city: customer.address.city,
            },
          })),
        },
      },
      xmlOption
    );
  }
}
