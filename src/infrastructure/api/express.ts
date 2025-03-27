import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../customer/repository/sequelize/customer.model";
import { customerRoute } from "./routes/customer.route";
import ProductModel from "../product/repository/sequelize/product.model";
import { productRoute } from "./routes/product.route";
import { orderRoute } from "./routes/order.route";
import OrderModel from "../order/repository/sequilize/order.model";
import OrderItemModel from "../order/repository/sequilize/order-item.model";

export const app: Express = express();
app.use(express.json());

app.use("/customers", customerRoute);
app.use("/products", productRoute);
app.use("/orders", orderRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  await sequelize.addModels([
    CustomerModel,
    ProductModel,
    OrderModel,
    OrderItemModel,
  ]);
  await sequelize.sync();
}
setupDb();
