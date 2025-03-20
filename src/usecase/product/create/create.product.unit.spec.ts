import CreateProductUseCase from "./create.product.usecase";

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

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test create product use case", () => {
  it("should create a product", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = await productCreateUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it("should create a product B", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = await productCreateUseCase.execute(inputB);

    expect(output).toEqual({
      id: expect.any(String),
      name: inputB.name,
      price: inputB.price * 2,
    });
  });

  it("should throw an error when type is not supported", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const testInput = { ...input, type: "c" };

    await expect(productCreateUseCase.execute(testInput)).rejects.toThrow(
      "Product type not supported"
    );
  });

  it("should throw an error when name is missing", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const testInput = { ...input, name: "" };

    await expect(productCreateUseCase.execute(testInput)).rejects.toThrow(
      "Name is required"
    );
  });

  it("should throw an error when price less than zero", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const testInput = { ...input, price: -1 };

    await expect(productCreateUseCase.execute(testInput)).rejects.toThrow(
      "Price must be greater than zero"
    );
  });

  it("should throw an error when name is missing and price is less than zero", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const testInput = { ...input, name: "", price: -1 };

    await expect(productCreateUseCase.execute(testInput)).rejects.toThrow(
      "product: Name is required,product: Price must be greater than zero"
    );
  });
});
