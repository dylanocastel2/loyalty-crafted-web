import { BLOCK_META, BlockType } from "./blockSchema";
import * as Icons from "lucide-react";

interface Props {
  onAdd: (type: BlockType) => void;
}

const categories: Array<"Basis" | "Layout" | "Content" | "Geavanceerd"> = ["Basis", "Layout", "Content", "Geavanceerd"];

const BlockLibrary = ({ onAdd }: Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-sm mb-1">Blokbibliotheek</h3>
        <p className="text-xs text-muted-foreground">Klik op een blok om toe te voegen</p>
      </div>
      {categories.map((cat) => (
        <div key={cat}>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat}</h4>
          <div className="grid grid-cols-2 gap-2">
            {BLOCK_META.filter((b) => b.category === cat).map((b) => {
              const Icon = (Icons as any)[b.icon] || Icons.Square;
              return (
                <button
                  key={b.type}
                  type="button"
                  onClick={() => onAdd(b.type)}
                  className="flex flex-col items-center gap-1.5 p-3 border rounded-md bg-card hover:border-primary hover:bg-primary/5 transition-colors text-center"
                  title={`Voeg ${b.label} toe`}
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-[11px] font-medium leading-tight">{b.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlockLibrary;
