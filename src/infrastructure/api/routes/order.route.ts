import express, { Request, Response } from "express";
import CreateOrderUseCase from "../../../usecase/order/create/create.order.usecase";
import OrderRepository from "../../order/repository/sequilize/order.repository";
import CustomerRepository from "../../customer/repository/sequelize/customer.repository";

export const orderRoute = express.Router();

orderRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new CreateOrderUseCase(
    new OrderRepository(),
    new CustomerRepository()
  );

  try {
    const orderDto = {
      customerId: req.body.customerId,
      items: req.body.items.map(
        (item: {
          id: string;
          name: string;
          productId: string;
          quantity: number;
          price: number;
        }) => ({
          id: item.id,
          name: item.name,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })
      ),
    };

    const output = await usecase.execute(orderDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
