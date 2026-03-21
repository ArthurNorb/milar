# Milar Arquitetura

Portfolio and lead-generation website for architect Giovanna Lima, focusing on neuroarchitecture and minimalist design.

## Features

- **Home Page**: Hero section, about, testimonials
- **Portfolio**: Editorial grid of projects with masonry layout
- **Curriculum**: Education, experience, and skills timeline
- **Budget Simulator**: Multi‑step form with mock authentication and API integration
- **Responsive Design**: Mobile‑first, Tailwind CSS
- **UI Components**: Shadcn/ui with custom neutral palette
- **WhatsApp Integration**: Floating contact button
- **Editorial Typography**: Playfair Display headings, Inter body

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn/ui (Base UI)
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Inter, Playfair Display)
- **Backend**: Next.js API Routes (simulated Supabase/Resend)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your keys (optional for simulation)
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── api/simulacao/         # Budget simulation endpoint
├── portfolio/             # Portfolio page
├── curriculum/            # CV page
├── simulador/             # Multi‑step simulator
├── layout.tsx             # Root layout with fonts, header, footer
├── page.tsx               # Home page
components/
├── layout/                # Header, Footer
├── ui/                    # Shadcn components
public/                    # Static assets
```

## Design Guidelines

- **Colors**: Neutral palette (whites, off‑whites, soft stones, deep charcoal)
- **Typography**: Playfair Display for headings, Inter for body
- **Layout**: Asymmetric grids, abundant whitespace, large image placeholders
- **Inspiration**: Yellowtrace, Casa de Valentina

## Future Enhancements

- Integrate Supabase Auth and database
- Connect Resend for email notifications
- Add a blog/news section
- Implement dark/light mode toggle
- Add project filtering by category

## License

Proprietary – All rights reserved.
