-- Optional company logo per role (the timeline shows the first one found for each company).
-- Public read and admin-only writes come from the existing experience policies.
alter table portfolio.experience
  add column if not exists logo_url text
  check (logo_url is null or logo_url ~ '^(https://|/)');
