import { notFound } from 'next/navigation'
import StoryContent from '@/components/stories/StoryContent'
import StoryHeader from '@/components/stories/StoryHeader'
import RelatedStories from '@/components/stories/RelatedStories'

// This would normally fetch from API
async function getStory(slug: string) {
  // Mock data - replace with actual API call
  return {
    id: '1',
    slug,
    title: 'From Village Gym to National Stage: Dilanka\'s Journey',
    excerpt: 'How a young lifter from rural Sri Lanka overcame obstacles to become a national champion.',
    content: `
# From Village Gym to National Stage

In the remote village of Weligama, far from the spotlight of Colombo's modern training facilities, a young Dilanka Isuru discovered his passion for weightlifting in the most unlikely of places—a small community gym with rusty barbells and concrete weights.

## The Beginning

Dilanka's journey started at age 14 when he first walked into the village gym. "I had never seen anyone lift weights before," he recalls. "But something about the discipline and strength required captivated me immediately."

## Overcoming Obstacles

- **Limited Equipment**: Training with homemade weights and improvised equipment
- **Financial Challenges**: Raising funds for competition travel
- **Distance from Coaching**: Learning techniques through YouTube videos
- **Community Doubt**: Proving that champions can come from anywhere

## The Breakthrough

After years of dedication, Dilanka qualified for the National Championships. Despite minimal resources, his raw talent and unwavering determination caught the attention of Coach Pradeep Fernando, who took him under his wing.

> "Dilanka's work ethic is unmatched. He turned every limitation into an opportunity to grow stronger." - Coach Pradeep Fernando

## Championship Victory

In 2024, Dilanka stood on the national stage and lifted 145kg in the snatch and 175kg in the clean and jerk, claiming the gold medal in the 73kg category. His total of 320kg set a new national record.

## Impact on the Community

Dilanka's success has inspired dozens of young athletes in Weligama. The village gym, once barely functional, now hosts regular training sessions with proper equipment donated by Lifting Social and other sponsors.

## Looking Forward

Now training full-time at the National Sports Complex, Dilanka has his sights set on the Commonwealth Games and, ultimately, the Olympics. But he returns to Weligama every month to train with the next generation of lifters.

"I want every kid in every village to know that they can achieve their dreams, no matter where they start," Dilanka says. "Hard work and passion are the only equipment you truly need."

---

*This story is part of our ongoing series celebrating Sri Lankan weightlifting champions.*
    `,
    author: {
      id: '1',
      name: 'Lifting Social Team',
      avatar: '/images/authors/team.jpg',
      bio: 'Documenting the incredible stories of Sri Lankan weightlifting.',
    },
    category: 'Athlete Story',
    categoryColor: 'bg-brand-primary',
    tags: ['athlete-profile', 'inspiration', 'national-champion'],
    coverImage: '/images/stories/story-1.jpg',
    publishedAt: '2024-10-25',
    readTime: '5 min read',
    views: 1250,
    featured: true,
  }
}

export default async function StoryPage({ params }: { params: { slug: string } }) {
  const story = await getStory(params.slug)

  if (!story) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-20">
      <StoryHeader story={story} />
      <div className="container-custom section-padding">
        <div className="max-w-4xl mx-auto">
          <StoryContent content={story.content} />
          
          {/* Author Bio */}
          <div className="card mt-12">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {story.author.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl">{story.author.name}</h3>
                <p className="text-brand-light/70">{story.author.bio}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8">
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-brand-secondary/50 rounded-full text-sm hover:bg-brand-accent hover:text-brand-dark transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <RelatedStories currentStoryId={story.id} />
      </div>
    </div>
  )
}
