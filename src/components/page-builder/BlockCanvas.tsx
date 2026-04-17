import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block, getBlockMeta } from "./blockSchema";
import BlockRenderer from "./BlockRenderer";
import { GripVertical, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  blocks: Block[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (blocks: Block[]) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

interface ItemProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const SortableItem = ({ block, isSelected, onSelect, onDelete, onDuplicate }: ItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const meta = getBlockMeta(block.type);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`relative border-2 rounded-lg overflow-hidden bg-background transition-all ${
        isSelected ? "border-primary shadow-md" : "border-border hover:border-primary/40"
      }`}
    >
      <div className={`flex items-center justify-between px-3 py-1.5 border-b text-xs ${isSelected ? "bg-primary/10" : "bg-muted/40"}`}>
        <div className="flex items-center gap-2">
          <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-0.5" onClick={(e) => e.stopPropagation()}>
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
          <span className="font-medium">{meta?.label || block.type}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
            <Copy className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="pointer-events-none">
        <BlockRenderer block={block} />
      </div>
    </div>
  );
};

const BlockCanvas = ({ blocks, selectedId, onSelect, onReorder, onDelete, onDuplicate }: Props) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      onReorder(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  if (blocks.length === 0) {
    return (
      <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
        <p className="font-medium mb-1">Nog geen blokken</p>
        <p className="text-sm">Klik op een blok in de bibliotheek links om te beginnen</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {blocks.map((block) => (
            <SortableItem
              key={block.id}
              block={block}
              isSelected={selectedId === block.id}
              onSelect={() => onSelect(block.id)}
              onDelete={() => onDelete(block.id)}
              onDuplicate={() => onDuplicate(block.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default BlockCanvas;
