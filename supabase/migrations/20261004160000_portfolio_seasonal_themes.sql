-- On/off switch for the date-based seasonal themes (Halloween, Christmas, New Year).
alter table portfolio.site_settings
  add column if not exists seasonal_themes boolean not null default true;
