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
