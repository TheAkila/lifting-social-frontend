'use client';

import { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '@/lib/api';

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
  athlete_id?: string;
  source_registration_id?: string;
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
  const [liveState, setLiveState] = useState<LiveState | null>(null);
  const [athletes, setAthletes] = useState<AthleteResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [resolvedEventId, setResolvedEventId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string>('live');
  const [availableSessionsDetails, setAvailableSessionsDetails] = useState<any[]>([]);

  const { scheduledSessions, inProgressSessions, completedSessions } = useMemo(() => {
    const scheduled: any[] = [];
    const inProgress: any[] = [];
    const completed: any[] = [];

    availableSessionsDetails.forEach(session => {
      const sessionAthletes = athletes.filter(a => a.session_number === session.session_number);
      const sessionData = { ...session, athletes: sessionAthletes };

      if (session.status === 'in-progress' || session.status === 'in_progress') {
        inProgress.push(sessionData);
      } else if (session.status === 'completed') {
        completed.push(sessionData);
      } else {
        scheduled.push(sessionData);
      }
    });

    // If nothing is in progress, check for a live state override
    if (inProgress.length === 0 && liveState?.current_session) {
        const sessionToMove = scheduled.findIndex(s => s.session_number === liveState.current_session);
        if (sessionToMove > -1) {
            const [session] = scheduled.splice(sessionToMove, 1);
            inProgress.push(session);
        }
    }

    return { scheduledSessions: scheduled, inProgressSessions: inProgress, completedSessions: completed };
  }, [athletes, availableSessionsDetails, liveState]);

  const sessionButtons = useMemo(() => {
    return availableSessionsDetails
      .slice()
      .sort((a, b) => (a.session_number || 0) - (b.session_number || 0))
      .map((s) => ({
        value: String(s.session_number),
        label: s.name || `Session ${s.session_number}`,
      }));
  }, [availableSessionsDetails]);

  const visibleSessions = useMemo(() => {
    if (selectedSession === 'all') {
      return {
        visibleInProgress: inProgressSessions,
        visibleScheduled: scheduledSessions,
        visibleCompleted: completedSessions,
      };
    }

    if (selectedSession === 'live') {
      if (inProgressSessions.length > 0) {
        return {
          visibleInProgress: inProgressSessions,
          visibleScheduled: [],
          visibleCompleted: [],
        };
      }

      return {
        visibleInProgress: [],
        visibleScheduled: scheduledSessions.slice(0, 1),
        visibleCompleted: [],
      };
    }

    const sessionNum = parseInt(selectedSession, 10);
    return {
      visibleInProgress: inProgressSessions.filter((s) => s.session_number === sessionNum),
      visibleScheduled: scheduledSessions.filter((s) => s.session_number === sessionNum),
      visibleCompleted: completedSessions.filter((s) => s.session_number === sessionNum),
    };
  }, [selectedSession, inProgressSessions, scheduledSessions, completedSessions]);

  const boardLabel = useMemo(() => {
    if (selectedSession === 'live') {
      if (inProgressSessions.length > 0) {
        return inProgressSessions[0].name || `Session ${inProgressSessions[0].session_number} - In Progress`;
      }
      if (scheduledSessions.length > 0) {
        return `${scheduledSessions[0].name || `Session ${scheduledSessions[0].session_number}`} - Next Session`;
      }
      return 'Live Session';
    }

    if (selectedSession !== 'all') {
      const session = availableSessionsDetails.find((s) => String(s.session_number) === selectedSession);
      if (session) {
        return session.name || `Session ${session.session_number}`;
      }
    }

    if (scheduledSessions.length > 0) {
      return 'All Sessions';
    }

    return 'Competition Scoreboard';
  }, [inProgressSessions, scheduledSessions, selectedSession, availableSessionsDetails]);

  const highlightedAthleteKey = useMemo(() => {
    if (!liveState?.current_athlete_name) return null;
    return liveState.current_athlete_name.toLowerCase();
  }, [liveState]);

  useEffect(() => {
    if (selectedSession === 'live' || selectedSession === 'all') return;

    const selectedExists = availableSessionsDetails.some(
      (s) => String(s.session_number) === selectedSession
    );

    if (!selectedExists) {
      setSelectedSession('live');
    }
  }, [selectedSession, availableSessionsDetails]);

  useEffect(() => {
    // Fetch initial scoreboard data
    fetchScoreboard();

    const refreshId = setInterval(() => {
      fetchScoreboard();
    }, 15000);

    const socketBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

    // Initialize WebSocket connection
    const newSocket = io(socketBaseUrl, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setConnectionStatus('connected');
      newSocket.emit('join-competition', resolvedEventId || eventId);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('disconnected');
    });

    newSocket.on('live-update', (update: any) => {
      console.log('Live update received:', update);
      handleLiveUpdate(update);
    });

    return () => {
      clearInterval(refreshId);
      if (newSocket) {
        newSocket.emit('leave-competition', resolvedEventId || eventId);
        newSocket.close();
      }
    };
  }, [eventId, resolvedEventId]);

  const fetchScoreboard = async () => {
    try {
      const response = await api.get(`/wl-system/scoreboard/${eventId}`);
      const payload = response?.data || {};

      if (payload.event_id) {
        setResolvedEventId(payload.event_id);
      }
      
      setAvailableSessionsDetails(payload.available_sessions_details || []);
      setAthletes(payload.scoreboard || []);
      setLiveState(payload.live_state);
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
          athlete.registration_id === update.data.registration_id ||
          athlete.athlete_id === update.data.athlete_id ||
          athlete.source_registration_id === update.data.registration_id
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

      case 'attempt_update':
        fetchScoreboard(); // Keep live board in sync with technical panel attempt edits
        break;
    }
  };

  const renderAttempt = (weight: number | null, result: string | null) => {
    if (!weight) return <span className="inline-flex w-12 justify-center text-slate-400">-</span>;

    const normalized = (result || '').toLowerCase();
    const attemptClass =
      normalized === 'good_lift' || normalized === 'good' || normalized === 'success'
        ? 'bg-[#0f8f3c] text-white border-[#8fe2ae]'
        : normalized === 'no_lift' || normalized === 'no-lift' || normalized === 'bad' || normalized === 'fail' || normalized === 'failed'
        ? 'bg-[#d02e2e] text-white border-[#ff8d8d]'
        : 'bg-[#f3c74a] text-[#2d1f06] border-[#ffe18b]';

    return (
      <span className={`inline-flex min-w-[52px] justify-center px-1.5 py-0.5 border-2 font-bold tracking-wide ${attemptClass}`}>
        {weight}
      </span>
    );
  };

  const renderMedal = (medals: any) => {
    if (medals?.gold) return <span className="text-yellow-500 text-xl">🥇</span>;
    if (medals?.silver) return <span className="text-gray-400 text-xl">🥈</span>;
    if (medals?.bronze) return <span className="text-amber-600 text-xl">🥉</span>;
    return null;
  };

const renderSessionTable = (session: any, isLive: boolean) => {
    const athletes = session.athletes.sort((a: AthleteResult, b: AthleteResult) => (a.lot_number || 0) - (b.lot_number || 0));

    return (
      <div key={session.id} className="overflow-x-auto">
        <h3 className="px-4 sm:px-6 py-2 text-lg font-bold bg-[#0a395a]/50">{session.name || `Session ${session.session_number}`}</h3>
        <table className="min-w-[980px] w-full text-white">
          <thead className="bg-[#006b39] border-y-2 border-[#0b4f79]">
            <tr className="text-[11px] sm:text-xs tracking-[0.08em] uppercase">
              <th className="px-3 py-2.5 text-left">#</th>
              <th className="px-3 py-2.5 text-left">Athlete</th>
              <th className="px-2 py-2.5 text-left">Nation/Club</th>
              <th className="px-2 py-2.5 text-center">1st</th>
              <th className="px-2 py-2.5 text-center">2nd</th>
              <th className="px-2 py-2.5 text-center">3rd</th>
              <th className="px-2 py-2.5 text-center">Best</th>
              <th className="px-2 py-2.5 text-center">1st</th>
              <th className="px-2 py-2.5 text-center">2nd</th>
              <th className="px-2 py-2.5 text-center">3rd</th>
              <th className="px-2 py-2.5 text-center">Best</th>
              <th className="px-2 py-2.5 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {athletes.length === 0 && (
              <tr className="bg-[#0b5f95]">
                <td colSpan={12} className="px-4 py-8 text-center text-sm text-sky-100">
                  No athletes in this session yet.
                </td>
              </tr>
            )}
            {athletes.map((athlete: AthleteResult, index: number) => {
              const isCurrent = isLive && highlightedAthleteKey === (athlete.athlete_name || '').toLowerCase();
              const rowClass = isCurrent ? 'bg-[#cab72f] text-[#132130]' : 'bg-[#0b5f95] text-white';

              return (
                <tr key={athlete.registration_id} className={`${rowClass} border-b border-[#12496d]`}>
                  <td className="px-3 py-2 font-bold text-lg">{athlete.category_rank || index + 1}</td>
                  <td className="px-3 py-2">
                    <div className="font-semibold text-base leading-tight">{athlete.athlete_name || 'Unknown Athlete'}</div>
                    <div className={`${isCurrent ? 'text-[#273549]' : 'text-sky-100'} text-xs`}>Lot {athlete.lot_number} • {athlete.weight_category}kg</div>
                  </td>
                  <td className={`px-2 py-2 text-sm ${isCurrent ? 'text-[#273549]' : 'text-sky-100'}`}>{athlete.club_name || '-'}</td>
                  <td className="px-2 py-2 text-center">{renderAttempt(athlete.snatch_1_weight, athlete.snatch_1_result)}</td>
                  <td className="px-2 py-2 text-center">{renderAttempt(athlete.snatch_2_weight, athlete.snatch_2_result)}</td>
                  <td className="px-2 py-2 text-center">{renderAttempt(athlete.snatch_3_weight, athlete.snatch_3_result)}</td>
                  <td className="px-2 py-2 text-center font-black text-lg">{athlete.best_snatch || '-'}</td>
                  <td className="px-2 py-2 text-center">{renderAttempt(athlete.clean_jerk_1_weight, athlete.clean_jerk_1_result)}</td>
                  <td className="px-2 py-2 text-center">{renderAttempt(athlete.clean_jerk_2_weight, athlete.clean_jerk_2_result)}</td>
                  <td className="px-2 py-2 text-center">{renderAttempt(athlete.clean_jerk_3_weight, athlete.clean_jerk_3_result)}</td>
                  <td className="px-2 py-2 text-center font-black text-lg">{athlete.best_clean_jerk || '-'}</td>
                  <td className="px-2 py-2 text-center font-black text-xl">{athlete.total || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#0a395a] bg-[#0b4f79] text-white shadow-2xl overflow-hidden">
        <div className="px-4 sm:px-6 py-3 bg-[#e8edf1] text-[#0e1f2d] border-b-4 border-[#00a651]">
          <p className="text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase">Lifting Social Live Feed</p>
          <h2 className="mt-1 text-xl sm:text-3xl font-black tracking-wide">SCOREBOARD</h2>
          <p className="mt-1 text-sm sm:text-base font-semibold">{boardLabel}</p>
        </div>

        <div className="px-4 sm:px-6 py-3 bg-[#00a651] text-white flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-start">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative inline-flex items-center">
              <select
                aria-label="Select session view"
                title="Select session view"
                className="appearance-none bg-white/15 border border-white/35 rounded-md pl-3 pr-8 py-1.5 text-xs sm:text-sm font-semibold text-white"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
              >
                <option value="live" className="text-[#0b4f79]">Live Session</option>
                <option value="all" className="text-[#0b4f79]">All Sessions</option>
                {sessionButtons.map((session) => (
                  <option key={session.value} value={session.value} className="text-[#0b4f79]">
                    {session.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/90 text-[10px]">▼</span>
            </div>

            <div className="flex items-center gap-3 text-sm font-semibold">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                connectionStatus === 'connected' ? 'bg-white animate-pulse' :
                connectionStatus === 'connecting' ? 'bg-yellow-200 animate-pulse' :
                'bg-red-200'
              }`} />
              <span>
                {connectionStatus === 'connected' ? 'Broadcast Connected' :
                 connectionStatus === 'connecting' ? 'Connecting...' :
                 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {liveState && liveState.current_athlete_name && (
          <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-[#005787] to-[#00456a] border-b border-white/20">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-sky-100">On Platform</p>
                <p className="text-xl sm:text-2xl font-extrabold">{liveState.current_athlete_name}</p>
                <p className="text-sm sm:text-base text-sky-100">
                  {liveState.current_lift_type === 'snatch' ? 'Snatch' : 'Clean & Jerk'} • Attempt {liveState.current_attempt_number} • {liveState.current_weight} kg
                </p>
              </div>

              <div className="flex items-center gap-3">
                {liveState.timer_running && (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/60 flex items-center justify-center bg-white/10">
                    <span className="font-mono text-2xl sm:text-3xl font-black">{liveState.timer_remaining}</span>
                  </div>
                )}
                {liveState.next_athlete_name && (
                  <div className="text-sm text-right">
                    <p className="uppercase tracking-[0.12em] text-sky-100 text-[10px]">Next</p>
                    <p className="font-bold">{liveState.next_athlete_name}</p>
                    <p className="text-sky-100">{liveState.next_weight} kg</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {visibleSessions.visibleInProgress.map(session => renderSessionTable(session, true))}
          
          {visibleSessions.visibleScheduled.length > 0 && (
            <div>
              <h3 className="px-4 sm:px-6 py-2 text-lg font-bold bg-[#0a395a]/80">Upcoming Sessions</h3>
              {visibleSessions.visibleScheduled.map(session => renderSessionTable(session, false))}
            </div>
          )}

          {visibleSessions.visibleCompleted.length > 0 && (
            <div>
              <h3 className="px-4 sm:px-6 py-2 text-lg font-bold bg-[#0a395a]/60">Completed Sessions</h3>
              {visibleSessions.visibleCompleted.map(session => renderSessionTable(session, false))}
            </div>
          )}

          {visibleSessions.visibleInProgress.length === 0 && visibleSessions.visibleScheduled.length === 0 && visibleSessions.visibleCompleted.length === 0 && (
             <div className="px-4 py-8 text-center text-sm text-sky-100">
                No sessions found for this competition yet.
              </div>
          )}
        </div>

        <div className="px-4 sm:px-6 py-3 text-xs sm:text-sm bg-[#073653] text-sky-100 flex flex-wrap gap-4">
          <span><span className="font-bold text-white">Yellow box</span>: declared/pending</span>
          <span><span className="font-bold text-white">Green box</span>: good lift</span>
          <span><span className="font-bold text-white">Red box</span>: no lift</span>
          <span><span className="font-bold text-[#ffe25e]">Gold row</span>: current lifter</span>
        </div>
      </div>

      {showControls && (
        <p className="text-xs text-zinc-500">
          Debug mode active.
        </p>
      )}
    </div>
  );
}
