import { cache } from 'react';
import { supabaseConfigured } from '@/lib/env';
import { createPublicClient } from '@/lib/supabase/public';
import type { PortfolioData, Project, SiteSettings } from '@/lib/types';

export const DEFAULT_SETTINGS: SiteSettings = {
  accent: '#0a68e6',
  background_effect: 'aurora',
  show_email: true,
  show_phone: false,
  show_contact_form: true,
  seasonal_themes: true,
  seo_title: null,
  seo_description: null,
  og_image_url: null,
};

const EMPTY: PortfolioData = {
  profile: null,
  skills: [],
  experience: [],
  certifications: [],
  projects: [],
  education: [],
  settings: DEFAULT_SETTINGS,
};

// Published portfolio content, read with the anon key (RLS: is_published rows only).
export const getPortfolio = cache(async (): Promise<PortfolioData> => {
  if (!supabaseConfigured()) return EMPTY;
  const db = createPublicClient();
  const [profile, skills, experience, certifications, projects, education, settings] = await Promise.all([
    db.from('profile').select('*').order('id').limit(1).maybeSingle(),
    db.from('skills').select('*').order('category').order('sort_order'),
    db.from('experience').select('*').order('sort_order').order('start_date', { ascending: false }),
    db.from('certifications').select('*').order('sort_order'),
    db.from('projects').select('*').order('featured', { ascending: false }).order('sort_order'),
    db.from('education').select('*').order('sort_order'),
    db.from('site_settings').select('*').eq('id', 1).maybeSingle(),
  ]);
  return {
    profile: profile.data,
    skills: skills.data ?? [],
    experience: experience.data ?? [],
    certifications: certifications.data ?? [],
    projects: projects.data ?? [],
    education: education.data ?? [],
    settings: { ...DEFAULT_SETTINGS, ...(settings.data ?? {}) },
  };
});

export async function getProject(slug: string): Promise<Project | null> {
  if (!supabaseConfigured()) return null;
  const { data } = await createPublicClient().from('projects').select('*').eq('slug', slug).maybeSingle();
  return data;
}
