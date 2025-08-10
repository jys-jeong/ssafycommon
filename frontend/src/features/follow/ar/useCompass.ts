// hooks/useCompass.ts
import { useState, useEffect } from "react";

// 나침반 데이터 타입
interface CompassData {
  heading: number;
  accuracy: "high" | "low";
}

export default function useCompass() {
  const [compass, setCompass] = useState<CompassData | null>(null);
  const [supported, setSupported] = useState<boolean>(false);

  useEffect(() => {
    if (typeof DeviceOrientationEvent !== "undefined") {
      setSupported(true);

      const handleOrientation = (event: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
        let heading = event.alpha;

        if (heading !== null) {
          // iOS 전용 속성
          if (event.webkitCompassHeading !== undefined) {
            heading = event.webkitCompassHeading; // iOS
          } else {
            heading = 360 - heading; // 안드로이드
          }

          setCompass({
            heading,
            accuracy: event.alpha !== null ? "high" : "low",
          });
        }
      };

      window.addEventListener("deviceorientationabsolute", handleOrientation as EventListener);
      window.addEventListener("deviceorientation", handleOrientation as EventListener);

      return () => {
        window.removeEventListener("deviceorientationabsolute", handleOrientation as EventListener);
        window.removeEventListener("deviceorientation", handleOrientation as EventListener);
      };
    }
  }, []);

  return { compass, supported };
}
