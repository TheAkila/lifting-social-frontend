'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import LiveScoreboard from '@/components/events/LiveScoreboard';
import Link from 'next/link';
import api from '@/lib/api';

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
      const response = await api.get(`/events/${slug}`);
      const payload = response?.data?.data || response?.data;

      if (!payload?.id) {
        throw new Error('Event not found');
      }

      setEvent(payload);
      setLoading(false);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to load event';
      console.error('Error fetching event:', {
        slug,
        message,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      setError(message);
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <Link
                href={`/events/${slug}`}
                className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
              >
                ← Back to Event Details
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{event.title}</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {new Date(event.start_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-gray-700">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Scoreboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <LiveScoreboard eventId={event.id} />
      </div>
    </div>
  );
}
