import { toXML } from "jstoxml";
import { OutputFindProductDto } from "../../../usecase/product/find/find.product.dto";
import { OutputListProductDto } from "../../../usecase/product/list/list.product.dto";

export default class ProductPresenter {
  static toXML(data: OutputFindProductDto): string {
    const xmlOption = {
      header: true,
      indent: " ",
      newLine: "\n",
      allowEmpty: true,
    };

    return toXML(
      {
        product: { id: data.id, name: data.name, price: data.price },
      },
      xmlOption
    );
  }

  static listXML(data: OutputListProductDto): string {
    const xmlOption = {
      header: true,
      indent: " ",
      newLine: "\n",
      allowEmpty: true,
    };

    return toXML(
      {
        products: {
          product: data.products.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
          })),
        },
      },
      xmlOption
    );
  }
}
