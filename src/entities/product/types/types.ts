export type ProductCategory = 'Keyboards' | 'Mouses' | 'Mouse pads' | 'Keycaps';
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  quantity: number;
  categoryId: number;
}

export interface GetAllProductsParams {
  limit?: number;
}

export type Products = Record<ProductCategory, Product[]>;
