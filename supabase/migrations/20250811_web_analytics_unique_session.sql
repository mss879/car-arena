-- Enforce at most one row per non-null session_id

-- Temporarily disable RLS to allow cleanup (migrations usually bypass RLS, but this is safe)
alter table public.web_analytics disable row level security;

-- Delete duplicate rows per session_id, keeping the earliest created_at
delete from public.web_analytics wa
using (
	select id
	from (
		select id,
					 row_number() over (partition by session_id order by created_at asc, id asc) as rn
		from public.web_analytics
		where session_id is not null
	) t
	where t.rn > 1
) d
where wa.id = d.id;

-- Re-enable RLS
alter table public.web_analytics enable row level security;

-- Create unique partial index (ignores null session_id)
create unique index if not exists web_analytics_session_unique
on public.web_analytics (session_id)
where session_id is not null;
