'use client'

import ReactMarkdown from 'react-markdown'

interface StoryContentProps {
  content: string
}

export default function StoryContent({ content }: StoryContentProps) {
  return (
    <article className="prose prose-invert prose-lg max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ ...props }) => <h1 className="text-4xl font-display font-bold mb-6 text-white" {...props} />,
          h2: ({ ...props }) => <h2 className="text-3xl font-display font-bold mt-12 mb-4 text-white" {...props} />,
          h3: ({ ...props }) => <h3 className="text-2xl font-display font-bold mt-8 mb-3 text-white" {...props} />,
          p: ({ ...props }) => <p className="text-brand-light/80 leading-relaxed mb-6" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc list-inside space-y-2 mb-6 text-brand-light/80" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-2 mb-6 text-brand-light/80" {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-4 border-brand-accent pl-6 py-4 my-8 italic text-brand-light/90 bg-brand-secondary/30 rounded-r-lg" {...props} />
          ),
          a: ({ ...props }) => <a className="text-brand-accent hover:underline" {...props} />,
          strong: ({ ...props }) => <strong className="text-white font-bold" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
