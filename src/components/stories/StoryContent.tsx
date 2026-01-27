'use client'

import { useEffect, useState } from 'react'
import parse, { domToReact, HTMLReactParserOptions, Element, DOMNode } from 'html-react-parser'
import DOMPurify from 'dompurify'

interface StoryContentProps {
  content: string
  excerpt?: string
  isExternal?: boolean
  originalUrl?: string
  sourceName?: string
}

export default function StoryContent({ content, excerpt, isExternal, originalUrl, sourceName }: StoryContentProps) {
  const [sanitizedContent, setSanitizedContent] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined' && content) {
      // Clean and sanitize HTML content
      let cleaned = content
      
      // Remove script tags
      cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove style tags
      cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      // Remove link tags (stylesheets)
      cleaned = cleaned.replace(/<link[^>]*>/gi, '')
      // Remove meta tags
      cleaned = cleaned.replace(/<meta[^>]*>/gi, '')
      // Remove comments
      cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '')
      // Remove data attributes
      cleaned = cleaned.replace(/\s*data-[a-z-]+="[^"]*"/gi, '')
      // Remove onclick and other event handlers
      cleaned = cleaned.replace(/\s*on\w+="[^"]*"/gi, '')
      
      // Remove product/affiliate links (See Product, Buy Now, Shop, etc.)
      cleaned = cleaned.replace(/<a[^>]*>[\s]*(See Product|Buy Now|Shop Now|View Product|Check Price|Get It Here|Order Now|Buy Here)[\s]*<\/a>/gi, '')
      // Remove links with affiliate/product patterns
      cleaned = cleaned.replace(/<a[^>]*(amazon|affiliate|product|shop|buy|store)[^>]*>[^<]*<\/a>/gi, '')
      // Remove empty links
      cleaned = cleaned.replace(/<a[^>]*>\s*<\/a>/gi, '')
      // Remove horizontal rules that separate product sections
      cleaned = cleaned.replace(/<hr[^>]*>/gi, '')
      // Remove empty paragraphs
      cleaned = cleaned.replace(/<p>\s*<\/p>/gi, '')
      // Remove empty divs
      cleaned = cleaned.replace(/<div>\s*<\/div>/gi, '')
      // Remove iframe embeds (ads, trackers)
      cleaned = cleaned.replace(/<iframe[^>]*>[^<]*<\/iframe>/gi, '')
      // Remove noscript tags
      cleaned = cleaned.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
      // Remove form elements
      cleaned = cleaned.replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '')
      cleaned = cleaned.replace(/<input[^>]*>/gi, '')
      cleaned = cleaned.replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '')
      // Remove nav elements
      cleaned = cleaned.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      // Remove footer elements
      cleaned = cleaned.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      // Remove sidebar/aside elements
      cleaned = cleaned.replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
      // Remove social share buttons patterns
      cleaned = cleaned.replace(/<[^>]*(share|social|facebook|twitter|pinterest|instagram)[^>]*>[\s\S]*?<\/[^>]*>/gi, '')
      
      // Sanitize with DOMPurify
      const purified = DOMPurify.sanitize(cleaned, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                       'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'pre', 'code', 'div', 'span',
                       'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
        ALLOW_DATA_ATTR: false,
      })
      
      setSanitizedContent(purified)
    }
  }, [content])

  // Parser options to style HTML elements
  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        const { name, children, attribs } = domNode
        const childNodes = children as DOMNode[]

        // Style headings
        if (name === 'h1') {
          return <h1 className="font-display text-4xl font-bold mb-6 mt-10 text-black">{domToReact(childNodes, parserOptions)}</h1>
        }
        if (name === 'h2') {
          return <h2 className="font-display text-3xl font-bold mb-4 mt-10 text-black">{domToReact(childNodes, parserOptions)}</h2>
        }
        if (name === 'h3') {
          return <h3 className="font-display text-2xl font-bold mb-3 mt-8 text-black">{domToReact(childNodes, parserOptions)}</h3>
        }
        if (name === 'h4') {
          return <h4 className="font-display text-xl font-bold mb-3 mt-6 text-black">{domToReact(childNodes, parserOptions)}</h4>
        }

        // Style paragraphs
        if (name === 'p') {
          return <p className="text-gray-700 leading-relaxed mb-6 text-lg">{domToReact(childNodes, parserOptions)}</p>
        }

        // Style lists
        if (name === 'ul') {
          return <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-gray-700 text-lg">{domToReact(childNodes, parserOptions)}</ul>
        }
        if (name === 'ol') {
          return <ol className="list-decimal list-outside pl-6 space-y-2 mb-6 text-gray-700 text-lg">{domToReact(childNodes, parserOptions)}</ol>
        }
        if (name === 'li') {
          return <li className="text-gray-700 leading-relaxed">{domToReact(childNodes, parserOptions)}</li>
        }

        // Style blockquotes
        if (name === 'blockquote') {
          return (
            <blockquote className="border-l-4 border-black pl-6 py-2 my-8 italic text-gray-700 bg-gray-50 rounded-r-lg">
              {domToReact(childNodes, parserOptions)}
            </blockquote>
          )
        }

        // Style links - but filter out product/promo links
        if (name === 'a') {
          const linkText = childNodes.map(node => {
            if ('data' in node) return node.data
            return ''
          }).join('').toLowerCase().trim()
          
          // Skip product/promotional links
          const skipPatterns = ['see product', 'buy now', 'shop now', 'view product', 'check price', 
                                'get it here', 'order now', 'buy here', 'click here', 'learn more',
                                'read more', 'continue reading', 'full article']
          if (skipPatterns.some(pattern => linkText.includes(pattern))) {
            return <></>
          }
          
          // Skip affiliate/product URLs
          const href = attribs.href?.toLowerCase() || ''
          if (href.includes('amazon') || href.includes('affiliate') || href.includes('shop') || 
              href.includes('product') || href.includes('buy') || href.includes('store')) {
            return <></>
          }
          
          return (
            <a 
              href={attribs.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black underline hover:no-underline font-medium"
            >
              {domToReact(childNodes, parserOptions)}
            </a>
          )
        }

        // Style images
        if (name === 'img') {
          return (
            <figure className="my-8">
              <img 
                src={attribs.src} 
                alt={attribs.alt || ''} 
                className="rounded-lg w-full border-2 border-gray-200"
              />
              {attribs.alt && (
                <figcaption className="text-center text-sm text-gray-500 mt-2">{attribs.alt}</figcaption>
              )}
            </figure>
          )
        }

        // Style strong/bold
        if (name === 'strong' || name === 'b') {
          return <strong className="text-black font-semibold">{domToReact(childNodes, parserOptions)}</strong>
        }

        // Style emphasis/italic
        if (name === 'em' || name === 'i') {
          return <em className="italic">{domToReact(childNodes, parserOptions)}</em>
        }

        // Style horizontal rule
        if (name === 'hr') {
          return <hr className="my-12 border-gray-300" />
        }

        // Style code blocks
        if (name === 'pre') {
          return <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 text-sm">{domToReact(childNodes, parserOptions)}</pre>
        }
        if (name === 'code') {
          return <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">{domToReact(childNodes, parserOptions)}</code>
        }

        // Style figures
        if (name === 'figure') {
          return <figure className="my-8">{domToReact(childNodes, parserOptions)}</figure>
        }
        if (name === 'figcaption') {
          return <figcaption className="text-center text-sm text-gray-500 mt-2">{domToReact(childNodes, parserOptions)}</figcaption>
        }
      }
    }
  }

  return (
    <div>
      {/* Article Content */}
      <article className="prose prose-lg max-w-none">
        {sanitizedContent ? (
          parse(sanitizedContent, parserOptions)
        ) : (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-4/6"></div>
          </div>
        )}
      </article>

      {/* Source Attribution - Small footer for external content */}
      {isExternal && sourceName && (
        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Originally published on <span className="font-medium text-gray-700">{sourceName}</span>
            {originalUrl && (
              <>
                {' · '}
                <a 
                  href={originalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 underline hover:no-underline"
                >
                  View original
                </a>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
