import { supabase } from '../lib/supabase'

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
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()

    if (error) {
      console.error(`Error inserting project ${project.title}:`, error)
    } else {
      console.log(`Inserted project: ${project.title}`)
    }
  }
}

async function seedTestimonials() {
  const testimonials = [
    {
      client_name: 'Fernando',
      text: '“A casa tem um abraço. Não é só decoração, tem toda uma ciência por trás.”',
      is_approved: true,
    },
    {
      client_name: 'Mariana',
      text: '“O clima mudou muito, o ambiente é muito mais relaxante. Valeu cada centavo.”',
      is_approved: true,
    },
  ]

  for (const testimonial of testimonials) {
    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonial)
      .select()

    if (error) {
      console.error(`Error inserting testimonial from ${testimonial.client_name}:`, error)
    } else {
      console.log(`Inserted testimonial: ${testimonial.client_name}`)
    }
  }
}

async function main() {
  console.log('Starting seed...')

  await seedProjects()
  await seedTestimonials()

  console.log('Seed completed!')
}

main().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})