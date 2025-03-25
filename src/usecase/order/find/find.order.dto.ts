export interface InputFindOrderDto {
  id: string;
}

export interface OutputFindOrderDto {
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
