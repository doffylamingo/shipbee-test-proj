-- Create storage bucket for attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for attachments bucket
CREATE POLICY "Anyone can upload attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'attachments');

CREATE POLICY "Anyone can view attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'attachments');

CREATE POLICY "Anyone can update their attachments"
ON storage.objects FOR UPDATE
USING (bucket_id = 'attachments');

CREATE POLICY "Anyone can delete their attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'attachments');