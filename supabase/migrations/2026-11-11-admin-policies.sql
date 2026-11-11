-- Policies de admin ausentes no schema original.
-- Rodar no SQL Editor do Supabase. Idempotente (DROP IF EXISTS antes de cada CREATE).

-- Admin enxerga TODOS os depoimentos (inclusive pendentes)
DROP POLICY IF EXISTS "Allow authenticated read all on testimonials" ON testimonials;
CREATE POLICY "Allow authenticated read all on testimonials"
  ON testimonials FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin pode excluir depoimentos e projetos
DROP POLICY IF EXISTS "Allow authenticated delete on testimonials" ON testimonials;
CREATE POLICY "Allow authenticated delete on testimonials"
  ON testimonials FOR DELETE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated delete on projects" ON projects;
CREATE POLICY "Allow authenticated delete on projects"
  ON projects FOR DELETE
  USING (auth.role() = 'authenticated');

-- Admin pode atualizar/remover arquivos do bucket project-images
DROP POLICY IF EXISTS "Allow authenticated update project images" ON storage.objects;
CREATE POLICY "Allow authenticated update project images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated delete project images" ON storage.objects;
CREATE POLICY "Allow authenticated delete project images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');
