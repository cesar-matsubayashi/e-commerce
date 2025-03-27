import Entity from "../../@shared/entity/entity.abstract";
import NotificationError from "../../@shared/notification/notification.error";
import AddressValidatorFactory from "./address.validator.factory";

export default class Address extends Entity {
  _street: string = "";
  _number: number = 0;
  _zip: string = "";
  _city: string = "";

  constructor(street: string, number: number, zip: string, city: string) {
    super();
    this._street = street;
    this._number = number;
    this._zip = zip;
    this._city = city;

    this.validate();

    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors());
    }
  }

  get street(): string {
    return this._street;
  }

  get number(): number {
    return this._number;
  }

  get zip(): string {
    return this._zip;
  }

  get city(): string {
    return this._city;
  }

  validate() {
    AddressValidatorFactory.create().validate(this);
  }

  toString() {
    return `${this._street}, ${this._number}, ${this._zip} ${this._city}`;
  }

  equals(address: {
    street: string;
    number: number;
    zip: string;
    city: string;
  }): boolean {
    return (
      this._street === address.street &&
      this._number === address.number &&
      this._zip === address.zip &&
      this._city === address.city
    );
  }
}
