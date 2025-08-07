export interface Area {
  area_id: number;
  area_code: string;
  sido: string;
  sigungu: string;
  eupmyeondong: string;
  ri: string | null;
}

export function getSidoList(areaData: Area[]): string[] {
  const rawSidoList = areaData.map((item) => item.sido);
  const uniqueSet = new Set(rawSidoList);
  return Array.from(uniqueSet).sort();
}

export function getSigunguList(
  areaData: Area[],
  selectedSido: string
): string[] {
  const filtered = areaData.filter((item) => item.sido === selectedSido);
  const rawSigunguList = filtered.map((item) => item.sigungu);
  const uniqueSet = new Set(rawSigunguList);
  return Array.from(uniqueSet).sort();
}

export function getEupmyeondongList(
  areaData: Area[],
  selectedSido: string,
  selectedSigungu: string
): string[] {
  const filtered = areaData.filter(
    (item) => item.sido === selectedSido && item.sigungu === selectedSigungu
  );
  const rawEupList = filtered.map((item) => item.eupmyeondong);
  const uniqueSet = new Set(rawEupList);
  return Array.from(uniqueSet).sort();
}

export function getAreaCode(
  areaData: Area[],
  sido: string,
  sigungu: string,
  eupmyeondong: string
): string | undefined {
  const matches = areaData.filter(
    (item) =>
      item.sido === sido &&
      item.sigungu === sigungu &&
      item.eupmyeondong === eupmyeondong
  );

  if (matches.length === 0) return undefined;

  // area_code는 문자열이지만 숫자처럼 정렬되므로 compare 가능
  const sorted = matches.sort((a, b) => a.area_code.localeCompare(b.area_code));

  return sorted[0].area_code;
}
