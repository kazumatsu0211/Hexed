export type HeartState = "filled" | "empty";

export function buildHeartStates(hp: number, maxHp: number): HeartState[] {
  return Array.from({ length: maxHp }, (_, i) => (i < hp ? "filled" : "empty"));
}
