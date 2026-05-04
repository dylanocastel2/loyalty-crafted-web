import { useCallback, useEffect, useRef, useState } from "react";
import { Block } from "@/components/page-builder/blockSchema";

/**
 * Tracks history of block arrays to support undo/redo.
 * Pass the current blocks; the hook records changes coming from outside
 * (i.e. not from undo/redo itself) into a stack.
 */
export function useBlockHistory(
  blocks: Block[],
  setBlocks: (b: Block[]) => void,
  resetKey?: string,
) {
  const past = useRef<Block[][]>([]);
  const future = useRef<Block[][]>([]);
  const isTimeTraveling = useRef(false);
  const lastSnapshot = useRef<string>(JSON.stringify(blocks));
  const [, force] = useState(0);
  const rerender = useCallback(() => force((n) => n + 1), []);

  // Reset history when switching pages/slots
  useEffect(() => {
    past.current = [];
    future.current = [];
    lastSnapshot.current = JSON.stringify(blocks);
    rerender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    const snap = JSON.stringify(blocks);
    if (snap === lastSnapshot.current) return;
    if (isTimeTraveling.current) {
      isTimeTraveling.current = false;
      lastSnapshot.current = snap;
      return;
    }
    past.current.push(JSON.parse(lastSnapshot.current));
    if (past.current.length > 100) past.current.shift();
    future.current = [];
    lastSnapshot.current = snap;
    rerender();
  }, [blocks, rerender]);

  const undo = useCallback(() => {
    if (past.current.length === 0) return;
    const prev = past.current.pop()!;
    future.current.push(JSON.parse(lastSnapshot.current));
    isTimeTraveling.current = true;
    lastSnapshot.current = JSON.stringify(prev);
    setBlocks(prev);
    rerender();
  }, [setBlocks, rerender]);

  const redo = useCallback(() => {
    if (future.current.length === 0) return;
    const next = future.current.pop()!;
    past.current.push(JSON.parse(lastSnapshot.current));
    isTimeTraveling.current = true;
    lastSnapshot.current = JSON.stringify(next);
    setBlocks(next);
    rerender();
  }, [setBlocks, rerender]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      const meta = e.ctrlKey || e.metaKey;
      if (!meta) return;
      if (e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.key.toLowerCase() === "z" && e.shiftKey) || e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  return {
    undo,
    redo,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
  };
}