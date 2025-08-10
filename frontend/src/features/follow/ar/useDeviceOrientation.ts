import { useState, useEffect } from "react";

interface OrientationData {
  alpha: number;
  beta: number;
  gamma: number;
}

export default function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<OrientationData>({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [supported, setSupported] = useState<boolean>(false);

  useEffect(() => {
    // iOS 13+ 권한 요청
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((state: string) => {
          if (state === "granted") setSupported(true);
        })
        .catch(() => {
          setSupported(false);
        });
    } else if (typeof DeviceOrientationEvent !== "undefined") {
      setSupported(true);
    }

    function handle(e: DeviceOrientationEvent) {
      setOrientation({
        alpha: e.alpha ?? 0,
        beta: e.beta ?? 0,
        gamma: e.gamma ?? 0,
      });
    }

    window.addEventListener("deviceorientation", handle);
    return () => window.removeEventListener("deviceorientation", handle);
  }, []);

  return { orientation, supported };
}
