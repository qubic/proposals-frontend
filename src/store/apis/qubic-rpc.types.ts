export interface TickInfo {
  tick: number
  duration: number
  epoch: number
  initialTick: number
}

export interface GetTickInfoResponse {
  tickInfo: TickInfo
}
