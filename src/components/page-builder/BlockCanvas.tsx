import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block, BlockType, createBlock, getBlockMeta, safeUUID } from "./blockSchema";
import BlockRenderer from "./BlockRenderer";
import { GripVertical, Trash2, Copy, Plus, ClipboardCopy, ClipboardPaste, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const CLIPBOARD_KEY = "lovable:pageBuilder:clipboard";

const reassignIds = (b: Block) => {
  b.id = safeUUID();
  if (b.children) b.children.forEach((col) => col.forEach(reassignIds));
};

const writeClipboard = (block: Block) => {
  try {
    const copy: Block = JSON.parse(JSON.stringify(block));
    localStorage.setItem(CLIPBOARD_KEY, JSON.stringify(copy));
    window.dispatchEvent(new Event("lovable-pb-clipboard"));
  } catch {}
};

const readClipboard = (): Block | null => {
  try {
    const raw = localStorage.getItem(CLIPBOARD_KEY);
    if (!raw) return null;
    const b = JSON.parse(raw) as Block;
    if (!b || !b.type) return null;
    reassignIds(b);
    return b;
  } catch {
    return null;
  }
};

interface Props {
  blocks: Block[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onChange: (blocks: Block[]) => void;
}

// Helpers to mutate nested structure by id
const findBlockPath = (
  blocks: Block[],
  id: string,
  path: number[] = []
): { path: number[]; parentChildren: Block[]; idx: number } | null => {
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.id === id) return { path: [...path, i], parentChildren: blocks, idx: i };
    if (b.children) {
      for (let c = 0; c < b.children.length; c++) {
        const found = findBlockPath(b.children[c], id, [...path, i, c]);
        if (found) return found;
      }
    }
  }
  return null;
};

const cloneBlocks = (b: Block[]): Block[] => JSON.parse(JSON.stringify(b));

const moveBlockById = (blocks: Block[], id: string, dir: -1 | 1): Block[] => {
  const next = cloneBlocks(blocks);
  const helper = (arr: Block[]): boolean => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        const j = i + dir;
        if (j < 0 || j >= arr.length) return true;
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
        return true;
      }
      if (arr[i].children) for (const col of arr[i].children!) if (helper(col)) return true;
    }
    return false;
  };
  helper(next);
  return next;
};

const removeBlockById = (blocks: Block[], id: string): Block[] => {
  const next = cloneBlocks(blocks);
  const helper = (arr: Block[]): boolean => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) { arr.splice(i, 1); return true; }
      if (arr[i].children) {
        for (const col of arr[i].children!) {
          if (helper(col)) return true;
        }
      }
    }
    return false;
  };
  helper(next);
  return next;
};

const duplicateBlockById = (blocks: Block[], id: string): Block[] => {
  const next = cloneBlocks(blocks);
  const reassignIds = (b: Block) => {
    b.id = safeUUID();
    if (b.children) b.children.forEach((col) => col.forEach(reassignIds));
  };
  const helper = (arr: Block[]): boolean => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        const copy: Block = JSON.parse(JSON.stringify(arr[i]));
        reassignIds(copy);
        arr.splice(i + 1, 0, copy);
        return true;
      }
      if (arr[i].children) for (const col of arr[i].children!) if (helper(col)) return true;
    }
    return false;
  };
  helper(next);
  return next;
};

const updateBlockPropsById = (blocks: Block[], id: string, props: Record<string, any>): Block[] => {
  const next = cloneBlocks(blocks);
  const helper = (arr: Block[]) => {
    for (const b of arr) {
      if (b.id === id) {
        b.props = props;
        // sync children count if columns changed on a row
        if (b.type === "row") {
          const want = props.columns || 2;
          const cur = b.children?.length || 0;
          if (want > cur) {
            b.children = [...(b.children || []), ...Array.from({ length: want - cur }, () => [] as Block[])];
          } else if (want < cur) {
            // merge overflow into last kept column
            const keep = b.children!.slice(0, want);
            const overflow = b.children!.slice(want).flat();
            keep[want - 1] = [...keep[want - 1], ...overflow];
            b.children = keep;
          }
        }
        return true;
      }
      if (b.children) for (const col of b.children) if (helper(col)) return true;
    }
    return false;
  };
  helper(next);
  return next;
};

const addBlockToContainer = (
  blocks: Block[],
  container: { kind: "root" } | { kind: "column"; rowId: string; col: number },
  block: Block
): Block[] => {
  const next = cloneBlocks(blocks);
  if (container.kind === "root") {
    next.push(block);
    return next;
  }
  const helper = (arr: Block[]): boolean => {
    for (const b of arr) {
      if (b.id === container.rowId && b.children) {
        if (!b.children[container.col]) b.children[container.col] = [];
        b.children[container.col].push(block);
        return true;
      }
      if (b.children) for (const col of b.children) if (helper(col)) return true;
    }
    return false;
  };
  helper(next);
  return next;
};

// Get the parent array containing a given id (for sortable reordering inside one container)
const getSiblings = (blocks: Block[], id: string): { siblings: Block[] } | null => {
  const helper = (arr: Block[]): { siblings: Block[] } | null => {
    for (const b of arr) {
      if (b.id === id) return { siblings: arr };
      if (b.children) for (const col of b.children) {
        const r = helper(col);
        if (r) return r;
      }
    }
    return null;
  };
  return helper(blocks);
};

interface ItemActionsProps {
  block: Block;
  onDelete: () => void;
  onDuplicate: () => void;
  onCopy: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  attributes: any;
  listeners: any;
}
const ItemHeader = ({ block, onDelete, onDuplicate, onCopy, onMoveUp, onMoveDown, canMoveUp, canMoveDown, attributes, listeners, isSelected }: ItemActionsProps & { isSelected: boolean }) => {
  const meta = getBlockMeta(block.type);
  return (
    <div className={`flex items-center justify-between px-3 py-1.5 border-b text-xs ${isSelected ? "bg-primary/10" : "bg-muted/40"}`}>
      <div className="flex items-center gap-2">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-0.5" onClick={(e) => e.stopPropagation()}>
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <span className="font-medium">{meta?.label || block.type}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-6 w-6" title="Omhoog" disabled={!canMoveUp} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onMoveUp(); }}>
          <ArrowUp className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" title="Omlaag" disabled={!canMoveDown} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onMoveDown(); }}>
          <ArrowDown className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" title="Kopieer naar klembord (voor plakken op andere pagina)" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onCopy(); }}>
          <ClipboardCopy className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" title="Dupliceren" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
          <Copy className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

interface SortableItemProps {
  block: Block;
  isSelected: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onCopy: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  index: number;
  total: number;
  onAddToColumn: (rowId: string, col: number, type: BlockType) => void;
  onPasteToColumn: (rowId: string, col: number) => void;
  hasClipboard: boolean;
}

const SortableItem = (props: SortableItemProps) => {
  const { block, isSelected, selectedId, onSelect, onDelete, onDuplicate, onCopy, onMove, index, total, onAddToColumn, onPasteToColumn, hasClipboard } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isRow = block.type === "row";
  const cols = block.props.columns || 2;
  const children = block.children || [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => { e.stopPropagation(); onSelect(block.id); }}
      className={`relative border-2 rounded-lg overflow-hidden bg-background transition-all ${
        isSelected ? "border-primary shadow-md" : "border-border hover:border-primary/40"
      }`}
    >
      <ItemHeader
        block={block}
        onDelete={() => onDelete(block.id)}
        onDuplicate={() => onDuplicate(block.id)}
        onCopy={() => onCopy(block.id)}
        onMoveUp={() => onMove(block.id, -1)}
        onMoveDown={() => onMove(block.id, 1)}
        canMoveUp={index > 0}
        canMoveDown={index < total - 1}
        attributes={attributes}
        listeners={listeners}
        isSelected={isSelected}
      />
      {isRow ? (
        <div className="p-3">
          <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: cols }).map((_, ci) => (
              <ColumnDroppable
                key={ci}
                rowId={block.id}
                colIndex={ci}
                items={children[ci] || []}
                selectedId={selectedId}
                onSelect={onSelect}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onCopy={onCopy}
                onMove={onMove}
                onAddToColumn={onAddToColumn}
                onPasteToColumn={onPasteToColumn}
                hasClipboard={hasClipboard}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="pointer-events-none">
          <BlockRenderer block={block} />
        </div>
      )}
    </div>
  );
};

const QUICK_ADD: { type: BlockType; label: string }[] = [
  { type: "heading", label: "Koptekst" },
  { type: "paragraph", label: "Tekst" },
  { type: "image", label: "Afbeelding" },
  { type: "button", label: "Knop" },
  { type: "icon_card", label: "Icoon-kaart" },
  { type: "stat", label: "Statistiek" },
];

const ColumnDroppable = ({ rowId, colIndex, items, selectedId, onSelect, onDelete, onDuplicate, onCopy, onMove, onAddToColumn, onPasteToColumn, hasClipboard }: any) => {
  const { setNodeRef, isOver } = useDroppable({ id: `col:${rowId}:${colIndex}` });
  const [pickerOpen, setPickerOpen] = useState(false);
  return (
    <div ref={setNodeRef} className={`min-h-[80px] rounded border-2 border-dashed p-2 transition-colors ${isOver ? "border-primary bg-primary/5" : "border-border/50"}`}>
      <SortableContext items={items.map((b: Block) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((b: Block, idx: number) => (
            <SortableItem
              key={b.id}
              block={b}
              isSelected={selectedId === b.id}
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onCopy={onCopy}
              onMove={onMove}
              index={idx}
              total={items.length}
              onAddToColumn={onAddToColumn}
              onPasteToColumn={onPasteToColumn}
              hasClipboard={hasClipboard}
            />
          ))}
        </div>
      </SortableContext>
      <div className="mt-2 flex items-center gap-1">
        {pickerOpen ? (
          <Select onValueChange={(v) => { onAddToColumn(rowId, colIndex, v as BlockType); setPickerOpen(false); }}>
            <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Kies blok..." /></SelectTrigger>
            <SelectContent>
              {QUICK_ADD.map((q) => <SelectItem key={q.type} value={q.type}>{q.label}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : (
          <>
            <Button variant="ghost" size="sm" className="h-7 text-xs flex-1" onClick={(e) => { e.stopPropagation(); setPickerOpen(true); }}>
              <Plus className="h-3 w-3 mr-1" /> Blok in kolom {colIndex + 1}
            </Button>
            {hasClipboard && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                title="Plak gekopieerd blok"
                onClick={(e) => { e.stopPropagation(); onPasteToColumn(rowId, colIndex); }}
              >
                <ClipboardPaste className="h-3 w-3 mr-1" /> Plak
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const BlockCanvas = ({ blocks, selectedId, onSelect, onChange }: Props) => {
  const { toast } = useToast();
  const [hasClipboard, setHasClipboard] = useState<boolean>(() => {
    try { return !!localStorage.getItem(CLIPBOARD_KEY); } catch { return false; }
  });
  useEffect(() => {
    const refresh = () => {
      try { setHasClipboard(!!localStorage.getItem(CLIPBOARD_KEY)); } catch {}
    };
    window.addEventListener("storage", refresh);
    window.addEventListener("lovable-pb-clipboard", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("lovable-pb-clipboard", refresh);
    };
  }, []);

  const handleCopy = (id: string) => {
    const b = getById(blocks, id);
    if (!b) return;
    writeClipboard(b);
    setHasClipboard(true);
    toast({ title: "Blok gekopieerd", description: "Plak het op een andere pagina via de plak-knop." });
  };
  const handlePasteRoot = () => {
    const b = readClipboard();
    if (!b) return;
    onChange([...blocks, b]);
    onSelect(b.id);
  };
  const handlePasteToColumn = (rowId: string, col: number) => {
    const b = readClipboard();
    if (!b) return;
    onChange(addBlockToContainer(blocks, { kind: "column", rowId, col }, b));
    onSelect(b.id);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    // If the dragged block no longer exists (e.g. it was deleted during the drag), bail out
    if (!getById(blocks, activeId)) return;

    // Reorder within same siblings array
    const activeSibs = getSiblings(blocks, activeId);
    const overSibs = overId.startsWith("col:") ? null : getSiblings(blocks, overId);

    if (activeSibs && overSibs && activeSibs.siblings === overSibs.siblings) {
      const oldIdx = activeSibs.siblings.findIndex((b) => b.id === activeId);
      const newIdx = overSibs.siblings.findIndex((b) => b.id === overId);
      // We need to map this reorder back into the structure
      const next = cloneBlocks(blocks);
      const sibsRef = getSiblings(next, activeId)!.siblings;
      const reordered = arrayMove(sibsRef, oldIdx, newIdx);
      // mutate in place
      sibsRef.length = 0;
      reordered.forEach((b) => sibsRef.push(b));
      onChange(next);
      return;
    }

    // Drop into a different container (column or root)
    let target: { kind: "root" } | { kind: "column"; rowId: string; col: number } | null = null;
    if (overId.startsWith("col:")) {
      const [, rowId, colStr] = overId.split(":");
      target = { kind: "column", rowId, col: parseInt(colStr) };
    } else if (overSibs) {
      // dropped onto a sibling in another container — use that container
      // find parent container of overId
      const parent = findContainerOf(blocks, overId);
      if (parent) target = parent;
    }
    if (!target) return;

    // Remove from old, add to new
    const removed = removeBlockById(blocks, activeId);
    // Find the actual block to move
    const movedBlock = getById(blocks, activeId);
    if (!movedBlock) return;
    const added = addBlockToContainer(removed, target, movedBlock);
    onChange(added);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        {blocks.length === 0 ? (
          <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground space-y-3">
            <p className="font-medium mb-1">Nog geen blokken</p>
            <p className="text-sm">Klik op een blok in de bibliotheek links om te beginnen</p>
            {hasClipboard && (
              <Button variant="outline" size="sm" onClick={handlePasteRoot}>
                <ClipboardPaste className="h-3 w-3 mr-1" /> Plak gekopieerd blok
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {hasClipboard && (
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handlePasteRoot}>
                  <ClipboardPaste className="h-3 w-3 mr-1" /> Plak gekopieerd blok hier
                </Button>
              </div>
            )}
            {blocks.map((block, idx) => (
              <SortableItem
                key={block.id}
                block={block}
                isSelected={selectedId === block.id}
                selectedId={selectedId}
                onSelect={onSelect}
                onDelete={(id) => onChange(removeBlockById(blocks, id))}
                onDuplicate={(id) => onChange(duplicateBlockById(blocks, id))}
                onCopy={handleCopy}
                onMove={(id, dir) => onChange(moveBlockById(blocks, id, dir))}
                index={idx}
                total={blocks.length}
                onAddToColumn={(rowId, col, type) => {
                  const block = createBlock(type);
                  onChange(addBlockToContainer(blocks, { kind: "column", rowId, col }, block));
                  onSelect(block.id);
                }}
                onPasteToColumn={handlePasteToColumn}
                hasClipboard={hasClipboard}
              />
            ))}
          </div>
        )}
      </SortableContext>
    </DndContext>
  );
};

// Helpers exported via module scope
const getById = (blocks: Block[], id: string): Block | null => {
  for (const b of blocks) {
    if (b.id === id) return b;
    if (b.children) for (const col of b.children) {
      const r = getById(col, id);
      if (r) return r;
    }
  }
  return null;
};

const findContainerOf = (
  blocks: Block[],
  id: string,
  parent: { kind: "root" } | { kind: "column"; rowId: string; col: number } = { kind: "root" }
): { kind: "root" } | { kind: "column"; rowId: string; col: number } | null => {
  for (const b of blocks) {
    if (b.id === id) return parent;
    if (b.children) {
      for (let c = 0; c < b.children.length; c++) {
        const r = findContainerOf(b.children[c], id, { kind: "column", rowId: b.id, col: c });
        if (r) return r;
      }
    }
  }
  return null;
};

export default BlockCanvas;
export { updateBlockPropsById, removeBlockById, duplicateBlockById, addBlockToContainer, getById };
