import { useEffect, useState } from "react";

export interface BjdArea {
  sido: string;
  sigungu: string;
  eupmyeondong: string;
  area_code: string;
  area_id: number;
  ri: string;
}

export function useBjdData() {
  const [areaData, setAreaData] = useState<BjdArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreaData = async () => {
      try {
        const module = await import("@/assets/bjdcode/bjd.json");
        const json = module.default as { area: BjdArea[] };
        setAreaData(json.area);
      } catch (error) {
        console.error("법정동 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreaData();
  }, []);

  return { areaData, loading };
}
