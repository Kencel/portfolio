insert into projects (title, description, image_url, link_url, year, tags)
select
  'PROJECT SINAG',
  'Full-stack web app built with Team McCoders at Blue Hacks 2025 — from idea to working demo within the event window. Next.js on both ends, typed data with Prisma over PostgreSQL, styled with Tailwind & shadcn/ui.',
  '/sinag.jpg',
  'https://project-sinag.cjuy.dev/',
  2025,
  array['HACKATHON','NEXT.JS','TAILWIND','SHADCN/UI','NITRO','PRISMA','POSTGRESQL']
where not exists (select 1 from projects);
