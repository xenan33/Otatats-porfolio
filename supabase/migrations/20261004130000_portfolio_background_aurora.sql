-- Portfolio redesign: the Matrix-style backgrounds are gone; the hero uses an
-- aurora (React Bits) or nothing. Portfolio schema only.
alter table portfolio.site_settings drop constraint if exists site_settings_background_effect_check;
update portfolio.site_settings set background_effect = 'aurora' where background_effect in ('letter-glitch', 'dot-grid');
alter table portfolio.site_settings
  alter column background_effect set default 'aurora',
  add constraint site_settings_background_effect_check check (background_effect in ('aurora', 'none'));
-- Signature blue, a touch darker so small text passes WCAG AA on light grey.
update portfolio.site_settings set accent = '#0a68e6' where accent in ('#0a6ff0', '#22c55e');
alter table portfolio.site_settings alter column accent set default '#0a68e6';
