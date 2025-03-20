import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

const createProduct = () => ProductFactory.create("a", "Product A", 10);

const input = {
  id: "",
  name: "Product A Updated",
  price: 20,
};

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test for product update use case", () => {
  it("should update a product", async () => {
    const product = createProduct();
    const productRepository = MockRepository();
    productRepository.find.mockReturnValue(Promise.resolve(product));
    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    input.id = product.id;

    const output = await updateProductUseCase.execute(input);

    expect(output).toEqual(input);
  });

  it("should throw an error when name is missing", async () => {
    const product = createProduct();
    const productRepository = MockRepository();
    productRepository.find.mockReturnValue(Promise.resolve(product));
    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    input.id = product.id;
    const testInput = { ...input, name: "" };

    await expect(updateProductUseCase.execute(testInput)).rejects.toThrow(
      "Name is required"
    );
  });

  it("should throw an error when price less than zero", async () => {
    const product = createProduct();
    const productRepository = MockRepository();
    productRepository.find.mockReturnValue(Promise.resolve(product));
    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    input.id = product.id;
    const testInput = { ...input, price: -1 };

    await expect(updateProductUseCase.execute(testInput)).rejects.toThrow(
      "Price must be greater than zero"
    );
  });

  it("should throw an error when name is missing and price less than zero", async () => {
    const product = createProduct();
    const productRepository = MockRepository();
    productRepository.find.mockReturnValue(Promise.resolve(product));
    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    input.id = product.id;
    const testInput = { ...input, name: "", price: -1 };

    await expect(updateProductUseCase.execute(testInput)).rejects.toThrow(
      "product: Name is required,product: Price must be greater than zero"
    );
  });
});
