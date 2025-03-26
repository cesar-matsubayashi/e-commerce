import express, { Request, Response } from "express";
import CreateOrderUseCase from "../../../usecase/order/create/create.order.usecase";
import OrderRepository from "../../order/repository/sequilize/order.repository";
import CustomerRepository from "../../customer/repository/sequelize/customer.repository";
import ListOrderUseCase from "../../../usecase/order/list/list.order.usecase";
import OrderPresenter from "../presenters/order.presenter";
import FindOrderUseCase from "../../../usecase/order/find/find.order.usecase";
import UpdateOrderUseCase from "../../../usecase/order/update/update.order.usecase";

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

orderRoute.get("/", async (req: Request, res: Response) => {
  const usecase = new ListOrderUseCase(new OrderRepository());

  try {
    const output = await usecase.execute({});
    res.format({
      json: async () => res.send(output),
      xml: async () => res.send(OrderPresenter.listXML(output)),
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

orderRoute.get("/:id", async (req: Request, res: Response) => {
  const usecase = new FindOrderUseCase(new OrderRepository());

  try {
    const output = await usecase.execute({ id: req.params.id });
    res.format({
      json: async () => res.send(output),
      xml: async () => res.send(OrderPresenter.toXML(output)),
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

orderRoute.put("/:id", async (req: Request, res: Response) => {
  const usecase = new UpdateOrderUseCase(new OrderRepository());

  try {
    const orderDto = {
      id: req.params.id,
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
    res.format({
      json: async () => res.send(output),
      xml: async () => res.send(OrderPresenter.toXML(output)),
    });
  } catch (err) {
    res.status(500).send(err);
  }
});
