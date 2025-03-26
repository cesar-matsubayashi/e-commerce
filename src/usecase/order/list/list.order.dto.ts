export interface InputListOrderDto {}

type Order = {
  id: string;
  customerId: string;
  items: {
    id: string;
    name: string;
    productId: string;
    quantity: number;
    price: number;
    total: number;
  }[];
};

export interface OutputListOrderDto {
  orders: Order[];
}
