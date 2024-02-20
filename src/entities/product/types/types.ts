export type ProductCategory = 'Keyboards' | 'Mouses' | 'Mouse pads' | 'Keycaps';
export type Products =
  | {
      description: string;
      id: number;
      name: string;
      price: string;
      quantity: number;
      categoryId: number;
    }[]
  | [];
export interface NavData {
  products: Products;
}
