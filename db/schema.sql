create table if not exists projects (
  id          serial primary key,
  title       text not null,
  description text not null,
  image_url   text,            -- null → card shows placeholder art
  link_url    text,            -- null → no VISIT SITE button
  year        int  not null,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);

create table if not exists competitions (
  id             serial primary key,
  name           text not null,          -- "UP ACM Algolympics 2026"
  event_date     date not null,          -- sort key; rendered as "MAY 2026"
  team           text,                   -- "Team KMP"; null = solo
  result         text not null,          -- "10/13 problems", "60 points"
  placement      text,                   -- "Finalist", "Top 30 of 71", "Top 25%", "1st place"
  note           text,                   -- "Certificate of Distinction, Junior Division"
  cert_image_url text,                   -- "/algolympics2026_cert.jpg"
  created_at     timestamptz not null default now()
);
