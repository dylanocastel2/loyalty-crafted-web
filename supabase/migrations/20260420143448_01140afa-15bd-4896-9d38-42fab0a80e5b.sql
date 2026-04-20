-- Table for extra blocks attached to built-in pages (hybrid editing)
CREATE TABLE public.page_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL,
  position TEXT NOT NULL DEFAULT 'after',
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT page_blocks_position_check CHECK (position IN ('before', 'after')),
  CONSTRAINT page_blocks_unique_slot UNIQUE (page_key, position)
);

ALTER TABLE public.page_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read page blocks"
ON public.page_blocks
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage page blocks"
ON public.page_blocks
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_page_blocks_updated_at
BEFORE UPDATE ON public.page_blocks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_page_blocks_page_key ON public.page_blocks(page_key);