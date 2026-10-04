-- Years of experience shown in the hero, set by the owner (empty = work it out from the experience dates).
alter table portfolio.profile
  add column if not exists years_experience smallint check (years_experience between 0 and 60);
update portfolio.profile set years_experience = 8 where years_experience is null;
