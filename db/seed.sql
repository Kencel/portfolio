insert into projects (title, description, image_url, link_url, year, tags)
select
  'PROJECT SINAG',
  'Full-stack web app built with Team McCoders at Blue Hacks 2025 — from idea to working demo within the event window. Next.js on both ends, typed data with Prisma over PostgreSQL, styled with Tailwind & shadcn/ui.',
  '/sinag.jpg',
  'https://project-sinag.cjuy.dev/',
  2025,
  array['HACKATHON','NEXT.JS','TAILWIND','SHADCN/UI','NITRO','PRISMA','POSTGRESQL']
where not exists (select 1 from projects);

insert into competitions (name, event_date, team, result, placement, note, cert_image_url)
select * from (values
  ('UP ACM Algolympics 2026', date '2026-05-01', 'Team KMP', 'Finalist', 'Finalist', null, '/algolympics2026_cert.jpg'),
  ('CompSAt Fortnight: Code Royale 2026', date '2026-03-01', 'Clan 5', '15/15 problems', '1st place', null, null),
  ('UP ACM Algolympics 2025 — Online Elimination Round', date '2025-03-01', 'Team AKG-47', '10/13 problems', 'Top 30 of 71', null, null),
  ('Canadian Computing Competition 2023', date '2023-02-01', null, '60 points', 'Top 25%', 'Certificate of Distinction, Junior Division', null)
) as v(name, event_date, team, result, placement, note, cert_image_url)
where not exists (select 1 from competitions);
