import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";

type Visit = {
  created_at: string;
  session_id: string | null;
  path: string | null;
};

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [range, setRange] = useState<string>("7d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin/login", { replace: true });
        return;
      }
      await refresh();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const daysMap: Record<string, number> = { "24h": 1, "7d": 7, "30d": 30, "90d": 90 };
      const days = daysMap[range] ?? 7;
      const { data, error } = await supabase
        .from("web_analytics")
        .select("created_at, session_id, path")
        .gte("created_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: true });
      if (error) throw error;
      setVisits((data as unknown as Visit[]) ?? []);
    } catch (e: any) {
      setError(e?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  // Build unique sessions map: first event per session within range
  const sessions = useMemo(() => {
    const map = new Map<string, Visit>();
    for (const v of visits) {
      const sid = v.session_id || `anon-${v.created_at}`;
      const prev = map.get(sid);
      if (!prev || new Date(v.created_at) < new Date(prev.created_at)) {
        map.set(sid, v);
      }
    }
    return Array.from(map.values());
  }, [visits]);

  const totalVisits = sessions.length; // visitors (unique sessions)
  const uniqueSessions = sessions.length;

  // Country removed per request

  const byDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of sessions) {
      const d = new Date(v.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([date, count]) => ({ date, count }));
  }, [sessions]);

  return (
    <main className="container mx-auto max-w-6xl py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-muted-foreground">Traffic overview for your site.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={range === "24h" ? "default" : "outline"} onClick={() => setRange("24h")}>24h</Button>
          <Button variant={range === "7d" ? "default" : "outline"} onClick={() => setRange("7d")}>7d</Button>
          <Button variant={range === "30d" ? "default" : "outline"} onClick={() => setRange("30d")}>30d</Button>
          <Button variant={range === "90d" ? "default" : "outline"} onClick={() => setRange("90d")}>90d</Button>
          <Button variant="secondary" onClick={() => navigate("/admin")}>Back to Dashboard</Button>
        </div>
      </header>

      {loading ? (
        <div className="mt-8 text-muted-foreground">Loading...</div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Visitors</CardTitle>
                <CardDescription>Unique sessions in range</CardDescription>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{totalVisits}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Unique sessions</CardTitle>
                <CardDescription>Approx. unique visitors in range</CardDescription>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{uniqueSessions}</CardContent>
            </Card>
            {/* Intentionally removed Top country card */}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Visitors over time</CardTitle>
              <CardDescription>Daily visitors (unique sessions)</CardDescription>
            </CardHeader>
            <CardContent style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={byDay} margin={{ left: 8, right: 8, bottom: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.7}/>
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVisits)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Removed Top countries table */}

          {error && <div className="text-destructive text-sm">{error}</div>}
        </div>
      )}
    </main>
  );
};

export default AdminAnalytics;
