# Supabase CMS Setup for Milar Arquitetura

## 1. Supabase Project Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. Note your Project URL and `anon` public key.
3. Update `.env.local` with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## 2. Database Schema

Run the SQL from `supabase-schema.sql` in the Supabase SQL Editor:

1. In Supabase Dashboard, go to **SQL Editor**.
2. Copy the entire content of `supabase-schema.sql`.
3. Paste and run the SQL to create tables, enable RLS, and create storage bucket.

## 3. Authentication Setup

1. In Supabase Dashboard, go to **Authentication** → **Providers**.
2. Ensure **Email** provider is enabled.
3. Go to **Authentication** → **Users** and create a new user for Giovanna:
   - Email: her email address
   - Password: choose a secure password
   - No email confirmation required for simplicity (or enable email confirmation if needed).

## 4. Storage Configuration

The SQL already creates a bucket `project-images` with public read access. Verify it exists:

1. Go to **Storage** → **Buckets**.
2. You should see `project-images` bucket.
3. Ensure the bucket is public (policies are set).

## 5. Seed Database with Existing Data

Run the seed script to insert the existing portfolio projects, curriculum data, and testimonials:

```bash
npm run seed
```

This will populate the database with the hardcoded data from the original website.

## 6. Admin Login

1. Visit `/admin` on your website.
2. Login with the credentials created in step 3.
3. You'll be redirected to `/admin/dashboard` where you can manage:
   - Portfolio projects (add new ones with images)
   - Testimonials (approve/reject pending submissions)
   - Curriculum items and CV PDF upload

## 7. Public Pages

The following pages now fetch data from Supabase:
- `/portfolio` - displays projects from database
- `/curriculum` - displays education, experience, skills + CV download button
- Home page testimonials section - shows only approved testimonials + submission form

## 8. Adding Tags to Projects

The projects table includes a `tags` column (text array). When adding new projects via the admin dashboard, you can add tags as a comma-separated list (feature to be implemented).

## 9. Troubleshooting

- **Authentication errors**: Ensure RLS policies reference `auth.role()` correctly. You may need to adjust policies if using custom roles.
- **Storage upload errors**: Check bucket permissions and CORS settings in Supabase Storage.
- **Environment variables**: Ensure `.env.local` is loaded (Next.js requires restart after changes).