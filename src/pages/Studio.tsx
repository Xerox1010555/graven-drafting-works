/**
 * GRAVEN - Studio Page
 * About the studio, team, history, and values
 */

import { MapPin, Mail, Phone, Calendar, Award, Users, Building2, Target } from 'lucide-react';
import { clsx } from 'clsx';
import { Card, CardContent } from '../components/ui/index.ts';
import { Navbar, Footer } from '../components/layout/index.ts';
import { SITE_CONFIG, SOCIAL_LINKS } from '../data/index.ts';

const TEAM = [
  {
    name: 'Elias Vorn',
    role: 'Founder / Principal Draughtsman',
    bio: '20+ years in precision mechanical drafting. Former lead at ASML and Zeiss. Specialist in GD&T, tolerance analysis, and semiconductor tooling.',
    image: '/team/elias.jpg',
    linkedin: 'https://linkedin.com/in/eliasvorn',
  },
  {
    name: 'Mara Kovic',
    role: 'Senior Mechanical Designer',
    bio: 'Ex-SpaceX and Boston Dynamics. Expert in aerospace-grade documentation, ASME Y14.5, and additive manufacturing workflows.',
    image: '/team/mara.jpg',
    linkedin: 'https://linkedin.com/in/marakovic',
  },
  {
    name: 'Dr. Arne Sjøberg',
    role: 'Structural Engineering Lead',
    bio: 'PhD in Structural Mechanics. AISC 360 and Eurocode 3 authority. Bridges, towers, and seismic-resistant structures.',
    image: '/team/arne.jpg',
    linkedin: 'https://linkedin.com/in/arnesjoberg',
  },
  {
    name: 'Sofia Reyes',
    role: 'Medical Device Documentation Specialist',
    bio: 'ISO 13485 and FDA 21 CFR Part 820 compliance. Class I–III device drawing sets. Risk management and traceability expert.',
    image: '/team/sofia.jpg',
    linkedin: 'https://linkedin.com/in/sofiareyes',
  },
];

const VALUES = [
  {
    icon: Target,
    title: 'Precision as Practice',
    description: 'We don\'t approximate. Every dimension, tolerance, and note is deliberate. The drawing is the contract.',
  },
  {
    icon: Users,
    title: 'Collaborative Rigor',
    description: 'We work with your engineers, not for them. Early involvement prevents costly redesigns downstream.',
  },
  {
    icon: Award,
    title: 'Standards as Baseline',
    description: 'ASME, ISO, AISC, API, AWS — we meet the code so you don\'t have to interpret it.',
  },
  {
    icon: Building2,
    title: 'Manufacturing Reality',
    description: 'Drawings that can\'t be made are drawings that fail. DFM is not a phase — it\'s our mindset.',
  },
];

const MILESTONES = [
  { year: '2018', title: 'Founded', description: 'GRAVEN established in Rotterdam by Elias Vorn after 15 years in high-tech OEM drafting.' },
  { year: '2019', title: 'First Medical Device Client', description: 'ISO 13485 certification achieved. Entered regulated medical device market.' },
  { year: '2020', title: 'Aerospace Expansion', description: 'Mara Kovic joins. AS9100 alignment. SpaceX and Boeing tier-1 suppliers onboarded.' },
  { year: '2021', title: 'Structural Division', description: 'Dr. Arne Sjøberg joins. AISC 360 / Eurocode 3 capabilities added. Infrastructure projects begin.' },
  { year: '2022', title: 'Digital Twin Integration', description: 'Model-based definition (MBD) workflow implemented. 3D PDF and STEP 242 delivery standard.' },
  { year: '2023', title: '100th Drawing Set Released', description: 'Cumulative 2,400+ sheets delivered across 4 continents. Zero field failures attributed to documentation.' },
  { year: '2024', title: 'North American Studio', description: 'Boston office opened. ITAR registration. Defense and aerospace capacity doubled.' },
];

export default function Studio() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      <main className="pt-32 pb-20 px-4 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-20 animate-blur-fade-up">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--color-fg-muted)] mb-4">
              THE STUDIO
            </p>
            <h1 className="text-5xl font-light leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl">
              Drawn before<br />it's built.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-white/60 sm:text-lg">
              GRAVEN is a drafting studio for objects that don't exist yet. We transform intent into
              manufacturing-ready documentation — precise, traceable, and standards-compliant.
            </p>
          </div>

          {/* Values */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-12 animate-blur-fade-up">
              <div className="rule flex-1" />
              <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--color-fg-muted)] whitespace-nowrap">
                VALUES
              </span>
              <div className="rule flex-1" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((value, i) => (
                <Card key={value.title} variant="outlined" hover padding="lg" className="animate-blur-fade-up" style={{ animationDelay: `${200 + i * 100}ms` }}>
                  <value.icon size={28} strokeWidth={1.5} className="text-[var(--color-accent)] mb-4" />
                  <h3 className="text-lg font-light tracking-tight text-white mb-2">{value.title}</h3>
                  <p className="text-white/60 text-sm">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-12 animate-blur-fade-up">
              <div className="rule flex-1" />
              <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--color-fg-muted)] whitespace-nowrap">
                TEAM
              </span>
              <div className="rule flex-1" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TEAM.map((member, i) => (
                <Card key={member.name} variant="outlined" padding="none" className="animate-blur-fade-up overflow-hidden" style={{ animationDelay: `${400 + i * 100}ms` }}>
                  <div className="aspect-square relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-light tracking-tight text-white">{member.name}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)] mt-1">{member.role}</p>
                    <p className="mt-3 text-sm text-white/60 line-clamp-3">{member.bio}</p>
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-mono uppercase tracking-[0.15em] text-[var(--color-accent)] hover:text-white transition-colors">
                        LinkedIn
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-12 animate-blur-fade-up">
              <div className="rule flex-1" />
              <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--color-fg-muted)] whitespace-nowrap">
                HISTORY
              </span>
              <div className="rule flex-1" />
            </div>

            <div className="space-y-6">
              {MILESTONES.map((milestone, i) => (
                <div key={milestone.year} className="flex gap-6 animate-blur-fade-up" style={{ animationDelay: `${600 + i * 80}ms` }}>
                  <div className="flex-shrink-0 w-24 text-right">
                    <p className="font-mono text-2xl font-light text-white/10">{milestone.year}</p>
                  </div>
                  <div className="flex-1 border-l border-[var(--color-border)] pl-6">
                    <h3 className="text-lg font-light tracking-tight text-white">{milestone.title}</h3>
                    <p className="mt-1 text-white/60 text-sm">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="animate-blur-fade-up" style={{ animationDelay: '900ms' }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="rule flex-1" />
              <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--color-fg-muted)] whitespace-nowrap">
                CONTACT
              </span>
              <div className="rule flex-1" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card variant="outlined" padding="lg" className="text-center">
                <MapPin size={28} strokeWidth={1.5} className="text-[var(--color-accent)] mx-auto mb-3" />
                <h3 className="text-lg font-light tracking-tight text-white mb-1">Locations</h3>
                <p className="text-white/60 text-sm">Rotterdam, NL · Boston, US</p>
              </Card>

              <Card variant="outlined" padding="lg" className="text-center">
                <Mail size={28} strokeWidth={1.5} className="text-[var(--color-accent)] mx-auto mb-3" />
                <h3 className="text-lg font-light tracking-tight text-white mb-1">Email</h3>
                <a href={SOCIAL_LINKS.email} className="text-white/60 text-sm hover:text-white transition-colors">{SITE_CONFIG.contactEmail}</a>
              </Card>

              <Card variant="outlined" padding="lg" className="text-center">
                <Calendar size={28} strokeWidth={1.5} className="text-[var(--color-accent)] mx-auto mb-3" />
                <h3 className="text-lg font-light tracking-tight text-white mb-1">Availability</h3>
                <p className="text-white/60 text-sm">Mon–Fri, 09:00–18:00 CET/EST</p>
              </Card>

              <Card variant="outlined" padding="lg" className="text-center">
                <Phone size={28} strokeWidth={1.5} className="text-[var(--color-accent)] mx-auto mb-3" />
                <h3 className="text-lg font-light tracking-tight text-white mb-1">Response Time</h3>
                <p className="text-white/60 text-sm">Within 24 hours</p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}