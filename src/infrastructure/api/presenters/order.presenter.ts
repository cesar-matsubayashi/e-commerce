import { toXML } from "jstoxml";
import { OutputListOrderDto } from "../../../usecase/order/list/list.order.dto";
import { OutputFindOrderDto } from "../../../usecase/order/find/find.order.dto";

export default class OrderPresenter {
  static toXML(data: OutputFindOrderDto): string {
    const xmlOption = {
      header: true,
      indent: " ",
      newLine: "\n",
      allowEmpty: true,
    };

    return toXML(
      {
        order: {
          id: data.id,
          customerId: data.customerId,
          items: data.items.map((item) => ({
            item: {
              id: item.id,
              name: item.name,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            },
          })),
        },
      },
      xmlOption
    );
  }

  static listXML(data: OutputListOrderDto): string {
    const xmlOption = {
      header: true,
      indent: " ",
      newLine: "\n",
      allowEmpty: true,
    };

    return toXML(
      {
        orders: {
          order: data.orders.map((order) => ({
            id: order.id,
            customerId: order.customerId,
            items: order.items.map((item) => ({
              item: {
                id: item.id,
                name: item.name,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              },
            })),
          })),
        },
      },
      xmlOption
    );
  }
}
