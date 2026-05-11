import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    product: defineCollection({
      type: 'page',
      source: 'product/*.md',
      schema: z.object({
        url: z.string(),
        collection: z.string(),
        variants: z.array(z.object({
          title: z.string(),
          price: z.string(),
          payment_link: z.string().optional(),
          color: z.string().optional(),
          images: z.array(z.object({
            image: z.string()
          })).optional()
        }))
      })
    }),
    collection: defineCollection({
      type: 'page',
      source: 'collection/*.md',
      schema: z.object({
        url: z.string(),
        cover_image: z.string().optional(),
        images: z.array(z.object({
          image: z.string()
        })).optional()
      })
    }),
    content: defineCollection({
      type: 'page',
      source: '*.md',
      exclude: ['product/*.md'],
    }),
  }
})
