'use client'

import { useState } from 'react'
import PortfolioManager from './portfolio-manager'
import TestimonialsManager from './testimonials-manager'
import CurriculumManager from './curriculum-manager'

type Tab = 'portfolio' | 'testimonials' | 'curriculum'

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('portfolio')

  return (
    <div className="container max-w-screen-2xl px-4 md:px-6 py-8">
      <div className="flex flex-col space-y-8">
        <div className="border-b border-border/40">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`py-3 px-1 border-b-2 transition-colors ${activeTab === 'portfolio'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              Portfólio
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`py-3 px-1 border-b-2 transition-colors ${activeTab === 'testimonials'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              Depoimentos
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`py-3 px-1 border-b-2 transition-colors ${activeTab === 'curriculum'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              Currículo
            </button>
          </nav>
        </div>

        <div>
          {activeTab === 'portfolio' && <PortfolioManager />}
          {activeTab === 'testimonials' && <TestimonialsManager />}
          {activeTab === 'curriculum' && <CurriculumManager />}
        </div>
      </div>
    </div>
  )
}