// Uso: npm run seed  (carrega .env.local via tsx --env-file)
// Usa a service role para ignorar RLS — nunca exponha essa chave no cliente.
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error(
    'Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local'
  )
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
})

async function seedProjects() {
  const projects = [
    {
      title: 'Casa Manga Beiras',
      description: 'Gerar conexão, equilíbrio e tranquilidade para uma família grande com rotina intensa. Cores e linhas moldando o comportamento.',
      image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      tags: ['Residencial', 'Neuroarquitetura', 'Família'],
    },
    {
      title: 'Apto GG',
      description: 'Sala e cozinha conjugadas para interação. Elementos que geram conforto emocional e mantêm memórias afetivas. Escritório flexível com foco em neuroarquitetura para alta produtividade.',
      image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      tags: ['Apartamento', 'Interiores', 'Home Office'],
    },
  ]

  for (const project of projects) {
    const { error } = await supabase
      .from('projects')
      .insert({ ...project, image_urls: [project.image_url] })

    if (error) {
      console.error(`Erro ao inserir projeto ${project.title}:`, error)
    } else {
      console.log(`Projeto inserido: ${project.title}`)
    }
  }
}

async function seedTestimonials() {
  const testimonials = [
    {
      client_name: 'Fernando',
      text: 'A casa tem um abraço. Não é só decoração, tem toda uma ciência por trás.',
      is_approved: true,
    },
    {
      client_name: 'Mariana',
      text: 'O clima mudou muito, o ambiente é muito mais relaxante. Valeu cada centavo.',
      is_approved: true,
    },
  ]

  for (const testimonial of testimonials) {
    const { error } = await supabase.from('testimonials').insert(testimonial)

    if (error) {
      console.error(`Erro ao inserir depoimento de ${testimonial.client_name}:`, error)
    } else {
      console.log(`Depoimento inserido: ${testimonial.client_name}`)
    }
  }
}

async function main() {
  console.log('Iniciando seed...')

  await seedProjects()
  await seedTestimonials()

  console.log('Seed concluído!')
}

main().catch((error) => {
  console.error('Seed falhou:', error)
  process.exit(1)
})
