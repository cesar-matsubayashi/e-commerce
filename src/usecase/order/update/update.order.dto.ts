export interface InputUpdateOrderDto {
  id: string;
  customerId: string;
  items: {
    id: string;
    name: string;
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export interface OutputUpdateOrderDto {
  id: string;
  customerId: string;
  items: {
    id: string;
    name: string;
    productId: string;
    quantity: number;
    price: number;
  }[];
}
