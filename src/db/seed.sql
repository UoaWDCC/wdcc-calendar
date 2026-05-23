-- Test user
insert into users (name, email)
values ('Shuaib', 'alkhudairi.sa@gmail.com'), ('Test User', 'salk147@gmail.com')
on conflict (email) do update
set name = excluded.name;

-- Test club
insert into clubs (name, abbreviation, signup_url, spreadsheet_url)
values (
  'Test Club',
  'TEST',
  'https://example.com/signup',
  'https://docs.google.com/spreadsheets/d/example'
)
on conflict (abbreviation) do nothing;

-- Test admin membership
insert into admin_of (user_id, club_id)
select users.id, clubs.id
from users
join clubs on clubs.abbreviation = 'TEST'
where users.email = 'alkhudairi.sa@gmail.com'
on conflict do nothing;

-- Test event with QR stamp
insert into events (
  club_id,
  title,
  description,
  location,
  starts_at,
  ends_at,
  is_member_only,
  qr_code_token,
  stamp_path
)
select
  clubs.id,
  'Test Stamp Event',
  'A local test event for checking QR stamp collection.',
  'WDCC Test Space',
  now(),
  now() + interval '2 hours',
  false,
  'test-stamp-qr-token',
  '/stamps/test-stamp.png'
from clubs
where clubs.abbreviation = 'TEST'
  and not exists (
    select 1
    from events
    where events.qr_code_token = 'test-stamp-qr-token'
  );
