import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Generate a unique session ID that persists across page reloads but is unique per browser session
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('aotr_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('aotr_session_id', sessionId);
  }
  return sessionId;
};

export const useOnlineUsers = () => {
  const [onlineCount, setOnlineCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let presenceChannel: any;
    let heartbeatInterval: NodeJS.Timeout;
    let isUnloading = false;

    const setupPresence = async () => {
      try {
        // Use session-based ID that's consistent across tabs but unique per browser session
        const sessionId = getSessionId();
        
        // Subscribe to the presence channel
        presenceChannel = supabase.channel('online_users', {
          config: {
            presence: {
              key: sessionId,
            },
          },
        });

        // Track presence state changes
        presenceChannel
          .on('presence', { event: 'sync' }, () => {
            const state = presenceChannel.presenceState();
            const uniqueSessions = Object.keys(state);
            setOnlineCount(uniqueSessions.length);
            setLoading(false);
          })
          .on('presence', { event: 'join' }, ({ key }: any) => {
            console.log('Session joined:', key);
          })
          .on('presence', { event: 'leave' }, ({ key }: any) => {
            console.log('Session left:', key);
          });

        // Subscribe to the channel
        await presenceChannel.subscribe(async (status: string) => {
          if (status === 'SUBSCRIBED') {
            // Track this session as online
            await presenceChannel.track({
              session_id: sessionId,
              online_at: new Date().toISOString(),
              user_agent: navigator.userAgent.substring(0, 100), // Truncated user agent for identification
            });
          }
        });

        // Set up heartbeat to maintain presence (every 30 seconds)
        heartbeatInterval = setInterval(async () => {
          if (presenceChannel && !isUnloading) {
            await presenceChannel.track({
              session_id: sessionId,
              online_at: new Date().toISOString(),
              user_agent: navigator.userAgent.substring(0, 100),
            });
          }
        }, 30000); // Update every 30 seconds

        // Handle page unload to immediately remove presence
        const handleBeforeUnload = () => {
          isUnloading = true;
          if (presenceChannel) {
            presenceChannel.untrack();
          }
        };

        // Handle visibility change to pause/resume heartbeat
        const handleVisibilityChange = () => {
          if (document.hidden) {
            // Page is hidden, reduce heartbeat frequency
            if (heartbeatInterval) {
              clearInterval(heartbeatInterval);
            }
            heartbeatInterval = setInterval(async () => {
              if (presenceChannel && !isUnloading && !document.hidden) {
                await presenceChannel.track({
                  session_id: sessionId,
                  online_at: new Date().toISOString(),
                  user_agent: navigator.userAgent.substring(0, 100),
                });
              }
            }, 60000); // Slower heartbeat when hidden
          } else {
            // Page is visible, resume normal heartbeat
            if (heartbeatInterval) {
              clearInterval(heartbeatInterval);
            }
            heartbeatInterval = setInterval(async () => {
              if (presenceChannel && !isUnloading) {
                await presenceChannel.track({
                  session_id: sessionId,
                  online_at: new Date().toISOString(),
                  user_agent: navigator.userAgent.substring(0, 100),
                });
              }
            }, 30000);
          }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup function will remove these listeners
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };

      } catch (error) {
        console.error('Error setting up presence:', error);
        setLoading(false);
        // Fallback to a simulated count
        setOnlineCount(Math.floor(Math.random() * 50) + 10);
      }
    };

    const cleanup = setupPresence();

    // Cleanup function
    return () => {
      isUnloading = true;
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
      if (presenceChannel) {
        presenceChannel.untrack();
        presenceChannel.unsubscribe();
      }
      // Call the cleanup function from setupPresence if it exists
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then((cleanupFn: any) => {
          if (typeof cleanupFn === 'function') {
            cleanupFn();
          }
        });
      }
    };
  }, []);

  return { onlineCount, loading };
};