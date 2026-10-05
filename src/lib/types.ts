export type Profile = {
  id: number;
  name: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  email: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  profile_image_url: string | null;
  resume_url: string | null;
  target_role: string | null;
  years_experience: number | null;
  availability: 'open' | 'projects' | 'offers' | 'closed';
};

export type Skill = { id: number; name: string; category: string | null; proficiency_label: string | null; sort_order: number };

export type Experience = {
  id: number;
  company: string;
  title: string;
  location: string | null;
  logo_url: string | null;
  description: string | null;
  start_date: string;
  end_date: string | null;
  current: boolean;
  sort_order: number;
};

export type Certification = {
  id: number;
  name: string;
  issuer: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  credential_url: string | null;
  description: string | null;
};

export type Project = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  technologies: string[];
  featured: boolean;
};

export type Education = { id: number; degree: string; school: string; location: string | null; start_year: number | null; end_year: number | null };

export type SiteSettings = {
  accent: string;
  background_effect: 'aurora' | 'none';
  show_email: boolean;
  show_phone: boolean;
  show_contact_form: boolean;
  seasonal_themes: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
};

export type PortfolioData = {
  profile: Profile | null;
  skills: Skill[];
  experience: Experience[];
  certifications: Certification[];
  projects: Project[];
  education: Education[];
  settings: SiteSettings;
};
