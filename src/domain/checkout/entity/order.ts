import Entity from "../../@shared/entity/entity.abstract";
import NotificationError from "../../@shared/notification/notification.error";
import OrderValidatorFactory from "../factory/order.validator.factory";
import OrderItem from "./order_item";

export default class Order extends Entity {
  private _customerId: string;
  private _items: OrderItem[];
  private _total: number;

  constructor(id: string, customerId: string, items: OrderItem[]) {
    super();
    this._id = id;
    this._customerId = customerId;
    this._items = items;
    this._total = this.total();
    this.validate();

    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors());
    }
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  changeCustomerId(customerId: string) {
    this._customerId = customerId;
  }

  changeItems(orderItems: OrderItem[]) {
    this._items = this._items.map(
      (item) => orderItems.find((orderItem) => orderItem.id === item.id) || item
    );
  }

  validate() {
    OrderValidatorFactory.create().validate(this);
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.total(), 0);
  }
}
