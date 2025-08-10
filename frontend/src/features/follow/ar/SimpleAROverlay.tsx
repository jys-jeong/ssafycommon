// components/SimpleAROverlay.tsx
import React, { useEffect, useRef, useState } from "react";

import useGhostGame from "./useGhostGame";            // 경로 확인
import useDeviceOrientation from "./useDeviceOrientation"; // 경로 확인
import useGeoLocation from "./useGeoLocation";        // 경로 확인
import useCompass from "./useCompass";                // 경로 확인
import Ghost from "./ghost";                          // 경로 확인

// ✅ 공통 타입만 사용 (경로는 프로젝트 구조에 맞춰 수정)
import type {
  GhostUnion,
  GhostGpsFixed,
  UseGhostGameReturn,
} from "./types/ghost";

/** 센서 훅 타입(외부 훅이 JS라 최소만 가정) */
type Orientation = { alpha?: number; beta?: number; gamma?: number };
type DeviceOrientationHook = { orientation: Orientation; supported: boolean };
type GeoLocationHook = { location?: { latitude: number; longitude: number } };
type CompassHook = { compass?: { heading: number } };

// Ghost 컴포넌트에 넘길 최소 렌더 타입 가드
type RenderGhost = {
  src: string;
  pos: { x: number; y: number };
  size: number;
  rotation?: number;
  anim?: boolean;
  hue?: number;
};
function isRenderGhost(g: any): g is RenderGhost {
  return (
    g &&
    typeof g.src === "string" &&
    g.pos &&
    typeof g.pos.x === "number" &&
    typeof g.pos.y === "number" &&
    typeof g.size === "number"
  );
}

// props 타입
export type SimpleAROverlayProps = {
  isActive: boolean;
  onClose: () => void;
  markerData?: { coords: [number, number] }; // [lng, lat]
  onDefeatedDelta?: (inc: number) => void;
  onBonusPoints?: (p: number) => void;
  onAllGhostsCleared?: () => void;
};

// 도착/조준 기준
const ARRIVE_RADIUS_M = 1.2;
const AIM_TOLERANCE_DEG = 6;
const CAMERA_FOV_DEG = 60;
const COUNTDOWN_SECS = 20;

export default function SimpleAROverlay({
  isActive,
  onClose,
  markerData,
  onDefeatedDelta,
  onBonusPoints,
  onAllGhostsCleared,
}: SimpleAROverlayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { orientation, supported } =
    (useDeviceOrientation() as DeviceOrientationHook) ?? {};
  const { location } = (useGeoLocation() as GeoLocationHook) ?? {};
  const { compass } = (useCompass() as CompassHook) ?? {};

  // ✅ 공통 타입으로 받기
  const { ghosts, setGhosts, resetGame, catchGhost, movementPatterns } =
    useGhostGame() as UseGhostGameReturn;

  // 클릭 이펙트/포인트
  const [fxList, setFxList] = useState<{ id: string; x: number; y: number }[]>(
    []
  );
  const [pointsFx, setPointsFx] = useState<
    { id: string; x: number; y: number; text?: string }[]
  >([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // 보물상자 상태
  const [chestCooling, setChestCooling] = useState(false);
  const [chestClaimed, setChestClaimed] = useState(false);
  const [chestPoints, setChestPoints] = useState(0);

  // 상자 오픈 Fx
  const [chestFx, setChestFx] = useState<{ id: string; reward: number } | null>(
    null
  );

  // iOS 센서 권한
  const [needMotionPerm, setNeedMotionPerm] = useState(false);

  // HTTPS 체크(정보용)
  const isSecure = typeof window !== "undefined" && window.isSecureContext;

  // 세션 집계 + 결과 모달
  const [sessionCaught, setSessionCaught] = useState(0);
  const [resultOpen, setResultOpen] = useState(false);
  const resultTimerRef = useRef<number | null>(null);
  const resultShownRef = useRef(false);

  // 카운트다운
  const [countdown, setCountdown] = useState(COUNTDOWN_SECS);
  const countdownRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);

  const openResult = () => {
    if (resultShownRef.current) return;
    resultShownRef.current = true;
    setResultOpen(true);

    if (resultTimerRef.current) {
      window.clearTimeout(resultTimerRef.current);
      resultTimerRef.current = null;
    }
    if (countdownRef.current) {
      window.clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  // 햅틱
  const haptic = (ms = 40) => {
    let ok = false;
    try {
      if ("vibrate" in navigator) ok = navigator.vibrate(ms) || false;
    } catch {}
    if (ok) return;

    try {
      const AudioCtx =
        (window.AudioContext ||
          (window as any).webkitAudioContext) as
          | typeof AudioContext
          | undefined;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      window.setTimeout(() => {
        try {
          osc.stop();
        } catch {}
      }, Math.min(120, ms + 60));
    } catch {}
  };

  // --- geo/orientation utils ---
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371000;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const calculateBearing = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;
    const dLon = toRad(lon2 - lon1);
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x =
      Math.cos(lat1Rad) * Math.sin(lat2Rad) -
      Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    let bearing = toDeg(Math.atan2(y, x));
    return (bearing + 360) % 360;
  };

  const angleDelta = (a: number, b: number) => {
    let d = Math.abs(a - b);
    return d > 180 ? 360 - d : d;
  };

  const getScreenAngle = () => {
    try {
      if ((window as any).screen?.orientation?.angle != null)
        return (window as any).screen.orientation.angle as number;
      if (typeof (window as any).orientation === "number")
        return (window as any).orientation as number;
    } catch {}
    return 0;
  };

  const computeHeadingFromAlpha = () => {
    const a = orientation?.alpha;
    if (!Number.isFinite(a as number)) return null;
    let hdg = (360 - (a as number) + getScreenAngle()) % 360;
    if (hdg < 0) hdg += 360;
    return hdg;
  };

  // iOS 센서 권한 노출 판단
  useEffect(() => {
    const need =
      (typeof (window as any).DeviceMotionEvent !== "undefined" &&
        typeof (window as any).DeviceMotionEvent.requestPermission ===
          "function") ||
      (typeof (window as any).DeviceOrientationEvent !== "undefined" &&
        typeof (window as any).DeviceOrientationEvent.requestPermission ===
          "function");
    setNeedMotionPerm(!!need);
  }, []);

  // 오버레이 on시 권한 시도
  useEffect(() => {
    if (!isActive) return;
    (async () => {
      const DME = (window as any).DeviceMotionEvent;
      const DOE = (window as any).DeviceOrientationEvent;
      if (
        (typeof DME !== "undefined" && typeof DME.requestPermission === "function") ||
        (typeof DOE !== "undefined" && typeof DOE.requestPermission === "function")
      ) {
        try {
          let granted = false;
          if (typeof DME?.requestPermission === "function") {
            const r = await DME.requestPermission();
            granted = granted || r === "granted";
          }
          if (typeof DOE?.requestPermission === "function") {
            const r2 = await DOE.requestPermission();
            granted = granted || r2 === "granted";
          }
          setNeedMotionPerm(!granted);
          if (granted) haptic(20);
        } catch {
          setNeedMotionPerm(true);
        }
      }
    })();
  }, [isActive]);

  const requestMotionPermissions = async () => {
    try {
      const DME = (window as any).DeviceMotionEvent;
      const DOE = (window as any).DeviceOrientationEvent;
      let granted = false;
      if (typeof DME?.requestPermission === "function") {
        const r = await DME.requestPermission();
        granted = granted || r === "granted";
      }
      if (typeof DOE?.requestPermission === "function") {
        const r2 = await DOE.requestPermission();
        granted = granted || r2 === "granted";
      }
      setNeedMotionPerm(!granted);
      if (granted) haptic(30);
    } catch {
      setNeedMotionPerm(true);
    }
  };

  // UI 보조 정보가 붙은 고스트 타입
  type ProcessedGpsGhost = GhostGpsFixed & {
    pos: { x: number; y: number };
    opacity?: number;
    currentDistance?: number;
    ghostBearing?: number;
    cameraBearing?: number | null;
    deltaToCamera?: number | null;
    reason?: string;
  };

  const getProcessedGhost = (ghost: GhostUnion): GhostUnion | ProcessedGpsGhost => {
    if (ghost.type === "orientation-fixed") {
      if (!supported) return { ...ghost, pos: { x: -100, y: -100 } };
      const a = (orientation?.alpha ?? 0) as number;
      const b = (orientation?.beta ?? 0) as number;
      const alphaDiff = Math.min(
        Math.abs(a - ghost.targetAlpha),
        360 - Math.abs(a - ghost.targetAlpha)
      );
      const betaDiff = Math.abs(b - ghost.targetBeta);
      const inView = alphaDiff <= ghost.tolerance && betaDiff <= ghost.tolerance;
      if (!inView) return { ...ghost, pos: { x: -100, y: -100 } };
      return ghost;
    }

    if (ghost.type === "gps-fixed" && location) {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        ghost.gpsLat,
        ghost.gpsLon
      );

      const fallbackHeading = computeHeadingFromAlpha();
      const cameraBearing = Number.isFinite(compass?.heading)
        ? (compass!.heading as number)
        : Number.isFinite(fallbackHeading!)
        ? (fallbackHeading as number)
        : null;

      const ghostBearing = calculateBearing(
        location.latitude,
        location.longitude,
        ghost.gpsLat,
        ghost.gpsLon
      );

      const delta = Number.isFinite(cameraBearing as number)
        ? angleDelta(ghostBearing, cameraBearing as number)
        : null;

      if (distance > ARRIVE_RADIUS_M) {
        return {
          ...ghost,
          pos: { x: -100, y: -100 },
          currentDistance: distance,
          ghostBearing,
          cameraBearing,
          deltaToCamera: delta,
          reason: `도착 필요 (${(distance - ARRIVE_RADIUS_M).toFixed(1)}m 남음)`,
        };
      }

      if (!Number.isFinite(cameraBearing as number)) {
        return {
          ...ghost,
          pos: { x: -100, y: -100 },
          currentDistance: distance,
          ghostBearing,
          cameraBearing,
          deltaToCamera: delta,
          reason: "방위(나침반/알파) 없음",
        };
      }

      if ((delta as number) > CAMERA_FOV_DEG / 2) {
        return {
          ...ghost,
          pos: { x: -100, y: -100 },
          currentDistance: distance,
          ghostBearing,
          cameraBearing,
          deltaToCamera: delta,
          reason: "시야각 밖",
        };
      }

      if ((delta as number) > AIM_TOLERANCE_DEG) {
        return {
          ...ghost,
          pos: { x: -100, y: -100 },
          currentDistance: distance,
          ghostBearing,
          cameraBearing,
          deltaToCamera: delta,
          reason: `미조준 (Δ ${(delta as number).toFixed(0)}°)`,
        };
      }

      const screenX = 50;
      const screenY = 50;
      const sizeScaleRaw = 50 / Math.max(distance, 0.5);
      const sizeScale = Math.max(0.9, Math.min(1.3, sizeScaleRaw));

      return {
        ...ghost,
        pos: { x: screenX, y: screenY },
        size: (ghost.size || 120) * sizeScale,
        opacity: 1,
        currentDistance: distance,
        ghostBearing,
        cameraBearing,
        deltaToCamera: delta,
        reason: "도착+조준 성공",
      };
    }

    return ghost;
  };

  // 초기화
  useEffect(() => {
    if (!isActive) return;
    if (location) resetGame(location);
    else resetGame();
  }, [isActive]);

  // 세션 리셋 + 타이머 + 카운트다운
  useEffect(() => {
    if (!isActive) return;

    setSessionCaught(0);
    setChestClaimed(false);
    setChestPoints(0);
    setResultOpen(false);
    resultShownRef.current = false;
    setChestFx(null);

    if (resultTimerRef.current) window.clearTimeout(resultTimerRef.current);
    resultTimerRef.current = window.setTimeout(openResult, COUNTDOWN_SECS * 1000);

    setCountdown(COUNTDOWN_SECS);
    startTimeRef.current = Date.now();
    if (countdownRef.current) window.clearInterval(countdownRef.current);
    countdownRef.current = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const rem = Math.max(0, COUNTDOWN_SECS - elapsed);
      setCountdown(rem);
      if (rem <= 0) {
        if (countdownRef.current) {
          window.clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
        openResult();
      }
    }, 300);

    return () => {
      if (resultTimerRef.current) {
        window.clearTimeout(resultTimerRef.current);
        resultTimerRef.current = null;
      }
      if (countdownRef.current) {
        window.clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [isActive]);

  // 마커 주변 1m 배치 (gps-fixed 보정)
  useEffect(() => {
    if (!isActive || !markerData?.coords) return;

    const [markerLng, markerLat] = markerData.coords;
    const latRad = (markerLat * Math.PI) / 180;
    const mPerDegLat = 111320;
    const mPerDegLng = Math.cos(latRad) * 111320;

    const makeOffset1m = () => {
      const u = Math.random();
      const r = Math.sqrt(u) * 1.0;
      const theta = Math.random() * 2 * Math.PI;
      const dx = r * Math.cos(theta);
      const dy = r * Math.sin(theta);
      const lng = markerLng + dx / mPerDegLng;
      const lat = markerLat + dy / mPerDegLat;
      return { lat, lng };
    };

    setGhosts((prev) => {
      const hasGps = prev.some((g) => g.type === "gps-fixed");
      if (hasGps) {
        return prev.map((g) => {
          if (g.type !== "gps-fixed") return g;
          const p = makeOffset1m();
          return {
            ...g,
            gpsLat: p.lat,
            gpsLon: p.lng,
            maxVisibleDistance: g.maxVisibleDistance ?? 100,
          } as GhostGpsFixed;
        });
      } else {
        const p = makeOffset1m();
        // ✅ 공통 타입 GhostBase 필수 필드 채워넣기
        const newG: GhostGpsFixed = {
          type: "gps-fixed",
          gpsLat: p.lat,
          gpsLon: p.lng,
          maxVisibleDistance: 100,
          // GhostBase 필수
          src: "/box.png", // 혹은 createRandomGhost().src와 동일한 방식
          pos: { x: 50, y: 50 },
          size: 120,
          rotation: 0,
          hue: 0,
          speed: 0,
          anim: false,
          title: "🌍 특정 위치 유령",
          isFixed: true,
        } as any;
        return [...prev, newG];
      }
    });
  }, [isActive, markerData, setGhosts]);

  // 카메라
  useEffect(() => {
    if (!isActive) return;
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      .then((s) => {
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => alert("카메라 권한이 필요합니다"));
    return () =>
      (videoRef.current?.srcObject as MediaStream | undefined)
        ?.getTracks()
        .forEach((t) => t.stop());
  }, [isActive]);

  // 움직임 (always-visible만)
  useEffect(() => {
    if (!isActive || ghosts.length === 0) return;
    const timers = ghosts
      .map((gh, index) => {
        if (gh.type !== "always-visible") return null;
        return window.setInterval(() => {
          setGhosts((prev) => {
            const next = [...prev];
            const cur = next[index];
            if (!cur || cur.type !== "always-visible") return prev;

            const pattern =
              movementPatterns[Math.floor(Math.random() * movementPatterns.length)];
            let { x, y } = cur.pos || { x: 50, y: 50 };
            switch (pattern) {
              case "random-jump":
                x = Math.random() * 80 + 10;
                y = Math.random() * 80 + 10;
                break;
              case "smooth-slide":
                x = Math.max(10, Math.min(90, x + (Math.random() - 0.5) * 25));
                y = Math.max(10, Math.min(90, y + (Math.random() - 0.5) * 25));
                break;
              default:
                break;
            }
            next[index] = {
              ...cur,
              pos: { x, y },
              size:
                Math.random() < 0.2
                  ? Math.max(80, Math.min(250, (cur.size || 120) + (Math.random() - 0.5) * 30))
                  : cur.size,
              rotation:
                Math.random() < 0.15
                  ? ((cur.rotation || 0) + Math.random() * 60) % 360
                  : cur.rotation,
            };
            return next;
          });
        }, gh.speed || 800);
      })
      .filter(Boolean) as number[];
    return () => {
      timers.forEach((t) => window.clearInterval(t));
    };
  }, [isActive, ghosts, movementPatterns, setGhosts]);

  // 전부 퇴치되었을 때 1회 알림(옵션)
  const clearedRef = useRef(false);
  useEffect(() => {
    if (!isActive) {
      clearedRef.current = false;
      return;
    }
    if (ghosts.length === 0 && !clearedRef.current) {
      clearedRef.current = true;
      onAllGhostsCleared?.();
    }
    if (ghosts.length > 0) clearedRef.current = false;
  }, [ghosts.length, isActive, onAllGhostsCleared]);

  // 모든 유령(=0) + 상자 클릭 완료시 즉시 결과
  useEffect(() => {
    if (!isActive || resultShownRef.current) return;
    const allGhostsCleared = ghosts.length === 0;
    if (allGhostsCleared && chestClaimed) {
      openResult();
    }
  }, [ghosts.length, chestClaimed, isActive]);

  if (!isActive) return null;

  const processedGhosts = ghosts.map((g) => getProcessedGhost(g));

  // 유령 클릭
  const handleGhostClick = (idx: number, pg?: RenderGhost) => {
    catchGhost(idx);
    setSessionCaught((n) => n + 1);
    onDefeatedDelta?.(1);
    haptic(50);

    if (pg?.pos) {
      const id = Math.random().toString(36).slice(2);
      setFxList((list) => [...list, { id, x: pg.pos.x, y: pg.pos.y }]);
      window.setTimeout(() => setFxList((list) => list.filter((f) => f.id !== id)), 550);

      const pid = Math.random().toString(36).slice(2);
      setPointsFx((list) => [...list, { id: pid, x: pg.pos.x, y: pg.pos.y, text: "+100p" }]);
      window.setTimeout(() => setPointsFx((list) => list.filter((p) => p.id !== pid)), 900);
    }
  };

  // 보물상자 클릭
  const handleChestClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (chestCooling || chestClaimed) return;

    const reward = Math.floor(Math.random() * (3000 - 500 + 1)) + 500;
    setChestClaimed(true);
    setChestPoints(reward);
    onBonusPoints?.(reward);
    haptic(60);

    const id = Math.random().toString(36).slice(2);
    setChestFx({ id, reward });
    window.setTimeout(() => setChestFx(null), 1200);

    setChestCooling(true);
    window.setTimeout(() => setChestCooling(false), 1200);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 9999 }}>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />

      {/* ⏳ 카운트다운 */}
      <div
        style={{
          position: "absolute",
          top: "calc(12px + env(safe-area-inset-top))",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 110,
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: 999,
          fontWeight: 900,
          fontSize: 14,
          letterSpacing: 0.5,
          backdropFilter: "blur(6px)",
          pointerEvents: "none",
        }}
      >
        ⏳ {countdown}s {isSecure ? "" : "(Not Secure)"}
      </div>

      {/* iOS 센서 권한 버튼 */}
      {needMotionPerm && (
        <button
          onClick={requestMotionPermissions}
          style={{
            position: "absolute",
            top: "calc(44px + env(safe-area-inset-top))",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 120,
            padding: "10px 14px",
            borderRadius: 999,
            border: "none",
            background: "#3A8049",
            color: "#fff",
            fontWeight: 800,
            letterSpacing: 0.2,
            boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
            cursor: "pointer",
          }}
        >
          센서 허용
        </button>
      )}

      {/* 유령 레이어 */}
      <div style={{ position: "absolute", inset: 0, zIndex: 60, pointerEvents: "auto" }}>
        {processedGhosts.map((pg, i) => {
          if (!isRenderGhost(pg)) return null;
          if (pg.pos.x < 0) return null;
          return <Ghost key={`ghost-${i}`} gh={pg} idx={i} onClick={() => handleGhostClick(i, pg)} />;
        })}
      </div>

      {/* 이펙트 */}
      {fxList.map((f) => (
        <div key={f.id} style={{ position: "absolute", left: `${f.x}%`, top: `${f.y}%`, transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 70 }}>
          <div className="fx-ring" />
          <div className="fx-flash" />
        </div>
      ))}
      {pointsFx.map((p) => (
        <div key={p.id} className="score-fx" style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 75 }}>
          {p.text || "+100p"}
        </div>
      ))}

      {/* ➡️ 유령 정보 패널 */}
      <div
        style={{
          position: "absolute",
          top: 100,
          right: 20,
          maxHeight: "60vh",
          overflowY: "auto",
          background: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "10px 12px",
          borderRadius: "8px",
          fontSize: "11px",
          zIndex: 30,
          minWidth: 160,
          maxWidth: 260,
          pointerEvents: "none",
        }}
      >
        <div style={{ color: "#FFD700", fontWeight: "bold", marginBottom: 6 }}>
          👻 유령
        </div>

        {processedGhosts.map((pg, i) => {
          const g = ghosts[i]; // 원본 유령(타입 분기용)
          const visible = isRenderGhost(pg) && pg.pos.x >= 0;

          return (
            <div
              key={`info-${i}`}
              style={{
                padding: "8px 8px",
                borderRadius: 6,
                background: "rgba(255,255,255,0.06)",
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <div style={{ fontWeight: 800 }}>유령{i + 1}</div>
                <span
                  style={{
                    padding: "1px 6px",
                    borderRadius: 999,
                    background: visible
                      ? "rgba(76,175,80,0.18)"
                      : "rgba(255,152,0,0.18)",
                    color: visible ? "#4CAF50" : "#FF9800",
                    fontWeight: 800,
                  }}
                >
                  {visible ? "보임" : "안보임"}
                </span>
              </div>

              {g.type === "gps-fixed" && (
                <>
                  <div style={{ fontWeight: 800 }}>
                    📏 거리: {fxNum((pg as any).currentDistance, 1)} m
                  </div>
                  <div>🧭 방향(유령): {fxNum((pg as any).ghostBearing, 0)}°</div>
                  <div>🧭 방향(나): {fxNum((pg as any).cameraBearing, 0)}°</div>
                  {(pg as any).reason && (
                    <div style={{ opacity: 0.8 }}>• {(pg as any).reason}</div>
                  )}
                </>
              )}

              {g.type === "orientation-fixed" && (
                <>
                  <div>
                    유령 α/β: {fxNum(g.targetAlpha, 0)}° / {fxNum(g.targetBeta, 0)}°
                  </div>
                  <div>
                    나 α/β: {fxNum(orientation?.alpha as number, 0)}° /{" "}
                    {fxNum(orientation?.beta as number, 0)}°
                  </div>
                </>
              )}

              {g.type === "always-visible" && (
                <div style={{ opacity: 0.8 }}>
                  • 항상 보이는 유령 (랜덤 모션)
                </div>
              )}
            </div>
          );
        })}

        {processedGhosts.length === 0 && <div>유령이 없습니다.</div>}
      </div>

      {/* ⭐ 보물상자 */}
      {!chestClaimed && (
        <button
          onClick={handleChestClick}
          aria-label="Treasure Chest"
          style={{
            position: "absolute",
            left: "50%",
            bottom: "calc(26px + env(safe-area-inset-bottom))",
            transform: "translateX(-50%)",
            width: 72,
            height: 72,
            borderRadius: 16,
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: chestCooling ? "default" : "pointer",
            zIndex: 85,
            pointerEvents: "auto",
          }}
          disabled={chestCooling}
        >
          <img
            src="/box.png"
            alt="treasure box"
            draggable="false"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              animation: chestCooling
                ? "none"
                : "chest-bounce 1500ms ease-in-out infinite",
              userSelect: "none",
            }}
          />
        </button>
      )}

      {/* ✅ 상자 오픈 애니메이션 */}
      {chestFx && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom:
              "calc(26px + 72px + 12px + env(safe-area-inset-bottom))",
            transform: "translateX(-50%)",
            zIndex: 180,
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          <img
            src="/boxopen.png"
            alt="opened chest"
            className="chest-open-pop"
            draggable="false"
            style={{
              width: 110,
              height: "auto",
              display: "block",
              margin: "0 auto",
              filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.35))",
              userSelect: "none",
            }}
          />
          <div
            className="chest-reward-pop"
            style={{
              fontWeight: 900,
              fontSize: 22,
              color: "#ffd700",
              textShadow:
                "0 0 10px rgba(255,215,0,0.9), 0 0 18px rgba(255,215,0,0.6)",
              marginTop: 6,
              letterSpacing: 0.5,
            }}
          >
            +{chestFx.reward}p
          </div>
        </div>
      )}

      {/* 결과 모달 */}
      {resultOpen && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              width: "min(320px, 86%)",
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
              padding: "18px 16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>
              결과
            </div>

            <div style={{ marginBottom: 8, fontSize: 14 }}>
              잡은 유령 수: <b>{sessionCaught}</b>
            </div>
            <div style={{ marginBottom: 14, fontSize: 14 }}>
              보물상자 포인트: <b>{chestPoints}</b>p
            </div>

            <button
              onClick={onClose}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 10,
                border: "none",
                fontWeight: 800,
                background: "#3A8049",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              나가기
            </button>
          </div>
        </div>
      )}

      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          fontSize: 28,
          color: "#fff",
          background: "#FF4444",
          border: "none",
          cursor: "pointer",
          zIndex: 90,
          pointerEvents: "auto",
        }}
      >
        ×
      </button>

      {/* styled-jsx → 일반 <style>로 변경 */}
      <style>{`
        @keyframes fx-pop {
          0%   { transform: scale(0.3); opacity: 0.9; }
          60%  { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes fx-flash {
          0% { opacity: 0.9; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.2); }
        }
        .fx-ring {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 3px solid #ffd700;
          animation: fx-pop 550ms ease-out forwards;
          box-shadow: 0 0 12px rgba(255,215,0,0.8);
        }
        .fx-flash {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 24px;
          height: 24px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          animation: fx-flash 220ms ease-out forwards;
        }
        @keyframes score-rise {
          0%   { transform: translate(-50%, -50%) translateY(0);   opacity: 0; }
          10%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translate(-50%, -50%) translateY(-40px); opacity: 0; }
        }
        .score-fx {
          font-weight: 900;
          font-size: 20px;
          color: #ffd700;
          text-shadow: 0 0 8px rgba(255,215,0,0.9), 0 0 16px rgba(255,215,0,0.6);
          animation: score-rise 900ms ease-out forwards;
          letter-spacing: 0.5px;
        }
        @keyframes chest-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(-6px); }
        }
        @keyframes chest-open-pop {
          0%   { transform: scale(0.6) translateY(0);   opacity: 0; }
          25%  { transform: scale(1.05) translateY(-6px); opacity: 1; }
          70%  { transform: scale(1.0) translateY(-10px); opacity: 1; }
          100% { transform: scale(0.9) translateY(-16px); opacity: 0; }
        }
        @keyframes chest-reward-rise {
          0%   { transform: translateY(6px); opacity: 0; }
          20%  { opacity: 1; }
          70%  { transform: translateY(-6px); opacity: 1; }
          100% { transform: translateY(-22px); opacity: 0; }
        }
        .chest-open-pop {
          animation: chest-open-pop 1200ms ease-out forwards;
        }
        .chest-reward-pop {
          animation: chest-reward-rise 1200ms ease-out forwards;
        }
      `}</style>
    </div>
  );
}

function fxNum(v: any, d = 0) {
  return Number.isFinite(v) ? Number(v).toFixed(d) : "—";
}
