export type Sizes = 's' | 'm' | 'l' | 'xl' | 'xxl';
export type SizeDrink = '200 ml' | '300 ml' | '400 ml';
export type SizeCakes = '50 g' | '100 g' | '200 g';

export interface SizeItem {
  size: SizeDrink | SizeCakes;
  price: string;
  discountPrice?: string;
}

export interface Additives {
  name: string;
  price: string;
  discountPrice?: string;
}

export type Category = 'coffee' | 'tea' | 'dessert';

export interface ProductItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  discountPrice?: string;
  sizes: Record<Sizes, SizeItem>;
  additives: Additives[];
}

export interface CartProductItem {
  id: number;
  product: ProductItem;
  selectedSize: Sizes;
  selectedAdditives: string[];
  commonPrice: string;
  discountPrice: string;
}

export interface DefaultModalValues {
  currentSize: string;
  selectedAdditives: string[];
  basePrice: number;
  isAuthorized: boolean;
}

export interface ErrorProduct {
  error: string;
  isTestError: boolean;
  timestamp: string;
}

export interface ConfirmProductItem {
  productId: number;
  size: Sizes;
  additives: string[];
  quantity: number;
}

export interface ConfirmItems {
  items: ConfirmProductItem[];
  totalPrice: number;
}
