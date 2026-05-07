-- Remove geo columns and related index from web_analytics
alter table public.web_analytics
  drop column if exists country,
  drop column if exists region,
  drop column if exists city;

-- Drop old country index if present
drop index if exists web_analytics_country_idx;
