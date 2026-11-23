import { SLOT_CAPACITY, SLOT_MINUTES, getSlots } from "@/data/slots";

export function slotsPerWindow() {
  const sample = getSlots(new Date(2026, 10, 22, 8, 0))[0];
  return { capacity: sample?.capacity ?? SLOT_CAPACITY, minutes: SLOT_MINUTES };
}
