import type { Product } from '../data/products'

export type ProductsQueryResult = {
  products: Product[]
}

export type CartLineItem = {
  product: Product
  quantity: number
}


