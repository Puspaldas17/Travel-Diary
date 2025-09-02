import { Trip } from "@shared/api";

const KEY = "natpac_trips_v1";

export function getTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Trip[]) : [];
  } catch {
    return [];
  }
}

export function setTrips(trips: Trip[]) {
  localStorage.setItem(KEY, JSON.stringify(trips));
}

export function nextTripNumber(): number {
  const trips = getTrips();
  const max = trips.reduce((m, t) => Math.max(m, t.tripNumber), 0);
  return max + 1;
}

export function saveTrip(trip: Trip) {
  const trips = getTrips();
  const idx = trips.findIndex((t) => t.id === trip.id);
  if (idx >= 0) {
    trips[idx] = trip;
  } else {
    trips.unshift(trip);
  }
  setTrips(trips);
}

export function markSynced(id: string) {
  const trips = getTrips();
  const idx = trips.findIndex((t) => t.id === id);
  if (idx >= 0) {
    trips[idx].syncedAt = new Date().toISOString();
    setTrips(trips);
  }
}

export function removeTrip(id: string) {
  const trips = getTrips().filter((t) => t.id !== id);
  setTrips(trips);
}
