import { Request, Response, Router } from "express";
import { z } from "zod";
import { Trip, SyncTripsRequest } from "@shared/api";

const companionSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  age: z.number().optional(),
  relationship: z.string().optional(),
});

const tripSchema = z.object({
  id: z.string(),
  tripNumber: z.number().int().nonnegative(),
  origin: z.string().min(1),
  originLat: z.number().optional(),
  originLng: z.number().optional(),
  destination: z.string().min(1),
  destinationLat: z.number().optional(),
  destinationLng: z.number().optional(),
  mode: z.enum([
    "walk",
    "bicycle",
    "two_wheeler",
    "car",
    "bus",
    "metro_train",
    "auto_taxi",
    "rideshare",
    "other",
  ]),
  departureTime: z.string(),
  companions: z.array(companionSchema),
  consentGiven: z.boolean(),
  notes: z.string().optional(),
  createdAt: z.string(),
  syncedAt: z.string().optional(),
});

const syncTripsRequestSchema = z.object({
  trips: z.array(tripSchema),
});

// Simple in-memory store. Replace with DB as needed.
const tripsStore = new Map<string, Trip>();

function upsertTrip(trip: z.infer<typeof tripSchema>) {
  const stored: Trip = { ...trip, syncedAt: new Date().toISOString() } as Trip;
  tripsStore.set(trip.id, stored);
}

export function registerTripsRoutes(app: Router) {
  app.get("/api/trips", (_req: Request, res: Response) => {
    const trips = Array.from(tripsStore.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    res.json({ trips });
  });

  app.get("/api/trips/:id", (req: Request, res: Response) => {
    const t = tripsStore.get(req.params.id);
    if (!t) return res.status(404).json({ message: "Not found" });
    res.json(t);
  });

  app.post("/api/trips", (req: Request, res: Response) => {
    const parsed = tripSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });
    }
    upsertTrip(parsed.data as any);
    return res.status(201).json({ success: true, id: (parsed.data as any).id });
  });

  app.post("/api/trips/bulk", (req: Request, res: Response) => {
    const parsed = syncTripsRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });
    }
    const syncedIds: string[] = [];
    for (const t of parsed.data.trips) {
      upsertTrip(t);
      syncedIds.push(t.id);
    }
    return res.json({ success: true, syncedIds });
  });

  app.delete("/api/trips/:id", (req: Request, res: Response) => {
    const existed = tripsStore.delete(req.params.id);
    if (!existed) return res.status(404).json({ message: "Not found" });
    res.json({ success: true });
  });
}
