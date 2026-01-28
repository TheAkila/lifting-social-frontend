'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SyncLog {
  id: string;
  sync_type: string;
  direction: string;
  status: string;
  created_at: string;
  sync_duration: number;
  error_message?: string;
}

interface EventSyncStatus {
  event: {
    id: string;
    title: string;
    wl_system_competition_id: string | null;
    sync_status: string;
    last_sync_at: string | null;
    competition_status: string;
  };
  sync_logs: SyncLog[];
  synced_registrations: number;
  is_linked: boolean;
}

export default function AdminSyncDashboard() {
  const auth = useAuth();
  const token = (auth as any)?.token || '';
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<EventSyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchSyncStatus(selectedEvent);
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`);
      const data = await response.json();
      setEvents(data || []);
      if (data.length > 0) {
        setSelectedEvent(data[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const fetchSyncStatus = async (eventId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wl-system/sync/status/${eventId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      setSyncStatus(data);
    } catch (error) {
      console.error('Error fetching sync status:', error);
    }
  };

  const handleSyncRegistrations = async () => {
    if (!selectedEvent) return;

    setSyncing(true);
    try {
      // Get all approved registrations for this event
      const regResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/events/${selectedEvent}/registrations`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const registrations = await regResponse.json();
      
      // Filter confirmed registrations
      const confirmedIds = registrations
        .filter((r: any) => r.status === 'confirmed' || r.status === 'final_approved')
        .map((r: any) => r.id);

      if (confirmedIds.length === 0) {
        alert('No confirmed registrations to sync');
        setSyncing(false);
        return;
      }

      // Sync to WL-System
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wl-system/sync/registrations`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            event_id: selectedEvent,
            registration_ids: confirmedIds
          })
        }
      );

      const result = await response.json();
      
      if (result.success) {
        alert(`Successfully synced ${confirmedIds.length} registrations to WL-System`);
        fetchSyncStatus(selectedEvent);
      } else {
        alert('Failed to sync registrations: ' + result.error);
      }
    } catch (error) {
      console.error('Error syncing registrations:', error);
      alert('Error syncing registrations');
    } finally {
      setSyncing(false);
    }
  };

  const getSyncStatusBadge = (status: string) => {
    const badges = {
      'synced': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'sync_failed': 'bg-red-100 text-red-800',
      'partial_sync': 'bg-orange-100 text-orange-800',
      'manual': 'bg-gray-100 text-gray-800'
    };
    
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getCompetitionStatusBadge = (status: string) => {
    const badges = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'registration_open': 'bg-green-100 text-green-800',
      'entries_closed': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-purple-100 text-purple-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">WL-System Integration Dashboard</h2>
        {syncStatus?.is_linked && (
          <button
            onClick={handleSyncRegistrations}
            disabled={syncing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {syncing ? 'Syncing...' : 'Sync Registrations to WL-System'}
          </button>
        )}
      </div>

      {/* Event Selector */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <label htmlFor="event-selector" className="block text-sm font-medium text-gray-700 mb-2">
          Select Event
        </label>
        <select
          id="event-selector"
          value={selectedEvent || ''}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title} - {new Date(event.start_date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {/* Sync Status Overview */}
      {syncStatus && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Integration Status</div>
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              syncStatus.is_linked ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {syncStatus.is_linked ? 'Linked' : 'Not Linked'}
            </div>
            {syncStatus.event.wl_system_competition_id && (
              <div className="text-xs text-gray-500 mt-2">
                ID: {syncStatus.event.wl_system_competition_id}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Sync Status</div>
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              getSyncStatusBadge(syncStatus.event.sync_status)
            }`}>
              {syncStatus.event.sync_status.replace('_', ' ').toUpperCase()}
            </div>
            {syncStatus.event.last_sync_at && (
              <div className="text-xs text-gray-500 mt-2">
                Last: {new Date(syncStatus.event.last_sync_at).toLocaleString()}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Competition Status</div>
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              getCompetitionStatusBadge(syncStatus.event.competition_status)
            }`}>
              {syncStatus.event.competition_status.replace('_', ' ').toUpperCase()}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Synced Athletes</div>
            <div className="text-3xl font-bold text-blue-600">
              {syncStatus.synced_registrations}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              athletes synced to WL-System
            </div>
          </div>
        </div>
      )}

      {/* Sync Logs */}
      {syncStatus && syncStatus.sync_logs.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Recent Sync Operations</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Direction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {syncStatus.sync_logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.sync_type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.direction === 'wl_to_website' ? '⬅️ From WL-System' : '➡️ To WL-System'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        log.status === 'success' ? 'bg-green-100 text-green-800' :
                        log.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.sync_duration}ms
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.error_message ? (
                        <span className="text-red-600">{log.error_message}</span>
                      ) : (
                        <span className="text-green-600">Success</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Integration Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Integration Setup</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>Step 1:</strong> Configure WL-System webhook URL: <code className="bg-white px-2 py-1 rounded">{process.env.NEXT_PUBLIC_API_URL}/api/wl-system/sync/competition</code></p>
          <p><strong>Step 2:</strong> When competitions are created in WL-System, they will automatically appear on the website</p>
          <p><strong>Step 3:</strong> Users register through the website</p>
          <p><strong>Step 4:</strong> Use the "Sync Registrations" button to send confirmed athletes to WL-System</p>
          <p><strong>Step 5:</strong> Live results from WL-System will automatically update the website scoreboard</p>
        </div>
      </div>
    </div>
  );
}
