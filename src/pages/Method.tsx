/**
 * GRAVEN - Method Page
 * Process and methodology documentation
 */

import { ChevronRight, CheckCircle, Clock, Layers, PenTool, Search, Zap, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { Card, CardContent, Button } from '../components/ui/index.ts';
import { Navbar, Footer } from '../components/layout/index.ts';
import { SITE_CONFIG } from '../data/index.ts';

const STEPS = [
  {
    number: '01',
    title: 'Brief & Discovery',
    description: 'We start by understanding the object — its function, constraints, manufacturing process, and the standards it must meet. Stakeholder interviews, requirement gathering, and feasibility assessment.',
    icon: Search,
    duration: '1–2 weeks',
    deliverables: ['Requirements Specification', 'Feasibility Report', 'Project Plan'],
  },
  {
    number: '02',
    title: 'Concept & Layout',
    description: 'Initial geometry definition — principal views, centerlines, and reference planes. Rough sketches evolve into precise construction geometry. First-angle projection unless specified.',
    icon: PenTool,
    duration: '1–3 weeks',
    deliverables: ['Construction Drawings', 'Layout Sheets', 'Design Review Package'],
  },
  {
    number: '03',
    title: 'Detail Development',
    description: 'Every feature dimensioned, toleranced, and annotated. GD&T per ASME Y14.5 or ISO 1101. Section views, detail views, and exploded assemblies as needed.',
    icon: Layers,
    duration: '2–6 weeks',
    deliverables: ['Detail Drawings', 'GD&T Annotation', 'Stack-up Analysis'],
  },
  {
    number: '04',
    title: 'Review & Verification',
    description: 'Internal check: dimension completeness, tolerance stack-ups, standard compliance, manufacturability. Cross-referenced against BOM and 3D model.',
    icon: Shield,
    duration: '1 week',
    deliverables: ['Check Reports', 'Redline Markups', 'Approval Signatures'],
  },
  {
    number: '05',
    title: 'Release & Handoff',
    description: 'Final PDF/DXF/DWG package with revision control. Native CAD files, STEP/IGES for downstream CAM. Release notes and manufacturing notes included.',
    icon: Zap,
    duration: '2–3 days',
    deliverables: ['Release Package', 'CAD Export', 'Revision History'],
  },
];

const PRINCIPLES = [
  {
    icon: CheckCircle,
    title: 'Precision First',
    description: 'Every line has intent. Dimensions are not suggestions — they are contracts between design and manufacturing.',
  },
  {
    icon: Clock,
    title: 'Traceable Process',
    description: 'Full revision history, check signatures, and change logs. Every drawing can be traced back to its originating requirement.',
  },
  {
    icon: Shield,
    title: 'Standards Compliant',
    description: 'ASME Y14, ISO 128, ISO 1101, AISC 360, ISO 13485. We draw to the standard your industry demands.',
  },
  {
    icon: Zap,
    title: 'Manufacturing Ready',
    description: 'Drawings include all information needed for production: material specs, heat treatment, surface finish, inspection criteria.',
  },
];

const TOOLS = [
  { name: 'SolidWorks', category: 'CAD' },
  { name: 'AutoCAD', category: '2D Drafting' },
  { name: 'CATIA V5', category: 'CAD' },
  { name: 'Creo Parametric', category: 'CAD' },
  { name: 'Onshape', category: 'Cloud CAD' },
  { name: 'GD&T Advisor', category: 'Validation' },
  { name: 'Tolerance Stack', category: 'Analysis' },
  { name: 'PDF/X-4', category: 'Delivery' },
];

export default function Method() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      <main className="pt-32 pb-20 px-4 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-20 animate-blur-fade-up">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--color-fg-muted)] mb-4">
              OUR METHOD
            </p>
            <h1 className="text-5xl font-light leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl">
              How we draw<br />what doesn't exist yet.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-white/60 sm:text-lg">
              A rigorous, repeatable process that takes an intention and produces manufacturing-ready documentation.
              Five phases. Zero ambiguity.
            </p>
          </div>

          {/* Process Steps */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-12 animate-blur-fade-up">
              <div className="rule flex-1" />
              <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--color-fg-muted)] whitespace-nowrap">
                PROCESS
              </span>
              <div className="rule flex-1" />
            </div>

            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <div
                  key={step.number}
                  className={clsx(
                    'flex gap-6 animate-blur-fade-up',
                    i % 2 === 1 && 'flex-row-reverse'
                  )}
                  style={{ animationDelay: `${200 + i * 150}ms` }}
                >
                  <div className={clsx('flex-shrink-0 w-24 text-right', i % 2 === 1 && 'text-left')}>
                    <p className="font-mono text-4xl font-light text-white/10">{step.number}</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)] mt-2">
                      {step.duration}
                    </p>
                  </div>

                  <div className={clsx('flex-1', i % 2 === 1 && 'text-right')}>
                    <div className="flex items-center gap-3 mb-3">
                      <step.icon size={24} strokeWidth={1.5} className="text-[var(--color-accent)]" />
                      <h2 className="text-2xl font-light tracking-tight text-white">{step.title}</h2>
                    </div>
                    <p className="text-white/70 mb-4">{step.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {step.deliverables.map((d, di) => (
                        <span
                          key={d}
                          className={clsx(
                            'px-3 py-1 rounded-full text-xs font-mono tracking-[0.1em] border',
                            i % 2 === 0
                              ? 'border-[var(--color-accent)]/50 text-[var(--color-accent)]'
                              : 'border-white/20 text-white/70'
                          )}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Principles */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-12 animate-blur-fade-up">
              <div className="rule flex-1" />
              <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--color-fg-muted)] whitespace-nowrap">
                PRINCIPLES
              </span>
              <div className="rule flex-1" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PRINCIPLES.map((principle, i) => (
                <Card key={principle.title} variant="outlined" hover padding="lg" className="animate-blur-fade-up" style={{ animationDelay: `${400 + i * 100}ms` }}>
                  <principle.icon size={28} strokeWidth={1.5} className="text-[var(--color-accent)] mb-4" />
                  <h3 className="text-lg font-light tracking-tight text-white mb-2">{principle.title}</h3>
                  <p className="text-white/60 text-sm">{principle.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-12 animate-blur-fade-up">
              <div className="rule flex-1" />
              <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--color-fg-muted)] whitespace-nowrap">
                TOOLCHAIN
              </span>
              <div className="rule flex-1" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {TOOLS.map((tool, i) => (
                <Card key={tool.name} variant="outlined" padding="md" className="animate-blur-fade-up text-center" style={{ animationDelay: `${600 + i * 50}ms` }}>
                  <p className="font-medium text-white">{tool.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)] mt-1">{tool.category}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center animate-blur-fade-up" style={{ animationDelay: '800ms' }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--color-fg-muted)] mb-4">
              READY TO START
            </p>
            <h2 className="text-4xl font-light tracking-tight text-white mb-6">
              Have a project that needs drawing?
            </h2>
            <Button size="lg" asChild>
              <a href="/contact">Start a drawing</a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}