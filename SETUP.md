# Configuração do Supabase — Milar Arquitetura

## 1. Projeto Supabase

1. Crie um projeto no [Supabase Dashboard](https://supabase.com/dashboard).
2. Copie a URL do projeto e a chave `anon`.
3. Copie `.env.example` para `.env.local` e preencha:

   ```text
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
   SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key   # só para o seed; nunca exponha no cliente
   ```

## 2. Banco de dados

1. No **SQL Editor**, rode todo o conteúdo de `supabase-schema.sql`.
2. Em bancos já existentes, rode também as migrations de `supabase/migrations/` em ordem de data.
   A migration `2026-11-11-admin-policies.sql` é necessária para o admin ver depoimentos pendentes
   e excluir depoimentos, projetos e imagens.

## 3. Autenticação

1. **Authentication → Providers**: mantenha **Email** habilitado.
2. **Authentication → Users**: crie o usuário da Giovanna (e-mail + senha segura).

## 4. Storage

O schema cria o bucket público `project-images`. Confirme em **Storage → Buckets**.

## 5. Seed (opcional)

```bash
npm run seed
```

Insere projetos e depoimentos de exemplo usando a service role (lê `.env.local`).

## 6. Painel admin

1. Acesse `/admin` e entre com o usuário criado.
2. Em `/admin/dashboard` gerencie:
   - **Portfólio**: cadastrar, editar, excluir e reordenar projetos (a primeira foto é a capa)
   - **Depoimentos**: aprovar ou excluir envios pendentes

## 7. Páginas públicas

- `/` — depoimentos aprovados + formulário de envio
- `/portfolio` — projetos paginados
- `/sitemap.xml` e `/robots.txt` — gerados automaticamente (defina `NEXT_PUBLIC_SITE_URL` em produção)

## 8. Solução de problemas

- **Admin não vê depoimentos pendentes / não consegue excluir**: rode a migration `2026-11-11-admin-policies.sql`.
- **Erro de upload**: verifique policies do bucket `project-images` e CORS no Storage.
- **Variáveis de ambiente**: reinicie `npm run dev` após alterar `.env.local`.
