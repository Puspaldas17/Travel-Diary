import { Companion } from "@shared/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  companions: Companion[];
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<Companion>) => void;
  onRemove: (id: string) => void;
}

export default function CompanionsEditor({
  companions,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Accompanying Travellers</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
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
              onChange={(e) => onUpdate(c.id, { name: e.target.value })}
            />
            <Input
              className="md:col-span-2"
              placeholder="Age"
              type="number"
              value={c.age ?? ""}
              onChange={(e) => onUpdate(c.id, { age: Number(e.target.value) })}
            />
            <Input
              className="md:col-span-4"
              placeholder="Relationship"
              value={c.relationship ?? ""}
              onChange={(e) => onUpdate(c.id, { relationship: e.target.value })}
            />
            <Button
              className="md:col-span-2"
              variant="outline"
              type="button"
              onClick={() => onRemove(c.id)}
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
  );
}
