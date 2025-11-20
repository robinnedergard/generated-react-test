export type Product = {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  badge?: string
  featured?: boolean
  rating: number
  colors: string[]
}

const products: Product[] = [
  {
    id: 'aurora-vase',
    name: 'Aurora Porcelain Vase',
    category: 'Decor',
    price: 120,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    description: 'Hand-thrown porcelain with a matte glaze inspired by slow dawns and fresh blooms.',
    badge: 'New Arrival',
    featured: true,
    rating: 4.8,
    colors: ['Cloud White', 'Soft Blush'],
  },
  {
    id: 'linen-set',
    name: 'Coastal Linen Sheet Set',
    category: 'Bedroom',
    price: 240,
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
    description: 'Stone-washed European flax linen that grows softer with every night.',
    badge: 'Bestseller',
    featured: true,
    rating: 4.9,
    colors: ['Mist', 'Sage', 'Sand'],
  },
  {
    id: 'atelier-mug',
    name: 'Atelier Ceramic Mug Set',
    category: 'Kitchen',
    price: 64,
    image: 'https://images.unsplash.com/photo-1488998527040-85054a85150e?auto=format&fit=crop&w=900&q=80',
    description: 'Set of four wheel-thrown mugs with raw stoneware base and satin glaze.',
    rating: 4.7,
    colors: ['Charcoal', 'Oat'],
  },
  {
    id: 'soho-chair',
    name: 'Soho Lounge Chair',
    category: 'Furniture',
    price: 890,
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80',
    description: 'Low-profile lounge chair upholstered in recycled bouclé with walnut legs.',
    badge: 'Limited',
    featured: true,
    rating: 4.6,
    colors: ['Ivory', 'Ink'],
  },
  {
    id: 'balance-lamp',
    name: 'Balance Arc Lamp',
    category: 'Lighting',
    price: 310,
    image: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=900&q=80',
    description: 'Sculptural floor lamp with adjustable arc and warm-diffused LED glow.',
    rating: 4.5,
    colors: ['Matte Black', 'Brass'],
  },
  {
    id: 'atelier-rug',
    name: 'Atlas Wool Rug',
    category: 'Living Room',
    price: 620,
    image: 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=900&q=80',
    description: 'Hand-loomed Moroccan inspired rug in a low-contrast geometric pattern.',
    rating: 4.8,
    colors: ['Natural', 'Noir'],
  },
  {
    id: 'glassware-set',
    name: 'Gradient Glassware Duo',
    category: 'Kitchen',
    price: 78,
    image: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&w=900&q=80',
    description: 'Heat-resistant borosilicate glasses with a subtle ombré finish.',
    badge: 'Editors’ pick',
    rating: 4.4,
    colors: ['Amber Fade', 'Rose Fade'],
  },
  {
    id: 'planter-set',
    name: 'Elevate Planter Trio',
    category: 'Outdoor',
    price: 185,
    image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=900&q=80',
    description: 'Powder-coated steel planters with hidden drainage for effortless greenery.',
    rating: 4.6,
    colors: ['Eucalyptus', 'Clay'],
  },
]

export default products

