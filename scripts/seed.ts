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

async function seedCurriculum() {
  const curriculumItems = [
    // Education
    {
      type: 'education',
      title: 'UFOP - Universidade Federal de Ouro Preto',
      description: 'Bacharelado em Arquitetura e Urbanismo',
      start_year: 2016,
      end_year: 2021,
    },
    {
      type: 'education',
      title: 'IPOG - Instituto de Pós-Graduação e Graduação',
      description: 'Gestão da Qualidade e Master em Neuroarquitetura',
      start_year: 2023,
      end_year: 2024,
    },
    // Experience
    {
      type: 'experience',
      title: 'Milar Arquitetura',
      description: 'Arquiteta Autônoma',
      start_year: 2021,
      end_year: null, // ongoing
    },
    {
      type: 'experience',
      title: 'Atmos Construtora',
      description: 'Arquiteta',
      start_year: 2025,
      end_year: 2025,
    },
    {
      type: 'experience',
      title: 'Leroy Merlin',
      description: 'Arquiteta',
      start_year: 2022,
      end_year: 2025,
    },
    // Skills (as individual items)
    ...[
      'AutoCAD',
      'Sketchup',
      'Archicad',
      'Enscape',
      'Pacote Adobe',
      'Revit',
      'Lumion',
      'Project Management',
      'Neurociência Aplicada',
      'Design de Interiores',
    ].map(skill => ({
      type: 'skill' as const,
      title: skill,
      description: null,
      start_year: null,
      end_year: null,
    })),
  ]

  for (const item of curriculumItems) {
    const { data, error } = await supabase
      .from('curriculum')
      .insert(item)
      .select()

    if (error) {
      console.error(`Error inserting curriculum item ${item.title}:`, error)
    } else {
      console.log(`Inserted curriculum item: ${item.title}`)
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
  await seedCurriculum()
  await seedTestimonials()

  console.log('Seed completed!')
}

main().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})