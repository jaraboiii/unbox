/**
 * Mock Product Repository Implementation
 * ในโปรเจคจริง คุณจะต่อกับ API, Database, หรือ external services
 */

import { Product } from "../../core/domain/entities";
import { IProductRepository } from "../../core/domain/repositories";

export class MockProductRepository implements IProductRepository {
  private products: Product[] = [
    {
      id: "1",
      name: "สินค้าตัวอย่าง 1",
      description: "รายละเอียดสินค้า 1",
      price: 999,
      category: "Electronics",
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "สินค้าตัวอย่าง 2",
      description: "รายละเอียดสินค้า 2",
      price: 1499,
      category: "Fashion",
      stock: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async findById(id: string): Promise<Product | null> {
    const product = this.products.find(p => p.id === id);
    return product || null;
  }

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.products.filter(p => p.category === category);
  }

  async create(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: String(this.products.length + 1),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    this.products[index] = {
      ...this.products[index],
      ...productData,
      updatedAt: new Date(),
    };
    
    return this.products[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    this.products.splice(index, 1);
  }
}
