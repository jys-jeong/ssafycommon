// Map3D.tsx
import React, {
  useRef,
  useEffect,
  useState,
  Suspense,
} from "react";
import type { LazyExoticComponent } from "react";
import mapboxgl, {
  Map as MapboxMap,
  Marker as MapboxMarker,
  GeolocateControl,
} from "mapbox-gl";
import type { LngLatLike, MapLayerMouseEvent } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createRoot} from "react-dom/client";
import { PinMarker } from "./PinMarker";
import ARButton from "./ARButton";
import type { Root } from "react-dom/client";
// ---- Lazy AR Overlay ----
const SimpleAROverlay = React.lazy(
  () => import("../ar/SimpleAROverlay")
) as LazyExoticComponent<React.ComponentType<SimpleAROverlayProps>>;

// ---- External component props (adjust to your real props if different) ----
type PinMarkerProps = {
  imageUrl: string;
  disabled: boolean;
  interactive: boolean;
  onClick: () => void;
};

type ARButtonProps = {
  onClick: () => void;
};

type SimpleAROverlayProps = {
  isActive: boolean;
  markerData: {
    coords: [number, number];
    title: string;
    description: string;
    imageUrl: string;
    id: string;
  } | null;
  onClose: () => void;
  onDefeatedDelta: (inc: number) => void;
  onBonusPoints: (p: number) => void;
  onAllGhostsCleared: () => void;
};

// ---- Local types ----
export type Map3DProps = {
  onExit?: () => void; // 선택적: 외부에서 종료 처리 훅을 받고 싶다면 사용
};

type MarkerInfo = {
  lng: number;
  lat: number;
  title: string;
  description: string;
};

type DomMarkerRecord = {
  marker: MapboxMarker;
  root: Root;
  disabled: boolean;
  interactive: boolean;
  title: string;
};

type FeatureProps = {
  id: string;
  title: string;
  description: string;
};

export const CONFIG = {
  targetLng: 127.1465,
  targetLat: 35.8477,
  markerImageUrl: "/image.jpg",
  mapboxToken:
    "pk.eyJ1IjoiamVvbmd5ZXNlb25nIiwiYSI6ImNtZHJldDNkODBmMW4yaXNhOGE1eWg4ODcifQ.LNsrvvxhCIJ6Lvwc9c0tVg",
};

const MARKER_CENTER = { lng: 126.82287685, lat: 35.18376162 };

export const EXTRA_MARKERS: MarkerInfo[] = [
  {
    lng: MARKER_CENTER.lng + 0.0012,
    lat: MARKER_CENTER.lat + 0.001,
    title: "커피마을",
    description: "향긋한 커피가 있는 곳",
  },
  {
    lng: MARKER_CENTER.lng - 0.0011,
    lat: MARKER_CENTER.lat - 0.0007,
    title: "헬스존",
    description: "건강을 위한 헬스장",
  },
  {
    lng: MARKER_CENTER.lng + 0.0008,
    lat: MARKER_CENTER.lat - 0.0012,
    title: "피크닉장",
    description: "야외 피크닉 명소",
  },
  {
    lng: MARKER_CENTER.lng - 0.0009,
    lat: MARKER_CENTER.lat + 0.0005,
    title: "놀이터",
    description: "아이들이 뛰노는 놀이터",
  },
  {
    lng: MARKER_CENTER.lng + 0.0015,
    lat: MARKER_CENTER.lat + 0.0006,
    title: "전망대",
    description: "넓은 경치를 볼 수 있는 전망대",
  },
  {
    lng: MARKER_CENTER.lng - 0.0013,
    lat: MARKER_CENTER.lat + 0.0014,
    title: "사진스팟",
    description: "인생샷 명소",
  },
  {
    lng: MARKER_CENTER.lng + 0.0006,
    lat: MARKER_CENTER.lat - 0.0008,
    title: "문화의 거리",
    description: "지역 문화 예술 공간",
  },
  {
    lng: MARKER_CENTER.lng - 0.0017,
    lat: MARKER_CENTER.lat - 0.0004,
    title: "쉼터",
    description: "잔디와 벤치가 있는 쉼터",
  },
  {
    lng: MARKER_CENTER.lng + 0.0013,
    lat: MARKER_CENTER.lat - 0.0005,
    title: "맛집거리",
    description: "다양한 음식점이 모인 거리",
  },
  {
    lng: MARKER_CENTER.lng - 0.0004,
    lat: MARKER_CENTER.lat + 0.0017,
    title: "산책길",
    description: "산책과 운동 겸하기 좋은 길",
  },
];

mapboxgl.accessToken = CONFIG.mapboxToken;

const coordKey = (coord: [number, number]) =>
  `${coord[0].toFixed(8)},${coord[1].toFixed(8)}`;

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const formatDuration = (totalSec: number): string => {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
};

const Map3D: React.FC<Map3DProps> = ({ onExit }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapboxMap | null>(null);
  const domMarkerMap = useRef<Map<string, DomMarkerRecord>>(new Map());

  const geolocateControl = useRef<GeolocateControl | null>(null);
  const watchId = useRef<number | null>(null);
  const hasCenteredOnUser = useRef<boolean>(false);
  const isInitialized = useRef<boolean>(false);

  // rAF throttle
  const rafId = useRef<number | null>(null);
  const scheduleMarkerUpdateRef = useRef<(() => void) | null>(null);

  // AR preload 1-shot
  const arPrefetchedRef = useRef<boolean>(false);

  // GPS noise cut refs
  const lastLocRef = useRef<[number, number] | null>(null); // [lng, lat]
  const lastTsRef = useRef<number>(0);

  // ▶️ Walk tracking refs
  const walkStartTsRef = useRef<number | null>(null);
  const walkTimerRef = useRef<number | null>(null);
  const walkPrevRef = useRef<[number, number] | null>(null);
  const walkDistanceRef = useRef<number>(0);

  // UI state
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  ); // [lng, lat]
  const [showARButton, setShowARButton] = useState<boolean>(false);
  const [closestMarker, setClosestMarker] = useState<MarkerInfo | null>(null);

  const [disabledMarkerTitles, setDisabledMarkerTitles] = useState<string[]>(
    []
  );
  const [isARActive, setIsARActive] = useState<boolean>(false);
  const [selectedMarkerData, setSelectedMarkerData] =
    useState<SimpleAROverlayProps["markerData"]>(null);

  const disabledTitlesRef = useRef<string[]>([]);
  const [isWalkMode, setIsWalkMode] = useState<boolean>(false);
  const isWalkModeRef = useRef<boolean>(false);
  const routeReqRef = useRef<number>(0);
  const [points, setPoints] = useState<number>(0);

  // ⏱️/📏 Walk stats UI state (1초마다 갱신)
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [distanceM, setDistanceM] = useState<number>(0);
  const [defeated, setDefeated] = useState<number>(0);

  const totalMarkerCount = EXTRA_MARKERS.length;
  const disabledCount = React.useMemo(() => {
    const set = new Set(disabledMarkerTitles);
    return EXTRA_MARKERS.reduce(
      (acc, m) => acc + (set.has(m.title) ? 1 : 0),
      0
    );
  }, [disabledMarkerTitles]);
  const disabledPct = totalMarkerCount
    ? Math.round((disabledCount / totalMarkerCount) * 100)
    : 0;

  useEffect(() => {
    isWalkModeRef.current = isWalkMode;
    scheduleMarkerUpdate();
  }, [isWalkMode]);

  useEffect(() => {
    disabledTitlesRef.current = disabledMarkerTitles;
    scheduleMarkerUpdate();
  }, [disabledMarkerTitles]);

  const handleExit = () => {
    try {
      stopLocationTracking();
    } catch {
      // ignore
    }
    if (onExit) {
      onExit();
      return;
    }
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/";
  };

  // rAF throttle
  const scheduleMarkerUpdate = () => {
    if (!scheduleMarkerUpdateRef.current) {
      scheduleMarkerUpdateRef.current = () => {
        if (rafId.current) return;
        rafId.current = window.requestAnimationFrame(() => {
          rafId.current = null;
          updateDOMMarkers();
        });
      };
    }
    scheduleMarkerUpdateRef.current();
  };

  function getClosestMarkerAndDistance(
    userLoc: [number, number] | null,
    markers: MarkerInfo[]
  ): { nearest: MarkerInfo | null; distance: number | null } {
    if (!userLoc || markers.length === 0)
      return { nearest: null, distance: null };
    let minDist = Infinity;
    let nearest: MarkerInfo | null = null;
    for (const m of markers) {
      const d = calculateDistance(userLoc[1], userLoc[0], m.lat, m.lng);
      if (d < minDist) {
        minDist = d;
        nearest = m;
      }
    }
    return { nearest, distance: nearest ? Math.round(minDist) : null };
  }

  useEffect(() => {
    if (!userLocation) {
      setClosestMarker(null);
      setShowARButton(false);
      return;
    }
    const activeMarkers = EXTRA_MARKERS.filter(
      (m) => !disabledMarkerTitles.includes(m.title)
    );
    const { nearest, distance } = getClosestMarkerAndDistance(
      userLocation,
      activeMarkers
    );
    const inRange = isWalkMode && nearest && (distance ?? Infinity) <= 100;

    if (inRange && !arPrefetchedRef.current) {
      import("../ar/SimpleAROverlay");
      arPrefetchedRef.current = true;
    }
    setClosestMarker(inRange ? nearest! : null);
    setShowARButton(!!inRange);
  }, [userLocation, disabledMarkerTitles, isWalkMode]);

  const centerMapToUserLocation = (
    userCoords: [number, number],
    zoomLevel: number = 16
  ) => {
    if (map.current && !hasCenteredOnUser.current) {
      map.current.easeTo({
        center: userCoords as LngLatLike,
        zoom: zoomLevel,
        duration: 2000,
      });
      hasCenteredOnUser.current = true;
    }
  };

  // GPS watch + noise cut + distance accumulate
  const startLocationTracking = () => {
    if (!navigator.geolocation) return;

    if (watchId.current != null)
      navigator.geolocation.clearWatch(watchId.current);
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { longitude, latitude, accuracy } = position.coords;
        const ts = position.timestamp || Date.now();

        // raw log
        // eslint-disable-next-line no-console
        console.log(
          `[GPS/raw] ${longitude.toFixed(6)}, ${latitude.toFixed(
            6
          )}  (±${Math.round(accuracy || 0)}m)  @ ${new Date(
            ts
          ).toLocaleTimeString()}`
        );

        const userCoords: [number, number] = [longitude, latitude];

        const now = performance.now();
        const distFromLast = lastLocRef.current
          ? calculateDistance(
              lastLocRef.current[1],
              lastLocRef.current[0],
              userCoords[1],
              userCoords[0]
            )
          : 0;

        const movedEnough = !lastLocRef.current || distFromLast >= 5; // ≥ 5m
        const timeEnough = now - lastTsRef.current >= 800; // ≥ 0.8s
        if (!movedEnough && !timeEnough) return;

        // use log
        // eslint-disable-next-line no-console
        console.log(
          `[GPS/use] ${userCoords[0].toFixed(6)}, ${userCoords[1].toFixed(
            6
          )} | +${distFromLast.toFixed(1)}m / ${Math.round(
            now - lastTsRef.current
          )}ms`
        );

        // 산책 중이면 거리 누적
        if (isWalkModeRef.current && walkStartTsRef.current) {
          if (walkPrevRef.current) {
            const seg = distFromLast;
            if (seg >= 1) walkDistanceRef.current += seg; // 1m 미만 노이즈 무시
          }
          walkPrevRef.current = userCoords;
        }

        lastLocRef.current = userCoords;
        lastTsRef.current = now;

        setUserLocation(userCoords);
        if (map.current?.isStyleLoaded()) centerMapToUserLocation(userCoords);
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.warn("geo error", error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  };

  const stopLocationTracking = () => {
    if (watchId.current != null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  };

  const createGeojson = (
    excludeDestination: [number, number] | null = null
  ) => {
    const baseFeatures: GeoJSON.Feature<GeoJSON.Point, FeatureProps>[] = [
      {
        type: "Feature",
        properties: {
          id: "main",
          title: "전북대학교",
          description: "산책 프로젝트 출발지",
        },
        geometry: {
          type: "Point",
          coordinates: [CONFIG.targetLng, CONFIG.targetLat],
        },
      },
      ...EXTRA_MARKERS.map<GeoJSON.Feature<GeoJSON.Point, FeatureProps>>(
        (marker, index) => ({
          type: "Feature",
          properties: {
            id: `spot_${index}`,
            title: marker.title,
            description: marker.description,
          },
          geometry: { type: "Point", coordinates: [marker.lng, marker.lat] },
        })
      ),
    ];

    if (excludeDestination) {
      return {
        type: "FeatureCollection" as const,
        features: baseFeatures.filter((f) => {
          const [lng, lat] = f.geometry.coordinates;
          const [dlng, dlat] = excludeDestination;
          return !(
            Math.abs(lng - dlng) < 0.000001 && Math.abs(lat - dlat) < 0.000001
          );
        }),
      };
    }
    return { type: "FeatureCollection" as const, features: baseFeatures };
  };

  const safeRemoveSourceAndLayers = (sourceId: "walk-route" | "markers") => {
    if (!map.current) return;
    try {
      const layerIds: Record<string, string[]> = {
        "walk-route": ["walk-route"],
        markers: ["clusters", "cluster-count"],
      };
      (layerIds[sourceId] || []).forEach((layerId) => {
        if (map.current!.getLayer(layerId)) map.current!.removeLayer(layerId);
      });
      if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);
    } catch {
      // ignore
    }
  };

  const initializeMap = (center: [number, number]) => {
    if (mapContainer.current) mapContainer.current.innerHTML = "";
    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLElement,
      style: "mapbox://styles/mapbox/streets-v12",
      center,
      zoom: 15,
      pitch: 60,
      bearing: -17.6,
      antialias: true,
      preserveDrawingBuffer: true,
      renderWorldCopies: false,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
        showCompass: true,
        showZoom: true,
      }),
      "bottom-right"
    );

    geolocateControl.current = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      },
      trackUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: true,
    });

    map.current.addControl(geolocateControl.current, "bottom-right");

    geolocateControl.current.on("geolocate", (e: GeolocationPosition) => {
      const userCoords: [number, number] = [
        e.coords.longitude,
        e.coords.latitude,
      ];
      setUserLocation(userCoords);
      centerMapToUserLocation(userCoords);
    });

    map.current.on("load", () => {
      setupMapLayers();
      setTimeout(() => {
        geolocateControl.current?.trigger();
        setTimeout(() => startLocationTracking(), 2000);
      }, 1000);
    });
  };

  useEffect(() => {
    if (isInitialized.current || map.current) return;
    isInitialized.current = true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userCoords: [number, number] = [
            pos.coords.longitude,
            pos.coords.latitude,
          ];
          setUserLocation(userCoords);
          initializeMap(userCoords);
          hasCenteredOnUser.current = true;
        },
        () => initializeMap([CONFIG.targetLng, CONFIG.targetLat]),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      );
    } else {
      initializeMap([CONFIG.targetLng, CONFIG.targetLat]);
    }

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (walkTimerRef.current) clearInterval(walkTimerRef.current);
      stopLocationTracking();

      domMarkerMap.current.forEach((rec) => {
        rec?.marker?.remove?.();
        rec?.root?.unmount?.();
      });
      domMarkerMap.current.clear();

      if (map.current) {
        try {
          map.current.off("click", "clusters", handleClusterClick as any);
          ["move", "zoom", "idle"].forEach((ev) =>
            map.current!.off(
              ev,
              (scheduleMarkerUpdateRef.current || updateDOMMarkers) as any
            )
          );
          if (geolocateControl.current)
            map.current.removeControl(geolocateControl.current);
        } catch {
          // ignore
        }
        map.current.remove();
        map.current = null;
      }
      isInitialized.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRouteWithFixedLocation = async (
    fixedStartLocation: [number, number],
    end: [number, number]
  ) => {
    if (!map.current || !map.current.isStyleLoaded()) {
      map.current?.once("idle", () =>
        getRouteWithFixedLocation([...fixedStartLocation], [...end])
      );
      return;
    }
    const myId = ++routeReqRef.current;
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${fixedStartLocation[0]},${fixedStartLocation[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&overview=full&access_token=${CONFIG.mapboxToken}`;
      const res = await fetch(url);
      const data: any = await res.json();
      if (res.status !== 200 || data?.code !== "Ok" || !data?.routes?.length) {
        alert("경로를 찾지 못했어요. 잠시 후 다시 시도해주세요.");
        return;
      }
      if (myId !== routeReqRef.current) return;

      safeRemoveSourceAndLayers("walk-route");

      const routeCoords: [number, number][] =
        data.routes[0].geometry.coordinates;
      const enhancedRoute = [fixedStartLocation, ...routeCoords, end];
      const filteredRoute = enhancedRoute.filter((coord, i) => {
        if (i === 0) return true;
        const p = enhancedRoute[i - 1];
        const dx = coord[0] - p[0];
        const dy = coord[1] - p[1];
        return Math.sqrt(dx * dx + dy * dy) > 0.00001;
      });

      map.current.addSource("walk-route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: filteredRoute },
        },
      } as any);

      map.current.addLayer({
        id: "walk-route",
        type: "line",
        source: "walk-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#ff2d55",
          "line-width": 6,
          "line-opacity": 0.95,
        },
      });

      const bounds = filteredRoute.reduce(
        (b, c) => b.extend(c as any),
        new mapboxgl.LngLatBounds(
          filteredRoute[0] as any,
          filteredRoute[0] as any
        )
      );
      map.current.fitBounds(bounds, { padding: 50 });
    } catch (e) {
      alert("길찾기 중 오류가 발생했습니다.");
    }
  };

  // ▶️ Start / ⏹️ Stop
  const handleStart = () => {
    setIsWalkMode(true);
    // 초기화
    walkStartTsRef.current = performance.now();
    walkDistanceRef.current = 0;
    walkPrevRef.current = userLocation || null;
    setElapsedSec(0);
    setDistanceM(0);
    // 1초마다 UI 갱신
    if (walkTimerRef.current) clearInterval(walkTimerRef.current);
    walkTimerRef.current = window.setInterval(() => {
      if (!walkStartTsRef.current) return;
      const sec = Math.floor(
        (performance.now() - walkStartTsRef.current) / 1000
      );
      setElapsedSec(sec);
      setDistanceM(Math.round(walkDistanceRef.current));
    }, 1000);
  };

  const handleGaugeStop = () => {
    setIsWalkMode(false);
    setShowARButton(false);
    setIsARActive(false);
    safeRemoveSourceAndLayers("walk-route");
    setClosestMarker(null);

    if (walkTimerRef.current) clearInterval(walkTimerRef.current);
    walkTimerRef.current = null;
    walkStartTsRef.current = null;
    walkPrevRef.current = null;

    setElapsedSec(0);
    setDistanceM(0);
  };

  const getRoute = async (end: [number, number]) => {
    if (!userLocation) {
      alert("사용자 위치를 찾을 수 없습니다. 위치 서비스를 활성화해주세요.");
      return;
    }
    const fixedLocation: [number, number] = [...userLocation];
    return getRouteWithFixedLocation(fixedLocation, end);
  };

  const clearRoute = () => {
    safeRemoveSourceAndLayers("walk-route");
  };

  const handlePinMarkerClick = (coords: [number, number]) => {
    clearRoute();
    if (userLocation) {
      const fixedStartLocation: [number, number] = [...userLocation];
      getRouteWithFixedLocation(fixedStartLocation, coords);
    } else {
      if (!navigator.geolocation)
        return alert("이 브라우저는 위치 서비스를 지원하지 않습니다.");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          const fixedStartLocation: [number, number] = [...userCoords];
          setUserLocation(userCoords);
          setTimeout(
            () => getRouteWithFixedLocation(fixedStartLocation, coords),
            100
          );
        },
        (error) => {
          alert(
            `위치 서비스 오류: ${error.message}\n\n해결방법:\n1. 브라우저 설정에서 위치 권한 허용\n2. 페이지 새로고침`
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  const handleARButtonClick = () => {
    if (!closestMarker) return;
    setSelectedMarkerData({
      coords: [closestMarker.lng, closestMarker.lat],
      title: closestMarker.title,
      description: closestMarker.description,
      imageUrl: CONFIG.markerImageUrl,
      id: closestMarker.title,
    });
    setIsARActive(true);
    setDisabledMarkerTitles((prev) => [...prev, closestMarker.title]);
    setClosestMarker(null);
  };

  const handleCloseAR = () => {
    setIsARActive(false);
    setSelectedMarkerData(null);
  };

  const handleClusterClick = (event: mapboxgl.MapLayerMouseEvent) => {
    if (!map.current) return;
    const features = map.current.queryRenderedFeatures(event.point, {
      layers: ["clusters"],
    }) as MapboxGeoJSONFeature[];
    if (!features.length) return;
    const props = features[0].properties as any;
    const clusterId = props.cluster_id as number;
    const pointCount = props.point_count as number;
    const coordinates = (features[0].geometry as any).coordinates.slice();

    (map.current.getSource("markers") as any).getClusterExpansionZoom(
      clusterId,
      (err: any, zoom: number) => {
        if (err) return;
        const shouldZoom = window.confirm(
          `클러스터에 ${pointCount}개의 마커가 있습니다.\n확대하시겠습니까?`
        );
        if (shouldZoom) map.current!.easeTo({ center: coordinates, zoom });
      }
    );
  };

  const updateDOMMarkers = () => {
    if (!map.current?.getSource("markers")) return;
    try {
      const features =
        (map.current.querySourceFeatures(
          "markers"
        ) as MapboxGeoJSONFeature[]) || [];
      const singlePoints = features.filter(
        (f) => !(f.properties as any).point_count
      );

      const newKeys = new Set<string>();

      singlePoints.forEach((feature) => {
        const coordArr = (feature.geometry as any).coordinates as [
          number,
          number
        ];
        const key = coordKey(coordArr);
        const title = ((feature.properties as any)?.title as string) || "";

        const visuallyDisabled =
          isWalkModeRef.current && disabledTitlesRef.current.includes(title);
        const interactive = isWalkModeRef.current && !visuallyDisabled;

        newKeys.add(key);

        const existing = domMarkerMap.current.get(key);
        if (!existing) {
          const el = document.createElement("div");
          const root = createRoot(el);
          root.render(
            <PinMarker
              imageUrl={CONFIG.markerImageUrl}
              disabled={visuallyDisabled}
              interactive={interactive}
              onClick={() => handlePinMarkerClick(coordArr)}
            />
          );
          const marker = new mapboxgl.Marker(el)
            .setLngLat(coordArr as LngLatLike)
            .addTo(map.current!);
          domMarkerMap.current.set(key, {
            marker,
            root,
            disabled: visuallyDisabled,
            interactive,
            title,
          });
        } else {
          if (
            existing.disabled !== visuallyDisabled ||
            existing.interactive !== interactive
          ) {
            existing.root.render(
              <PinMarker
                imageUrl={CONFIG.markerImageUrl}
                disabled={visuallyDisabled}
                interactive={interactive}
                onClick={() => handlePinMarkerClick(coordArr)}
              />
            );
            existing.disabled = visuallyDisabled;
            existing.interactive = interactive;
          }
        }
      });

      Array.from(domMarkerMap.current.keys()).forEach((k) => {
        if (!newKeys.has(k)) {
          const rec = domMarkerMap.current.get(k)!;
          rec.marker.remove();
          rec.root.unmount();
          domMarkerMap.current.delete(k);
        }
      });
    } catch {
      // ignore
    }
  };

  const setupMapLayers = () => {
    if (!map.current) return;
    try {
      safeRemoveSourceAndLayers("markers");

      map.current.addSource("markers", {
        type: "geojson",
        data: createGeojson(),
        cluster: true,
        clusterMaxZoom: 17,
        clusterRadius: 50,
      } as any);

      map.current.addLayer({
        id: "clusters",
        type: "circle",
        source: "markers",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#3A8049",
          "circle-radius": ["step", ["get", "point_count"], 15, 7, 20, 15, 25],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#3A8049",
          "circle-pitch-scale": "viewport",
        },
      });

      map.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "markers",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 12,
          "text-pitch-alignment": "viewport",
          "text-rotation-alignment": "viewport",
        },
        paint: { "text-color": "#fff" },
      });

      map.current.on("click", "clusters", handleClusterClick as any);
      map.current.on(
        "mouseenter",
        "clusters",
        () => (map.current!.getCanvas().style.cursor = "pointer")
      );
      map.current.on(
        "mouseleave",
        "clusters",
        () => (map.current!.getCanvas().style.cursor = "")
      );

      ["move", "zoom", "idle"].forEach((event) => {
        map.current!.on(
          event,
          (scheduleMarkerUpdateRef.current || scheduleMarkerUpdate) as any
        );
      });

      const handleSourceData = (e: any) => {
        if (e.sourceId === "markers" && e.isSourceLoaded)
          scheduleMarkerUpdate();
      };
      map.current.on("sourcedata", handleSourceData);

      // 3D buildings
      const layers = map.current.getStyle().layers || [];
      const labelLayerId = layers.find(
        (layer: any) =>
          layer.type === "symbol" && layer.layout && layer.layout["text-field"]
      )?.id;

      map.current.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          },
        } as any,
        labelLayerId
      );

      scheduleMarkerUpdate();
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="map-container"
      style={{ width: "100%", height: "100vh", position: "relative" }}
    >
      <div
        ref={mapContainer}
        className="mapbox-container"
        style={{ width: "100%", height: "100%" }}
      />
      {!isWalkMode && (
        <button
          onClick={handleExit}
          aria-label="나가기"
          style={{
            position: "absolute",
            top: "calc(16px + env(safe-area-inset-top))",
            left: 16,
            zIndex: 1200,
            height: 36,
            padding: "0 12px",
            borderRadius: 8,
            border: "none",
            background: "#ff2d55",
            color: "#fff",
            fontWeight: 800,
            letterSpacing: 0.2,
            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
            cursor: "pointer",
          }}
        >
          나가기
        </button>
      )}
      {!isWalkMode && (
        <button
          onClick={handleStart}
          aria-label="산책 시작"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 24,
            zIndex: 1200,
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#3A8049",
            color: "#fff",
            border: "none",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: 0.3,
            cursor: "pointer",
          }}
        >
          Start
        </button>
      )}

      {/* AR 버튼 */}
      {showARButton && <ARButton onClick={handleARButtonClick} />}

      {/* 상단 진행 박스 + ⏱️/📏 표시 */}
      {isWalkMode && (
        <div
          style={{
            position: "absolute",
            top: "calc(16px + env(safe-area-inset-top))",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1200,
            width: "min(360px, calc(100% - 32px))",
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "72px 1fr auto",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <button
              onClick={handleGaugeStop}
              style={{
                height: 28,
                borderRadius: 6,
                border: "none",
                background: "#ff2d55",
                color: "#fff",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 0.2,
                cursor: "pointer",
              }}
            >
              종료
            </button>
            <div
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "#333",
                fontWeight: 600,
              }}
            >
              {disabledCount} / {totalMarkerCount} ({disabledPct}%)
            </div>
            <span
              style={{
                padding: "4px 8px",
                borderRadius: 999,
                background: "#E8F5E9",
                color: "#2E7D32",
                fontSize: 11,
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              진행중
            </span>
          </div>

          {/* ⏱️ 시간 · 🚶 거리 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
              fontSize: 12,
              color: "#333",
              fontWeight: 700,
            }}
          >
            <div>⏱ {formatDuration(elapsedSec)}</div>
            <div>🚶 {distanceM} m</div>
            <div>👻 잡은 유령 {defeated}</div>
            <div>⭐ 포인트: {points}</div>
          </div>

          <div
            style={{
              height: 6,
              borderRadius: 999,
              background: "#e9ecef",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${disabledPct}%`,
                height: "100%",
                borderRadius: 999,
                background:
                  disabledPct < 50
                    ? "#3A8049"
                    : disabledPct < 80
                    ? "#FF9800"
                    : "#ff2d55",
                transition: "width 300ms ease",
              }}
            />
          </div>
        </div>
      )}

      <Suspense fallback={null}>
        <SimpleAROverlay
          isActive={isARActive}
          markerData={selectedMarkerData}
          onClose={handleCloseAR}
          onDefeatedDelta={(inc) => setDefeated((prev) => prev + inc)}
          onBonusPoints={(p) => setPoints((prev) => prev + p)}
          onAllGhostsCleared={() => console.log("모두 퇴치!")}
        />
      </Suspense>
    </div>
  );
};

export default Map3D;
