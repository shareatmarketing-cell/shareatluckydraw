-- Create storage bucket for reward images
INSERT INTO storage.buckets (id, name, public)
VALUES ('reward-images', 'reward-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view reward images (public bucket)
CREATE POLICY "Anyone can view reward images"
ON storage.objects FOR SELECT
USING (bucket_id = 'reward-images');

-- Allow authenticated users to upload reward images
CREATE POLICY "Authenticated users can upload reward images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'reward-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update reward images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'reward-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete reward images
CREATE POLICY "Authenticated users can delete reward images"
ON storage.objects FOR DELETE
USING (bucket_id = 'reward-images' AND auth.role() = 'authenticated');