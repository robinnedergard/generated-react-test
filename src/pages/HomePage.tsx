import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { GET_PRODUCTS } from '#src/graphql/queries'
import { currency, perks } from '#src/utils/constants'
import type { Product } from '#src/data/products'
import type { ProductsQueryResult } from '#src/types'

export function HomePage() {
  const { loading, data } = useQuery<ProductsQueryResult>(GET_PRODUCTS)
  const products = data?.products || []

  const categorySummaries = Object.entries(
    products.reduce<Record<string, number>>((acc, product: Product) => {
      acc[product.category] = (acc[product.category] ?? 0) + 1
      return acc
    }, {}),
  )
    .map(([category, count]) => ({ category, count: count as number }))
    .sort((a, b) => b.count - a.count)

  const heroProduct = products[0]
  const editorialHighlight = products.find((product) => product.badge === 'Limited') ?? heroProduct

  if (loading || !heroProduct) {
    return <div>Loading...</div>
  }

  return (
    <>
      <header className="bg-gradient-to-br from-white/80 to-white/10 rounded-3xl grid grid-cols-1 lg:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] overflow-hidden shadow-2xl shadow-slate-900/10">
        <div className="p-8 lg:p-16 flex flex-col gap-6">
          <p className="text-xs tracking-widest uppercase text-slate-400">New season edit</p>
          <h1 className="m-0">Meet the modern home shop</h1>
          <p className="text-lg text-slate-600 max-w-[32ch] m-0">
            Curated furniture, lighting, and objects crafted in small batches and ready to ship.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 no-underline"
            >
              Shop the collection
            </Link>
            <button
              type="button"
              className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-transparent border border-slate-200 text-slate-900 hover:-translate-y-0.5"
              onClick={() =>
                document.querySelector('#editorial')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Studio story
            </button>
          </div>
          <div className="flex gap-4 font-semibold">
            <span>{currency.format(heroProduct.price)}</span>
            <span>{heroProduct.name}</span>
          </div>
        </div>
        <div className="overflow-hidden">
          <img
            src={heroProduct.image}
            alt={heroProduct.name}
            loading="lazy"
            className="w-full h-full object-cover min-h-80 saturate-105"
          />
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-5">
        {perks.map((perk) => (
          <article
            key={perk.title}
            className="bg-white p-6 rounded-3xl border border-slate-200 min-h-[150px]"
          >
            <h3 className="mb-1.5 m-0">{perk.title}</h3>
            <p className="m-0">{perk.detail}</p>
          </article>
        ))}
      </section>

      <section className="bg-white rounded-3xl p-8 lg:p-14 flex flex-col gap-8 border border-slate-200">
        <div className="max-w-[520px]">
          <p className="text-xs tracking-widest uppercase text-slate-400">Shop by room</p>
          <h2 className="m-0">Spaces with intention</h2>
          <p className="m-0">
            Refresh a single corner or rethink your whole home with designer-backed palettes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
          {categorySummaries.map((category) => (
            <article
              key={category.category}
              className="bg-slate-50 rounded-3xl p-5 min-h-[130px] flex flex-col justify-between"
            >
              <h3 className="m-0">{category.category}</h3>
              <p className="m-0">{category.count} curated pieces</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="grid grid-cols-1 lg:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-8 items-center bg-white rounded-3xl p-8 lg:p-14 border border-slate-200"
        id="editorial"
      >
        <div className="overflow-hidden">
          <img
            src={editorialHighlight.image}
            alt={editorialHighlight.name}
            loading="lazy"
            className="w-full rounded-3xl object-cover min-h-80"
          />
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase text-slate-400">From the studio</p>
          <h2 className="m-0">Layered neutrals, elevated silhouettes</h2>
          <p className="m-0">
            We partner with small-batch workshops to produce timeless staples. Every stitch, weave,
            and finishing touch is considered so you can style once and enjoy for years.
          </p>
          <ul className="pl-5 text-slate-600 leading-relaxed list-disc">
            <li>Responsibly sourced materials and certified woods</li>
            <li>Color stories developed with interior stylists</li>
            <li>Transparent pricing and limited runs per season</li>
          </ul>
          <button
            type="button"
            className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 mt-4"
          >
            Book a design consult
          </button>
        </div>
      </section>
    </>
  )
}
