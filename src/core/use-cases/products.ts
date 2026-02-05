/**
 * Use Case Example: Get Product by ID
 * Use cases ประกอบด้วย application-specific business rules
 */

import { Product } from "../domain/entities";
import { IProductRepository } from "../domain/repositories";

export class GetProductByIdUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(productId: string): Promise<Product | null> {
    // Business logic: validate input
    if (!productId || productId.trim() === "") {
      throw new Error("Product ID is required");
    }

    // Get product from repository
    const product = await this.productRepository.findById(productId);

    if (!product) {
      return null;
    }

    // Additional business logic can be added here
    // For example: check if product is available, apply discounts, etc.

    return product;
  }
}

/**
 * Use Case Example: Get All Products
 */
export class GetAllProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    const products = await this.productRepository.findAll();

    // Additional business logic
    // For example: filter out-of-stock products, sort, etc.
    return products.filter(product => product.stock > 0);
  }
}
