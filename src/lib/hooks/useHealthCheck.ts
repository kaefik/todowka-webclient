import { useState, useEffect } from 'react';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'offline';
  sse: 'available' | 'unavailable';
  celery: 'running' | 'stopped';
  redis: 'running' | 'stopped';
  active_connections?: number;
  timestamp: string;
}

export function useHealthCheck(interval: number = 5 * 60 * 1000) {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkHealth = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/health/notifications`);
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      console.error('[HealthCheck] Error:', error);
      setHealth({
        status: 'offline',
        sse: 'unavailable',
        celery: 'stopped',
        redis: 'stopped',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const intervalId = setInterval(checkHealth, interval);
    return () => clearInterval(intervalId);
  }, [interval]);

  return { health, isLoading, refreshHealth: checkHealth };
}
