import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import BlockRenderer from "@/components/page-builder/BlockRenderer";
import { Block } from "@/components/page-builder/blockSchema";
import NotFound from "./NotFound";

interface PageData {
  id: string;
  title: string;
  slug: string;
  blocks: Block[];
  published: boolean;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
}

interface CustomPageProps {
  slug?: string;
}

const CustomPage = ({ slug: slugProp }: CustomPageProps = {}) => {
  const params = useParams<{ slug: string }>();
  const slug = slugProp ?? params.slug;
  const { isAdmin, loading: authLoading } = useAuth();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("custom_pages").select("*").eq("slug", slug!).maybeSingle();
      if (data) setPage(data as unknown as PageData);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  if (loading || authLoading) {
    return <Layout><div className="container py-24 text-center text-muted-foreground">Laden...</div></Layout>;
  }

  if (!page || (!page.published && !isAdmin)) {
    return <NotFound />;
  }

  const metaTitle = page.meta_title || page.title;
  const metaDesc = page.meta_description || "";
  const ogTitle = page.og_title || metaTitle;
  const ogDesc = page.og_description || metaDesc;

  return (
    <Layout>
      <Helmet>
        <title>{metaTitle}</title>
        {metaDesc && <meta name="description" content={metaDesc} />}
        {page.meta_keywords && <meta name="keywords" content={page.meta_keywords} />}
        {page.canonical_url && <link rel="canonical" href={page.canonical_url} />}
        <meta property="og:title" content={ogTitle} />
        {ogDesc && <meta property="og:description" content={ogDesc} />}
        {page.og_image_url && <meta property="og:image" content={page.og_image_url} />}
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {!page.published && isAdmin && (
        <div className="bg-muted border-b text-foreground text-sm py-2 text-center">
          Concept — alleen zichtbaar voor beheerders
        </div>
      )}

      {page.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </Layout>
  );
};

export default CustomPage;
