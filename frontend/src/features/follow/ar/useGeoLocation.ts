// hooks/useGeoLocation.ts
import { useState, useEffect } from "react";

type LocationData = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

export default function useGeoLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator) || !navigator.geolocation) {
      setError("GPS를 지원하지 않습니다");
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      setLocation({ latitude, longitude, accuracy });
      // eslint-disable-next-line no-console
      console.log("📍 GPS 업데이트:", latitude, longitude);
    };

    const onError = (err: GeolocationPositionError) => {
      setError(err.message);
    };

    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000, // 1초 캐시 허용
    });

    return () => {
      try {
        navigator.geolocation.clearWatch(watchId);
      } catch {
        // ignore
      }
    };
  }, []);

  return { location, error };
}
