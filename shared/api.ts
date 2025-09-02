/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export type TripMode =
  | "walk"
  | "bicycle"
  | "two_wheeler"
  | "car"
  | "bus"
  | "metro_train"
  | "auto_taxi"
  | "rideshare"
  | "other";

export interface Companion {
  id: string;
  name?: string;
  age?: number;
  relationship?: string;
}

export interface Trip {
  id: string;
  tripNumber: number;
  origin: string;
  originLat?: number;
  originLng?: number;
  destination: string;
  destinationLat?: number;
  destinationLng?: number;
  mode: TripMode;
  departureTime: string; // ISO string
  companions: Companion[];
  consentGiven: boolean;
  notes?: string;
  createdAt: string; // ISO
  syncedAt?: string; // ISO when successfully synced to server
}

export interface SyncTripsRequest {
  trips: Trip[];
}

export interface SyncTripsResponse {
  success: boolean;
  syncedIds: string[];
  message?: string;
}

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}
