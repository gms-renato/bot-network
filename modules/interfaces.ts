export type BandwidthInterface = {
  download: number;
  unit: string;
  upload: number;
};
export type StatusClientInterface = {
  type: string;
  ip: string;
  name?: string;
  signal: number;
  mac: string;
  active: boolean;
  speed: BandwidthInterface;
};
export type TrafficBandwidthWanOverallInterface = {
  down: number;
  up: number;
};
export type TrafficBandwidthWanInterface = {
  name: string;
  overall: TrafficBandwidthWanOverallInterface;
  details: any;
  conn_id: number;
};
