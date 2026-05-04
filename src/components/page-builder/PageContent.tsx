import { useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import BlockRenderer from "./BlockRenderer";
import { Block } from "./blockSchema";
import PageBuilderSlot from "./PageBuilderSlot";

interface Props {
  pageKey: string;
  children: ReactNode;
}

/**
 * Renders the saved "full" page-builder blocks if they exist for this pageKey,
 * otherwise renders the original hardcoded children with before/after slots.
 */
const PageContent = ({ pageKey, children }: Props) => {
  const [fullBlocks, setFullBlocks] = useState<Block[] | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    supabase
      .from("page_blocks")
      .select("blocks")
      .eq("page_key", pageKey)
      .eq("position", "full")
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        const blocks = (data?.blocks as unknown as Block[]) || [];
        setFullBlocks(blocks.length > 0 ? blocks : null);
        setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [pageKey]);

  if (!loaded) return <div className="min-h-[60vh]" />;

  if (fullBlocks) {
    return (
      <>
        {fullBlocks.map((b) => (
          <BlockRenderer key={b.id} block={b} />
        ))}
      </>
    );
  }

  return (
    <>
      <PageBuilderSlot pageKey={pageKey} position="before" />
      {children}
      <PageBuilderSlot pageKey={pageKey} position="after" />
    </>
  );
};

export default PageContent;
