export type Category = 'bebida' | 'comida' | 'lectura';
export interface Product{
  id: number;
  name: string;
  price: number;
  is_active: boolean;
  description: string | null;
  img_url?: string | null;
  category: Category;
  created_at: string;
}

export type ProductInsert = Omit<Product, 'id' | 'created_at' >;
export type ProductUpdate = Partial<ProductInsert>;

export type GallerySpan = 'tall' | 'wide' | '';
export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  span: GallerySpan;
  created_at: string;
}
export type GalleryImageInsert = Omit<GalleryImage, 'id' | 'created_at'>;