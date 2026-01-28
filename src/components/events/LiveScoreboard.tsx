'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface LiveState {
  current_session: number;
  current_group: string;
  current_lift_type: 'snatch' | 'clean_jerk' | 'break';
  current_athlete_name: string;
  current_attempt_number: number;
  current_weight: number;
  timer_running: boolean;
  timer_remaining: number;
  referee_decisions: any;
  next_athlete_name: string;
  next_weight: number;
  lifting_order: any[];
  last_update: string;
}

interface AthleteResult {
  registration_id: string;
  athlete_name: string;
  weight_category: string;
  lot_number: number;
  session_number: number;
  group_number: string;
  club_name: string;
  
  snatch_opener: number;
  snatch_1_weight: number;
  snatch_1_result: string;
  snatch_2_weight: number;
  snatch_2_result: string;
  snatch_3_weight: number;
  snatch_3_result: string;
  best_snatch: number;
  
  cnj_opener: number;
  clean_jerk_1_weight: number;
  clean_jerk_1_result: string;
  clean_jerk_2_weight: number;
  clean_jerk_2_result: string;
  clean_jerk_3_weight: number;
  clean_jerk_3_result: string;
  best_clean_jerk: number;
  
  total: number;
  sinclair_score: number;
  category_rank: number;
  medals: {
    gold: boolean;
    silver: boolean;
    bronze: boolean;
  };
}

interface LiveScoreboardProps {
  eventId: string;
  showControls?: boolean;
}

export default function LiveScoreboard({ eventId, showControls = false }: LiveScoreboardProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [liveState, setLiveState] = useState<LiveState | null>(null);
  const [athletes, setAthletes] = useState<AthleteResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    // Fetch initial scoreboard data
    fetchScoreboard();

    // Initialize WebSocket connection
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setConnectionStatus('connected');
      newSocket.emit('join-competition', eventId);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('disconnected');
    });

    newSocket.on('live-update', (update: any) => {
      console.log('Live update received:', update);
      handleLiveUpdate(update);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.emit('leave-competition', eventId);
        newSocket.close();
      }
    };
  }, [eventId]);

  const fetchScoreboard = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wl-system/scoreboard/${eventId}`);
      const data = await response.json();
      
      setAthletes(data.scoreboard || []);
      setLiveState(data.live_state);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching scoreboard:', error);
      setLoading(false);
    }
  };

  const handleLiveUpdate = (update: any) => {
    switch (update.type) {
      case 'state_update':
        setLiveState(update.data);
        break;
      
      case 'result_update':
        // Update specific athlete's result
        setAthletes(prev => prev.map(athlete => 
          athlete.registration_id === update.data.registration_id
            ? { ...athlete, ...update.data }
            : athlete
        ));
        break;
      
      case 'timer_update':
        setLiveState(prev => prev ? { ...prev, timer_running: update.data.running, timer_remaining: update.data.remaining } : null);
        break;
      
      case 'competition_start':
        fetchScoreboard(); // Refresh full data
        break;
      
      case 'session_complete':
        fetchScoreboard(); // Refresh to get final rankings
        break;
    }
  };

  const renderAttempt = (weight: number | null, result: string | null) => {
    if (!weight) return <span className="text-gray-400">-</span>;
    
    const resultClass = 
      result === 'good_lift' ? 'text-green-600 font-bold' :
      result === 'no_lift' ? 'text-red-600 line-through' :
      'text-gray-500';
    
    return <span className={resultClass}>{weight}</span>;
  };

  const renderMedal = (medals: any) => {
    if (medals?.gold) return <span className="text-yellow-500 text-xl">🥇</span>;
    if (medals?.silver) return <span className="text-gray-400 text-xl">🥈</span>;
    if (medals?.bronze) return <span className="text-amber-600 text-xl">🥉</span>;
    return null;
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
      {/* Connection Status */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
            connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
            'bg-red-500'
          }`} />
          <span className="font-medium">
            {connectionStatus === 'connected' ? 'Live Connection Active' :
             connectionStatus === 'connecting' ? 'Connecting...' :
             'Disconnected'}
          </span>
        </div>
        {liveState && (
          <div className="text-sm text-gray-600">
            Session {liveState.current_session} • Group {liveState.current_group}
          </div>
        )}
      </div>

      {/* Current Lifter Card */}
      {liveState && liveState.current_athlete_name && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-200 mb-1">ON PLATFORM</div>
              <div className="text-3xl font-bold mb-2">{liveState.current_athlete_name}</div>
              <div className="text-xl">
                {liveState.current_lift_type === 'snatch' ? 'Snatch' : 'Clean & Jerk'} • 
                Attempt {liveState.current_attempt_number} • 
                <span className="font-bold ml-2">{liveState.current_weight} kg</span>
              </div>
            </div>
            
            {/* Timer */}
            {liveState.timer_running && (
              <div className="flex items-center justify-center w-32 h-32 bg-white/20 rounded-full">
                <div className="text-5xl font-mono font-bold">
                  {liveState.timer_remaining}
                </div>
              </div>
            )}
          </div>

          {/* Referee Decisions */}
          {liveState.referee_decisions && (
            <div className="mt-4 flex gap-4">
              <div className="text-sm">Referees:</div>
              {Object.entries(liveState.referee_decisions).map(([ref, decision]) => (
                <div key={ref} className={`px-3 py-1 rounded ${
                  decision === 'white' ? 'bg-white text-green-600' : 'bg-red-600'
                }`}>
                  {ref.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          )}

          {/* Next Up */}
          {liveState.next_athlete_name && (
            <div className="mt-4 pt-4 border-t border-blue-400/30">
              <div className="text-sm text-blue-200">Next:</div>
              <div className="text-lg font-semibold">
                {liveState.next_athlete_name} • {liveState.next_weight} kg
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scoreboard Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Lot</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Athlete</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Club</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700" colSpan={3}>Snatch</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Best</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700" colSpan={3}>Clean & Jerk</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Best</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Total</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Sinclair</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {athletes.map((athlete) => (
                <tr 
                  key={athlete.registration_id}
                  className={`hover:bg-gray-50 transition-colors ${
                    liveState?.current_athlete_name === athlete.athlete_name ? 'bg-blue-50 ring-2 ring-blue-400' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {athlete.category_rank && <span className="font-semibold">{athlete.category_rank}</span>}
                      {renderMedal(athlete.medals)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{athlete.lot_number}</td>
                  <td className="px-4 py-3 font-medium">{athlete.athlete_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{athlete.weight_category}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{athlete.club_name || '-'}</td>
                  
                  {/* Snatch Attempts */}
                  <td className="px-2 py-3 text-center">{renderAttempt(athlete.snatch_1_weight, athlete.snatch_1_result)}</td>
                  <td className="px-2 py-3 text-center">{renderAttempt(athlete.snatch_2_weight, athlete.snatch_2_result)}</td>
                  <td className="px-2 py-3 text-center">{renderAttempt(athlete.snatch_3_weight, athlete.snatch_3_result)}</td>
                  <td className="px-3 py-3 text-center font-bold text-blue-600">
                    {athlete.best_snatch || '-'}
                  </td>
                  
                  {/* Clean & Jerk Attempts */}
                  <td className="px-2 py-3 text-center">{renderAttempt(athlete.clean_jerk_1_weight, athlete.clean_jerk_1_result)}</td>
                  <td className="px-2 py-3 text-center">{renderAttempt(athlete.clean_jerk_2_weight, athlete.clean_jerk_2_result)}</td>
                  <td className="px-2 py-3 text-center">{renderAttempt(athlete.clean_jerk_3_weight, athlete.clean_jerk_3_result)}</td>
                  <td className="px-3 py-3 text-center font-bold text-blue-600">
                    {athlete.best_clean_jerk || '-'}
                  </td>
                  
                  {/* Total & Sinclair */}
                  <td className="px-4 py-3 text-center font-bold text-lg">
                    {athlete.total || '-'}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {athlete.sinclair_score ? athlete.sinclair_score.toFixed(2) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 p-4 rounded-lg text-sm">
        <div className="font-semibold mb-2">Legend:</div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">123</span>
            <span>Good Lift</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-600 line-through">123</span>
            <span>No Lift</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">-</span>
            <span>Not Attempted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
