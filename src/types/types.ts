export type Category = 'bebida' | 'comida' | 'lectura';
export interface Product{
  id: number;
  name: string;
  price: number;
  isActive: boolean;
  description: string | null;
  img_url?: string | null;
  category: Category;
  created_at: string;
}

export type ProductInsert = Omit<Product, 'id' | 'created_at' >;
export type ProductUpdate = Partial<ProductInsert>;