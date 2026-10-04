// Field definitions for the generic admin editor. Only tables listed here can be
// edited through the admin actions.

export type FieldType = 'text' | 'textarea' | 'url' | 'email' | 'date' | 'number' | 'boolean' | 'tags' | 'select' | 'color';

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
};

export type TableConfig = {
  table: string;
  title: string;
  description: string;
  singleton?: boolean; // one row, no add/delete
  key: string; // primary key column
  titleField: string;
  subtitleField?: string;
  order: { column: string; ascending?: boolean }[];
  fields: Field[];
};

const sortAndVisibility: Field[] = [
  { name: 'sort_order', label: 'Order (lower shows first)', type: 'number' },
  { name: 'is_published', label: 'Visible on the public site', type: 'boolean' },
];

export const TABLES: Record<string, TableConfig> = {
  profile: {
    table: 'profile',
    title: 'Profile',
    description: 'Name, headline, summary and links shown in the hero and About sections.',
    singleton: true,
    key: 'id',
    titleField: 'name',
    order: [{ column: 'id' }],
    fields: [
      { name: 'name', label: 'Full name', type: 'text', required: true },
      { name: 'headline', label: 'Headline', type: 'text' },
      { name: 'bio', label: 'Summary', type: 'textarea' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'email', label: 'Public email', type: 'email' },
      { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
      { name: 'github_url', label: 'GitHub URL', type: 'url' },
      { name: 'profile_image_url', label: 'Profile photo URL', type: 'url', help: 'Upload on the dashboard, then paste the link here.' },
      { name: 'resume_url', label: 'Resume PDF URL', type: 'url', help: 'Upload on the dashboard, then paste the link here.' },
      { name: 'target_role', label: 'Target role', type: 'text' },
      {
        name: 'availability',
        label: 'Availability',
        type: 'select',
        options: [
          { value: 'open', label: 'Open to work (full-time roles)' },
          { value: 'projects', label: 'Open to projects (freelance and side work only)' },
          { value: 'offers', label: 'Open to offers' },
          { value: 'closed', label: 'Not looking' },
        ],
      },
    ],
  },
  profile_private: {
    table: 'profile_private',
    title: 'Private contact',
    description: 'Never shown publicly unless enabled in Settings or revealed by a recruiter share link.',
    singleton: true,
    key: 'profile_id',
    titleField: 'phone',
    order: [{ column: 'profile_id' }],
    fields: [{ name: 'phone', label: 'Phone number', type: 'text' }],
  },
  skills: {
    table: 'skills',
    title: 'Skills',
    description: 'Grouped by category on the public site.',
    key: 'id',
    titleField: 'name',
    subtitleField: 'category',
    order: [{ column: 'category' }, { column: 'sort_order' }],
    fields: [
      { name: 'name', label: 'Skill', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text', help: 'e.g. Cybersecurity, Automation, Infrastructure' },
      {
        name: 'proficiency_label',
        label: 'Proficiency',
        type: 'select',
        options: [
          { value: '', label: 'Not shown' },
          { value: 'Familiar', label: 'Familiar' },
          { value: 'Proficient', label: 'Proficient' },
          { value: 'Expert', label: 'Expert' },
        ],
      },
      ...sortAndVisibility,
    ],
  },
  experience: {
    table: 'experience',
    title: 'Experience',
    description: 'Roles shown on the timeline. Write one bullet per line starting with "- ".',
    key: 'id',
    titleField: 'title',
    subtitleField: 'company',
    order: [{ column: 'sort_order' }, { column: 'start_date', ascending: false }],
    fields: [
      { name: 'title', label: 'Job title', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'start_date', label: 'Start date', type: 'date', required: true },
      { name: 'end_date', label: 'End date', type: 'date', help: 'Leave empty for a current role.' },
      { name: 'current', label: 'Current role', type: 'boolean' },
      { name: 'description', label: 'Highlights', type: 'textarea' },
      ...sortAndVisibility,
    ],
  },
  certifications: {
    table: 'certifications',
    title: 'Certifications',
    description: 'Badges and credentials.',
    key: 'id',
    titleField: 'name',
    subtitleField: 'issuer',
    order: [{ column: 'sort_order' }],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'issuer', label: 'Issuer', type: 'text' },
      { name: 'issue_date', label: 'Issued', type: 'date' },
      { name: 'expiry_date', label: 'Expires', type: 'date' },
      { name: 'credential_url', label: 'Verify URL', type: 'url' },
      { name: 'description', label: 'Description', type: 'textarea' },
      ...sortAndVisibility,
    ],
  },
  education: {
    table: 'education',
    title: 'Education',
    description: 'Degrees and schools.',
    key: 'id',
    titleField: 'degree',
    subtitleField: 'school',
    order: [{ column: 'sort_order' }],
    fields: [
      { name: 'degree', label: 'Degree', type: 'text', required: true },
      { name: 'school', label: 'School', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'start_year', label: 'Start year', type: 'number' },
      { name: 'end_year', label: 'End year', type: 'number' },
      ...sortAndVisibility,
    ],
  },
  projects: {
    table: 'projects',
    title: 'Projects',
    description: 'Personal and work projects. Featured projects appear first.',
    key: 'id',
    titleField: 'title',
    subtitleField: 'live_url',
    order: [{ column: 'featured', ascending: false }, { column: 'sort_order' }],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'URL slug', type: 'text', required: true, help: 'lowercase-with-dashes' },
      { name: 'description', label: 'One-liner', type: 'textarea' },
      { name: 'long_description', label: 'Details', type: 'textarea', help: 'Shown on the project page. One bullet per line starting with "- ".' },
      { name: 'live_url', label: 'Live URL', type: 'url', help: 'Leave empty for internal tools.' },
      { name: 'github_url', label: 'Repository URL', type: 'url' },
      { name: 'image_url', label: 'Screenshot URL', type: 'url' },
      { name: 'technologies', label: 'Tags', type: 'tags', help: 'Comma separated' },
      { name: 'featured', label: 'Featured', type: 'boolean' },
      ...sortAndVisibility,
    ],
  },
  site_settings: {
    table: 'site_settings',
    title: 'Public settings',
    description: 'What recruiters see and how the site looks.',
    singleton: true,
    key: 'id',
    titleField: 'seo_title',
    order: [{ column: 'id' }],
    fields: [
      { name: 'show_email', label: 'Show email', type: 'boolean' },
      { name: 'show_phone', label: 'Show phone number publicly', type: 'boolean' },
      { name: 'show_contact_form', label: 'Show contact form', type: 'boolean' },
      {
        name: 'accent',
        label: 'Accent colour',
        type: 'select',
        options: [
          { value: '#0a68e6', label: 'Signature blue' },
          { value: '#0b3b7a', label: 'Deep navy' },
          { value: '#0e7490', label: 'Teal' },
        ],
      },
      {
        name: 'background_effect',
        label: 'Hero background',
        type: 'select',
        options: [
          { value: 'aurora', label: 'Animated aurora behind the hero' },
          { value: 'none', label: 'Plain navy' },
        ],
      },
      { name: 'seo_title', label: 'Search title', type: 'text' },
      { name: 'seo_description', label: 'Search description', type: 'textarea' },
      { name: 'og_image_url', label: 'Social share image URL', type: 'url' },
    ],
  },
};

export const SECTIONS = ['profile', 'skills', 'experience', 'certifications', 'education', 'projects'] as const;
