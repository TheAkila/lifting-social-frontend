import ShopHeader from '@/components/shop/ShopHeader'
import ProductGrid from '@/components/shop/ProductGrid'
import ShopFilters from '@/components/shop/ShopFilters'

export default function ShopPage() {
  return (
    <div className="min-h-screen pt-20">
      <ShopHeader />
      <div className="container-custom section-padding">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <ShopFilters />
          </aside>
          
          {/* Product Grid */}
          <main className="flex-1">
            <ProductGrid />
          </main>
        </div>
      </div>
    </div>
  )
}
