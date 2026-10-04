-- Adds "open to projects" (freelance / side work only) as an availability setting.
alter table portfolio.profile drop constraint if exists profile_availability_check;
alter table portfolio.profile
  add constraint profile_availability_check check (availability in ('open', 'projects', 'offers', 'closed'));
