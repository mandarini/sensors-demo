export interface MotionMessage {
  username: string;
  type: string;
  x?: number;
  y?: number;
  z?: number;
  rot?: number;
  alpha?: number;
  beta?: number;
  gamma?: number;
  light?: number;
  quaternion?: number[];
  proximity?: any;
}
