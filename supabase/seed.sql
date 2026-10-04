-- Seed content for the portfolio schema, taken from JAMO_RESUME_2026.pdf.
-- Safe to run once on an empty portfolio schema; edit afterwards in /admin.

insert into portfolio.profile (name, headline, bio, location, email, linkedin_url, target_role, availability)
values (
  'John Anthony Otayco',
  'IT Infrastructure & Security',
  'IT Support Team Lead with 8+ years of experience in Managed Service Provider (MSP) and enterprise environments. Currently part of the security team, actively involved in cybersecurity monitoring, incident response, vulnerability remediation, and secure infrastructure operations. Strong hands-on background in Microsoft 365, Active Directory, endpoint security, and patch management, with proven leadership in guiding engineers, handling escalations, and supporting security-driven initiatives.',
  'San Fernando City, Cebu, Philippines',
  'jao@otatats.top',
  'https://www.linkedin.com/in/xenotayco/',
  'IT Security & Infrastructure Officer',
  'projects'
);

insert into portfolio.profile_private (profile_id, phone)
select id, '+63 917 625 7313' from portfolio.profile order by id limit 1;

insert into portfolio.skills (name, category, proficiency_label, sort_order) values
  ('Incident Response',        'Security Operations',     'Expert',     1),
  ('Threat & Vulnerability Management',      'Security Operations',     'Proficient', 2),
  ('Security Policy Enforcement',            'Security Operations',     'Proficient', 3),
  ('EDR/XDR (Huntress, Bitdefender)',        'Security Operations',     'Proficient', 4),
  ('Email Security (Proofpoint)',  'Security Operations',     'Expert',     5),
  ('Microsoft 365 Administration',                          'Identity & Cloud',  'Expert',     1),
  ('Microsoft Entra ID (Azure AD)',                    'Identity & Cloud',  'Expert',     2),
  ('Active Directory',                       'Identity & Cloud',  'Expert',     3),
  ('Windows Server',                         'Infrastructure',    'Proficient', 1),
  ('Group Policy',                           'Infrastructure',    'Proficient', 2),
  ('Patch Management', 'Infrastructure', 'Expert', 3),
  ('PowerShell',                             'Automation',        'Proficient', 1),
  ('Power Automate',                         'Automation',        'Proficient', 2),
  ('Team Leadership & Mentoring',               'Leadership',        'Proficient', 1),
  ('IT Operations Management',               'Leadership',        'Proficient', 2),
  ('ConnectWise Manage (Ticketing)',         'Service Desk',      'Proficient', 1),
  ('ConnectWise Automate (RMM)',             'Service Desk',      'Proficient', 2),
  ('Client Support & Escalations',           'Service Desk',      'Expert',     3),
  ('Technical Documentation',                'Service Desk',      'Proficient', 4);

insert into portfolio.experience (company, title, location, description, start_date, end_date, current, sort_order) values
  ('Geidi IT Services', 'IT Support Team Lead', 'Cebu, Philippines',
   E'- Lead and mentor IT support engineers in an MSP environment\n- Oversee daily operations, escalations, and incident response, including security-related incidents\n- Participate as part of the security team supporting threat monitoring and vulnerability remediation\n- Coordinate infrastructure projects, system upgrades, and security implementations\n- Collaborate with cybersecurity teams on EDR/XDR deployment and policy enforcement\n- Ensure patch management, system hardening, and compliance',
   '2025-10-01', null, true, 1),
  ('Geidi IT Services', 'IT Support Engineer – Subject Matter Expert (Cybersecurity)', 'Cebu, Philippines',
   E'- Senior escalation point for security monitoring, threat analysis, and incident response\n- Managed Proofpoint, Huntress, Bitdefender, and endpoint security solutions\n- Assisted with identity and access management and security policy implementation\n- Mentored junior engineers on secure troubleshooting practices',
   '2025-03-01', '2025-10-31', false, 2),
  ('Geidi IT Services', 'IT Support Engineer (On-site Assignments)', 'Perth, Australia',
   E'- Delivered onsite infrastructure and end-user support in business-critical environments\n- Assignments: Sep 2023 – Dec 2023 and Jan 2025 – Apr 2025',
   '2023-09-01', '2025-04-30', false, 3),
  ('Geidi IT Services', 'IT Support Engineer', 'Cebu, Philippines',
   E'- Administered Microsoft 365, Active Directory, Windows Server, and networking services\n- Managed patching, Group Policy, system configuration, and technical documentation\n- Responded to security alerts and assisted in risk remediation\n- Automated routine tasks using PowerShell and Power Automate',
   '2018-04-01', '2025-03-31', false, 4),
  ('Atos', 'Technical Helpdesk Analyst', 'Cebu, Philippines',
   E'- AD password resets, Exchange management, and Windows support\n- Delivered customer-focused Tier 1–2 technical service',
   '2017-07-01', '2018-04-30', false, 5),
  ('Convergys', 'Technical Support Representative', 'Cebu, Philippines',
   E'- Assisted U.S. clients with broadband and home network support\n- Handled billing concerns and router/modem troubleshooting',
   '2017-07-01', '2018-04-30', false, 6);

insert into portfolio.certifications (name, issuer, sort_order) values
  ('SC-900: Microsoft Security, Compliance & Identity Fundamentals', 'Microsoft', 1),
  ('AZ-900: Microsoft Azure Fundamentals',                          'Microsoft', 2),
  ('Certified Duo Help Desk Administrator',                         'Cisco Duo', 3),
  ('Google IT Support Specialization',                              'Google',    4),
  ('PL-900: Microsoft Power Platform Fundamentals',                 'Microsoft', 5);

insert into portfolio.education (degree, school, location, sort_order) values
  ('Bachelor of Science in Information Technology', 'AMA University', 'Zamboanga City, Philippines', 1);

insert into portfolio.projects (title, slug, description, long_description, live_url, technologies, featured, sort_order) values
  ('The Inner Mirror', 'the-inner-mirror',
   'A self-reflection web app inspired by Carl Jung''s archetypes: explore twelve archetypes to understand your persona, shadow, and inner tensions.',
   E'A guided, roughly 15-minute self-reflection experience built around twelve Jungian archetypes.\n\n- No account required (optional sign-up)\n- Reflections stored locally for 24 hours: privacy by design\n- Guided questions, archetype analysis, and journaling prompts\n\nNot a clinical assessment: archetypes are lenses, not boxes.',
   'https://codex.otatats.top', array['Web App', 'Supabase', 'Privacy by design', 'UX'], true, 1);
