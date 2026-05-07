
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('form-uploads', 'form-uploads', true, 10485760, null)
on conflict (id) do update set public = true, file_size_limit = 10485760;

create policy "Anyone can upload form attachments"
on storage.objects for insert to anon, authenticated
with check (bucket_id = 'form-uploads');

create policy "Anyone can read form attachments"
on storage.objects for select to anon, authenticated
using (bucket_id = 'form-uploads');

create policy "Admins can delete form attachments"
on storage.objects for delete to authenticated
using (bucket_id = 'form-uploads' and has_role(auth.uid(), 'admin'::app_role));
