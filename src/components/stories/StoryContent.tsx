'use client'

import ReactMarkdown from 'react-markdown'

interface StoryContentProps {
  content: string
}

export default function StoryContent({ content }: StoryContentProps) {
  return (
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
  )
}
