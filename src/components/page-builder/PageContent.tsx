import { useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import BlockRenderer from "./BlockRenderer";
import { Block } from "./blockSchema";
import PageBuilderSlot from "./PageBuilderSlot";

interface Props {
  pageKey: string;
  children: ReactNode;
}

interface SeoRow {
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
}

/**
 * Renders the saved "full" page-builder blocks if they exist for this pageKey,
 * otherwise renders the original hardcoded children with before/after slots.
 */
const PageContent = ({ pageKey, children }: Props) => {
  const [fullBlocks, setFullBlocks] = useState<Block[] | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [seo, setSeo] = useState<SeoRow | null>(null);

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

  useEffect(() => {
    let active = true;
    supabase
      .from("page_seo")
      .select("meta_title,meta_description,meta_keywords,og_title,og_description,og_image_url,canonical_url")
      .eq("page_key", pageKey)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data) setSeo(data as SeoRow);
      });
    return () => { active = false; };
  }, [pageKey]);

  if (!loaded) return <div className="min-h-[60vh]" />;

  const seoTags = seo && (
    <Helmet>
      {seo.meta_title && <title>{seo.meta_title}</title>}
      {seo.meta_description && <meta name="description" content={seo.meta_description} />}
      {seo.meta_keywords && <meta name="keywords" content={seo.meta_keywords} />}
      {seo.canonical_url && <link rel="canonical" href={seo.canonical_url} />}
      {(seo.og_title || seo.meta_title) && (
        <meta property="og:title" content={seo.og_title || seo.meta_title || ""} />
      )}
      {(seo.og_description || seo.meta_description) && (
        <meta property="og:description" content={seo.og_description || seo.meta_description || ""} />
      )}
      {seo.og_image_url && <meta property="og:image" content={seo.og_image_url} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );

  if (fullBlocks) {
    return (
      <>
        {seoTags}
        {fullBlocks.map((b) => (
          <BlockRenderer key={b.id} block={b} pageKey={pageKey} />
        ))}
      </>
    );
  }

  return (
    <>
      {seoTags}
      <PageBuilderSlot pageKey={pageKey} position="before" />
      {children}
      <PageBuilderSlot pageKey={pageKey} position="after" />
    </>
  );
};

export default PageContent;
