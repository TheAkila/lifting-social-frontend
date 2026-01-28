'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import LiveScoreboard from '@/components/events/LiveScoreboard';
import Link from 'next/link';

export default function LiveScoreboardPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${slug}`);
      
      if (!response.ok) {
        throw new Error('Event not found');
      }
      
      const data = await response.json();
      setEvent(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching event:', err);
      setError(err.message || 'Failed to load event');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The event you are looking for does not exist.'}</p>
          <Link
            href="/events"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={`/events/${slug}`}
                className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
              >
                ← Back to Event Details
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <p className="text-gray-600 mt-1">
                {new Date(event.start_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Scoreboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LiveScoreboard eventId={event.id} />
      </div>
    </div>
  );
}
