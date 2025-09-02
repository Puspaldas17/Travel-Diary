import { useEffect, useMemo, useState } from "react";
import { Trip, TripMode, Companion } from "@shared/api";
import { nextTripNumber, saveTrip } from "@/lib/trips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Clock, MapPin, Route, Users, Sparkles } from "lucide-react";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const modes: { value: TripMode; label: string }[] = [
  { value: "walk", label: "Walk" },
  { value: "bicycle", label: "Bicycle" },
  { value: "two_wheeler", label: "Two-wheeler" },
  { value: "car", label: "Car" },
  { value: "bus", label: "Bus" },
  { value: "metro_train", label: "Metro / Train" },
  { value: "auto_taxi", label: "Auto / Taxi" },
  { value: "rideshare", label: "Rideshare" },
  { value: "other", label: "Other" },
];

export default function Index() {
  const [tripNumber, setTripNumber] = useState(1);
  const [origin, setOrigin] = useState("");
  const [originLat, setOriginLat] = useState<number | undefined>(undefined);
  const [originLng, setOriginLng] = useState<number | undefined>(undefined);
  const [destination, setDestination] = useState("");
  const [destinationLat, setDestinationLat] = useState<number | undefined>(
    undefined,
  );
  const [destinationLng, setDestinationLng] = useState<number | undefined>(
    undefined,
  );
  const [mode, setMode] = useState<TripMode>("walk");
  const [departureTime, setDepartureTime] = useState<string>("");
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [consent, setConsent] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setTripNumber(nextTripNumber());
    setDepartureTime(new Date().toISOString().slice(0, 16));
  }, []);

  const canSubmit = useMemo(() => {
    return (
      consent &&
      origin.trim().length > 0 &&
      destination.trim().length > 0 &&
      departureTime
    );
  }, [consent, origin, destination, departureTime]);

  const useCurrentAsOrigin = () => {
    if (!navigator.geolocation) {
      toast("Location not supported on this device");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin("Current location");
        setOriginLat(pos.coords.latitude);
        setOriginLng(pos.coords.longitude);
        toast.success("Origin detected");
      },
      () => toast.info("Unable to detect location"),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const useCurrentAsDestination = () => {
    if (!navigator.geolocation) {
      toast("Location not supported on this device");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDestination("Current location");
        setDestinationLat(pos.coords.latitude);
        setDestinationLng(pos.coords.longitude);
        toast.success("Destination detected");
      },
      () => toast.info("Unable to detect location"),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const addCompanion = () => {
    setCompanions((c) => [
      ...c,
      { id: uid(), name: "", age: undefined, relationship: "" },
    ]);
  };

  const updateCompanion = (id: string, patch: Partial<Companion>) => {
    setCompanions((cs) =>
      cs.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  };

  const removeCompanion = (id: string) => {
    setCompanions((cs) => cs.filter((c) => c.id !== id));
  };

  const setNow = () => {
    setDepartureTime(new Date().toISOString().slice(0, 16));
  };

  const submit = async () => {
    if (!canSubmit) return;
    const trip: Trip = {
      id: uid(),
      tripNumber,
      origin,
      originLat,
      originLng,
      destination,
      destinationLat,
      destinationLng,
      mode,
      departureTime: new Date(departureTime).toISOString(),
      companions: companions.map((c) => ({
        ...c,
        age: c.age ? Number(c.age) : undefined,
      })),
      consentGiven: consent,
      notes,
      createdAt: new Date().toISOString(),
    };

    saveTrip(trip);
    toast.success("Saved locally");

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trip),
      });
      if (res.ok) {
        toast.success("Synced with server");
      } else {
        toast.info("Server unavailable, will sync later");
      }
    } catch {
      toast.info("Offline or server error, will sync later");
    }

    setTripNumber((n) => n + 1);
    setOrigin("");
    setOriginLat(undefined);
    setOriginLng(undefined);
    setDestination("");
    setDestinationLat(undefined);
    setDestinationLng(undefined);
    setMode("walk");
    setDepartureTime(new Date().toISOString().slice(0, 16));
    setCompanions([]);
    setConsent(false);
    setNotes("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary">
      <section className="container pt-8 pb-4">
        <div className="rounded-2xl bg-card border p-6 md:p-10 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                NATPAC Travel Diary
              </h1>
              <p className="text-muted-foreground max-w-prose">
                Capture trip details like origin, time, mode, destination and
                accompanying travellers. Your consent is required. Data is
                stored locally and can be synced to the server for planning
                purposes.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 text-sm">
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
                  <Sparkles className="h-4 w-4" /> Auto-detect location
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
                  <Clock className="h-4 w-4" /> Quick time set
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
                  <Users className="h-4 w-4" /> Companions
                </span>
              </div>
            </div>
            <div className="flex-1">
              <img
                src="/placeholder.svg"
                alt="Travel"
                className="w-full h-44 md:h-56 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" /> Capture Trip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Trip Number
                </label>
                <Input
                  type="number"
                  value={tripNumber}
                  onChange={(e) => setTripNumber(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Departure Time
                </label>
                <div className="flex gap-2">
                  <Input
                    type="datetime-local"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                  />
                  <Button type="button" variant="secondary" onClick={setNow}>
                    Now
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Origin
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Address or place"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={useCurrentAsOrigin}
                  >
                    Use GPS
                  </Button>
                </div>
                {originLat !== undefined && originLng !== undefined && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Lat: {originLat.toFixed(6)}, Lng: {originLng.toFixed(6)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Destination
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Address or place"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={useCurrentAsDestination}
                  >
                    Use GPS
                  </Button>
                </div>
                {destinationLat !== undefined &&
                  destinationLng !== undefined && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Lat: {destinationLat.toFixed(6)}, Lng:{" "}
                      {destinationLng.toFixed(6)}
                    </p>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mode</label>
                <Select
                  value={mode}
                  onValueChange={(v) => setMode(v as TripMode)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {modes.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <Input
                  placeholder="Optional notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" /> Accompanying Travellers
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCompanion}
                >
                  Add
                </Button>
              </div>
              <div className="space-y-3">
                {companions.map((c) => (
                  <div key={c.id} className="grid gap-2 md:grid-cols-12">
                    <Input
                      className="md:col-span-4"
                      placeholder="Name"
                      value={c.name ?? ""}
                      onChange={(e) =>
                        updateCompanion(c.id, { name: e.target.value })
                      }
                    />
                    <Input
                      className="md:col-span-2"
                      placeholder="Age"
                      type="number"
                      value={c.age ?? ""}
                      onChange={(e) =>
                        updateCompanion(c.id, { age: Number(e.target.value) })
                      }
                    />
                    <Input
                      className="md:col-span-4"
                      placeholder="Relationship"
                      value={c.relationship ?? ""}
                      onChange={(e) =>
                        updateCompanion(c.id, { relationship: e.target.value })
                      }
                    />
                    <Button
                      className="md:col-span-2"
                      variant="outline"
                      type="button"
                      onClick={() => removeCompanion(c.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {!companions.length && (
                  <p className="text-xs text-muted-foreground">
                    Add companions if any are traveling with you.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(v) => setConsent(!!v)}
              />
              <label
                htmlFor="consent"
                className="text-sm leading-tight text-muted-foreground"
              >
                I consent to the collection of this trip information for
                transportation planning. Location access may be used to
                auto-fill origin/destination. Data can be synced to the server.
              </label>
            </div>

            <div className="mt-6">
              <Button size="lg" onClick={submit} disabled={!canSubmit}>
                Save Trip
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
