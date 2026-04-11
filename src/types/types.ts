export interface Product{
  id: number;
  name: string;
  price: number;
  isActive: boolean;
  description: string | null;
  img_url?: string | null;
  feature_order: number;
}

export type ProductInsert = Omit<Product, 'id'>;
export type ProductUpdate = Partial<ProductInsert>;