-- 기존 Supabase 프로젝트에서 감사편지의 800자 제한을 제거합니다.
-- 최소 50자 제한은 유지됩니다.

begin;

alter table public.letters drop constraint if exists letters_content_check;
alter table public.letters drop constraint if exists letters_content_min_length_check;
alter table public.letters
  add constraint letters_content_min_length_check check (char_length(content) >= 50);

commit;
