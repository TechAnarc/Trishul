/**
 * useLocationTracking Hook
 * 
 * Manages real-time GPS tracking via Socket.IO for an active trip.
 * - Reads device GPS every INTERVAL_MS via expo-location
 * - Emits updates to backend /tracking namespace via Socket.IO
 * - Falls back to REST POST /driver/location if socket disconnects
 * - Stores latest position in local state for UI
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { io, Socket } from 'socket.io-client';
import { getItemAsync } from '../utils/storage';
import { STORAGE_KEYS, API_BASE_URL } from '../constants';
import { driverApi } from '../services/driverApi';
import { useAuthStore } from '../store/authStore';

const SOCKET_URL = API_BASE_URL.replace('/api/v1', '');
const INTERVAL_MS = 5000; // emit GPS every 5 seconds

export interface LiveLocation {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: string;
}

export function useLocationTracking(tripId: string | null) {
  const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { user } = useAuthStore();

  const clearTracking = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsTracking(false);
  }, []);

  const startTracking = useCallback(async (activeTripId: string) => {
    // 1. Request permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Location permission denied. Enable it in device settings.');
      return;
    }

    // 2. Connect Socket.IO with JWT auth
    const token = await getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    const socket = io(`${SOCKET_URL}/tracking`, {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[GPS] Socket connected:', socket.id);
      // Announce trip start to server
      socket.emit('trip:start', { tripId: activeTripId });
    });

    socket.on('disconnect', (reason) => {
      console.warn('[GPS] Socket disconnected:', reason);
      // On disconnect, hook will fall back to REST on next interval tick
    });

    socket.on('error', (err: any) => {
      setError(err?.message || 'Tracking socket error');
    });

    // 3. Start GPS polling interval
    setIsTracking(true);

    intervalRef.current = setInterval(async () => {
      try {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const payload: LiveLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          speed: (pos.coords.speed ?? 0) * 3.6, // m/s → km/h
          heading: pos.coords.heading ?? 0,
          timestamp: new Date(pos.timestamp).toISOString(),
        };

        setLiveLocation(payload);

        // 4a. Try socket first (primary)
        if (socket.connected) {
          socket.emit('location:update', { tripId: activeTripId, ...payload });
        } else {
          // 4b. Fallback to REST
          await driverApi.pushLocation({ tripId: activeTripId, ...payload });
        }
      } catch (e: any) {
        console.error('[GPS] Failed to send location:', e.message);
      }
    }, INTERVAL_MS);
  }, []);

  const stopTracking = useCallback((activeTripId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('trip:end', { tripId: activeTripId });
    }
    clearTracking();
  }, [clearTracking]);

  // Auto-manage tracking lifecycle when tripId changes
  useEffect(() => {
    if (!tripId) {
      clearTracking();
      return;
    }
    startTracking(tripId);
    return () => clearTracking();
  }, [tripId]);

  return { liveLocation, isTracking, error, startTracking, stopTracking };
}
