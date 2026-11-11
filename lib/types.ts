export interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  image_urls: string[] | null;
  tags: string[] | null;
  display_order: number | null;
  created_at: string;
}

export interface Testimonial {
  id: number;
  client_name: string;
  text: string;
  is_approved: boolean;
  created_at: string;
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  cover_image_url: string;
  content_html: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
