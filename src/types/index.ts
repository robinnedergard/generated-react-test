import type { Product } from '#src/data/products'

export type ProductsQueryResult = {
  products: Product[]
}

export type CartLineItem = {
  product: Product
  quantity: number
}
