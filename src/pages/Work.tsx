/**
 * GRAVEN - Work Page
 * Project portfolio showcase
 */

import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { Card, CardTitle, CardDescription, CardContent, CardFooter, Button } from '../components/ui/index.ts';
import { Navbar, Footer } from '../components/layout/index.ts';

interface Project {
  id: string;
  title: string;
  category: 'industrial' | 'product' | 'architectural' | 'transport' | 'medical';
  description: string;
  image: string;
  specs: [string, string][];
  featured: boolean;
}

const PROJECTS: Project[] = [
  {
    id: 'precision-actuator',
    title: 'Precision Linear Actuator',
    category: 'industrial',
    description: 'Complete drawing set for a high-precision linear actuator used in semiconductor manufacturing. 12 sheets including assembly, detail, and BOM.',
    image: '/projects/actuator-hero.jpg',
    specs: [['SHEETS', '12'], ['TOLERANCE', '±0.005mm'], ['MATERIAL', '440C SS'], ['STATUS', 'Released']],
    featured: true,
  },
  {
    id: 'medical-device-housing',
    title: 'Medical Device Housing',
    category: 'medical',
    description: 'ISO 13485 compliant documentation for Class II medical device enclosure. Includes DFM analysis and mold flow simulation.',
    image: '/projects/medical-housing.jpg',
    specs: [['SHEETS', '8'], ['STANDARD', 'ISO 13485'], ['PROCESS', 'Injection Mold'], ['STATUS', 'In Review']],
    featured: true,
  },
  {
    id: 'consumer-audio',
    title: 'Premium Audio Chassis',
    category: 'product',
    description: 'Aluminum unibody chassis for high-end headphone amplifier. CNC machining drawings with anodization specs.',
    image: '/projects/audio-chassis.jpg',
    specs: [['SHEETS', '6'], ['MATERIAL', '6061-T6 Al'], ['FINISH', 'Type II Anodize'], ['STATUS', 'Production']],
    featured: false,
  },
  {
    id: 'structural-steel',
    title: 'Pedestrian Bridge Structure',
    category: 'architectural',
    description: 'AISC 360 compliant structural drawings for 40m pedestrian bridge. Connection details, camber, and erection sequence.',
    image: '/projects/bridge.jpg',
    specs: [['SHEETS', '18'], ['STANDARD', 'AISC 360'], ['GRADE', 'A992 Gr.50'], ['STATUS', 'Permit Set']],
    featured: true,
  },
  {
    id: 'ev-battery-pack',
    title: 'EV Battery Module',
    category: 'transport',
    description: 'Thermal management and structural drawings for 400V battery module. Includes busbar, cooling plate, and BMS integration.',
    image: '/projects/battery-pack.jpg',
    specs: [['SHEETS', '15'], ['VOLTAGE', '400V'], ['CAPACITY', '85 kWh'], ['STATUS', 'Prototype']],
    featured: true,
  },
  {
    id: 'robotics-arm',
    title: '6-Axis Robot Arm',
    category: 'industrial',
    description: 'Complete kinematic and structural documentation for collaborative robot arm. Harmonic drive integration and cable management.',
    image: '/projects/robot-arm.jpg',
    specs: [['SHEETS', '22'], ['PAYLOAD', '5 kg'], ['REACH', '900 mm'], ['STATUS', 'Development']],
    featured: false,
  },
];

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'product', label: 'Product' },
  { value: 'architectural', label: 'Architectural' },
  { value: 'transport', label: 'Transport' },
  { value: 'medical', label: 'Medical' },
] as const;

export default function Work() {
  const [activeCategory, setActiveCategory] = useState<'all' | Project['category']>('all');

  const filteredProjects = activeCategory === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      <main className="pt-32 pb-20 px-4 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-16 animate-blur-fade-up">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--color-fg-muted)] mb-4">
              SELECTED WORK
            </p>
            <h1 className="text-5xl font-light leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl">
              Projects drawn<br />before built.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-white/60 sm:text-lg">
              A selection of drawing sets delivered across industrial, medical, consumer, and architectural sectors.
              Each project begins as a blank sheet and ends as manufacturing-ready documentation.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-12 animate-blur-fade-up" style={{ animationDelay: '200ms' }} role="tablist">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value as typeof activeCategory)}
                role="tab"
                aria-selected={activeCategory === cat.value}
                className={clsx(
                  'px-4 py-2 rounded-full text-sm font-mono tracking-[0.15em] transition-all duration-200',
                  activeCategory === cat.value
                    ? 'bg-[var(--color-cta-bg)] text-[var(--color-cta-fg)]'
                    : 'bg-[var(--color-bg-elevated)] text-white/70 hover:text-white hover:bg-white/5'
                )}
                style={{ animationDelay: `${300 + i * 50}ms` }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, i) => (
              <Card
                key={project.id}
                variant="outlined"
                hover
                padding="none"
                className="animate-blur-fade-up overflow-hidden"
                style={{ animationDelay: `${400 + i * 100}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    src={project.image}
                    alt={project.title}
                  />
                  {project.featured && (
                    <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.15em] bg-[var(--color-cta-bg)] text-[var(--color-cta-fg)] rounded">
                      Featured
                    </span>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                      {project.category.toUpperCase()}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-3">{project.description}</CardDescription>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.specs.map(([k, v]) => (
                      <span key={k} className="font-mono text-[10px] text-white/50">
                        <span className="text-[var(--color-fg-muted)]">{k}</span> {v}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="px-6 pb-6 pt-0 border-t border-[var(--color-border)]">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/work/${project.id}`} className="flex items-center gap-1">
                      View Details
                      <ChevronRight size={14} strokeWidth={1.5} />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20 text-white/50">
              No projects found in this category.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { useState } from 'react';