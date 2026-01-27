'use client'

import ReactMarkdown from 'react-markdown'
import { ExternalLink } from 'lucide-react'

interface StoryContentProps {
  content: string
  isExternal?: boolean
  originalUrl?: string
  sourceName?: string
}

export default function StoryContent({ content, isExternal, originalUrl, sourceName }: StoryContentProps) {
  return (
    <div>
      {/* External Post Banner */}
      {isExternal && originalUrl && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-[12px] p-6 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-600 mb-2">
                This article is aggregated from <strong className="text-zinc-900">{sourceName}</strong>
              </p>
              <p className="text-xs text-zinc-500">
                Click below to read the full article on the original website
              </p>
            </div>
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-[10px] text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Read Original
            </a>
          </div>
        </div>
      )}
      
      <article className="prose prose-lg max-w-none prose-zinc">
      <ReactMarkdown
        components={{
          h1: ({ ...props }) => (
            <h1 className="font-display text-4xl font-bold mb-6 text-zinc-900" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="font-display text-3xl font-bold mt-12 mb-4 text-zinc-900" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="font-display text-2xl font-bold mt-8 mb-3 text-zinc-900" {...props} />
          ),
          p: ({ ...props }) => (
            <p className="text-zinc-600 leading-relaxed mb-6 text-lg" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-zinc-600 text-lg" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="list-decimal list-outside pl-6 space-y-2 mb-6 text-zinc-600 text-lg" {...props} />
          ),
          li: ({ ...props }) => (
            <li className="text-zinc-600 leading-relaxed" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote 
              className="border-l-4 border-zinc-900 pl-6 py-2 my-8 italic text-zinc-700 bg-zinc-50 rounded-r-lg" 
              {...props} 
            />
          ),
          a: ({ ...props }) => (
            <a className="text-brand-accent hover:underline font-medium" {...props} />
          ),
          strong: ({ ...props }) => (
            <strong className="text-zinc-900 font-semibold" {...props} />
          ),
          img: ({ ...props }) => (
            <img className="rounded-lg my-8 w-full" {...props} />
          ),
          hr: ({ ...props }) => (
            <hr className="my-12 border-zinc-200" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
    </div>
  )
}
