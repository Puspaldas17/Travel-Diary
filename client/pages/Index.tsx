import Hero from "@/components/trips/Hero";
import TripForm from "@/components/trips/TripForm";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary">
      <Hero />
      <section className="container pb-16">
        <TripForm />
      </section>
    </div>
  );
}
