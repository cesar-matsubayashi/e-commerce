import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import CreateProductUseCase from "./create.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

const input = {
  type: "a",
  name: "Product",
  price: 10,
};

const inputB = {
  type: "b",
  name: "Product B",
  price: 10,
};

describe("Unit test create product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const output = await createProductUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it("should create a product B", async () => {
    const productRepository = new ProductRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const output = await createProductUseCase.execute(inputB);

    expect(output).toEqual({
      id: expect.any(String),
      name: inputB.name,
      price: inputB.price * 2,
    });
  });

  it("should throw an error when type is not supported", async () => {
    const productRepository = new ProductRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const testInput = { ...input, type: "c" };

    await expect(createProductUseCase.execute(testInput)).rejects.toThrow(
      "Product type not supported"
    );
  });

  it("should throw an error when name is missing", async () => {
    const productRepository = new ProductRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const testInput = { ...input, name: "" };

    await expect(createProductUseCase.execute(testInput)).rejects.toThrow(
      "Name is required"
    );
  });

  it("should throw an error when price less than zero", async () => {
    const productRepository = new ProductRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const testInput = { ...input, price: -1 };

    await expect(createProductUseCase.execute(testInput)).rejects.toThrow(
      "Price must be greater than zero"
    );
  });
});
