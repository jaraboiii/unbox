/**
 * Domain Entity Example
 * Entities คือ business objects ที่มี identity
 * ไม่ควรมี dependencies กับ framework หรือ external libraries
 */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
