import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import BlockRenderer from "./BlockRenderer";
import { Block } from "./blockSchema";

interface Props {
  pageKey: string;
  position: "before" | "after";
}

const PageBuilderSlot = ({ pageKey, position }: Props) => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("page_blocks")
        .select("blocks")
        .eq("page_key", pageKey)
        .eq("position", position)
        .maybeSingle();
      if (data?.blocks) setBlocks(data.blocks as unknown as Block[]);
    };
    load();
  }, [pageKey, position]);

  if (blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </>
  );
};

export default PageBuilderSlot;