import { MetadataRoute } from 'next'

export const revalidate = 3600 // regenerate at most once per hour

const SITE_URL = 'https://theliftingsocial.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

type SitemapEntry = MetadataRoute.Sitemap[number]

const staticRoutes: { path: string; changeFrequency: SitemapEntry['changeFrequency']; priority: number }[] = [
  { path: '', changeFrequency: 'weekly', priority: 1.0 },

  // Shop hubs
  { path: '/shop', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/shop/apparel', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/shop/accessories', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/shop/supplements', changeFrequency: 'weekly', priority: 0.8 },

  // Shop subcategories - accessories
  { path: '/shop/accessories/belts', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/shop/accessories/bags', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/shop/accessories/grips', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/shop/accessories/knee-sleeves', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/shop/accessories/shakers-bottles', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/shop/accessories/straps', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/shop/accessories/wraps', changeFrequency: 'monthly', priority: 0.7 },

  // Shop subcategories - supplements
  { path: '/shop/supplements/protein', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/shop/supplements/creatine', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/shop/supplements/pre-workout', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/shop/supplements/energy', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/shop/supplements/recovery', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/shop/supplements/vitamins', changeFrequency: 'monthly', priority: 0.7 },

  // Events & Live
  { path: '/events', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/live', changeFrequency: 'daily', priority: 0.8 },

  // Sports media
  { path: '/sports-media', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/sports-media/live-events', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/sports-media/photography', changeFrequency: 'weekly', priority: 0.7 },

  // Coaching
  { path: '/coaching', changeFrequency: 'monthly', priority: 0.7 },

  // Brand pages
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },

  // Policy pages
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/refund-policy', changeFrequency: 'yearly', priority: 0.3 },
]

async function safeFetch<T = any>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      console.warn(`[sitemap] ${path} returned ${res.status}`)
      return []
    }
    const data = await res.json()
    if (Array.isArray(data)) return data as T[]
    if (Array.isArray((data as any)?.data)) return (data as any).data as T[]
    if (Array.isArray((data as any)?.results)) return (data as any).results as T[]
    return []
  } catch (err) {
    console.warn(`[sitemap] failed to fetch ${path}:`, err)
    return []
  }
}

function pickDate(value: unknown): Date {
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) return d
  }
  return new Date()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  // Fetch dynamic data in parallel; never let one failure tank the sitemap
  const [products, events, coaches] = await Promise.all([
    safeFetch<any>('/products'),
    safeFetch<any>('/events'),
    safeFetch<any>('/coaches'),
  ])

  const productEntries: MetadataRoute.Sitemap = products
    .map((p) => {
      const id = p?._id ?? p?.id
      if (!id) return null
      return {
        url: `${SITE_URL}/shop/product/${id}`,
        lastModified: pickDate(p?.updated_at ?? p?.updatedAt ?? p?.created_at ?? p?.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }
    })
    .filter((e): e is SitemapEntry => e !== null)

  const eventEntries: MetadataRoute.Sitemap = events.flatMap((e) => {
    const slug = e?.slug
    if (!slug) return []
    const lastModified = pickDate(e?.updated_at ?? e?.updatedAt ?? e?.start_date ?? e?.startDate)
    const detail: SitemapEntry = {
      url: `${SITE_URL}/events/${slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    }
    const live: SitemapEntry = {
      url: `${SITE_URL}/events/${slug}/live`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.5,
    }
    return [detail, live]
  })

  const coachEntries: MetadataRoute.Sitemap = coaches
    .map((c) => {
      const handle = c?.slug ?? c?._id ?? c?.id
      if (!handle) return null
      return {
        url: `${SITE_URL}/coaching/${handle}`,
        lastModified: pickDate(c?.updated_at ?? c?.updatedAt ?? c?.created_at ?? c?.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }
    })
    .filter((e): e is SitemapEntry => e !== null)

  return [...staticEntries, ...productEntries, ...eventEntries, ...coachEntries]
}
