export type ProvinceId = number;

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type AdjacencyMap = Map<ProvinceId, ProvinceId[]>;