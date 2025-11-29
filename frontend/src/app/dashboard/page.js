"use client";

import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function formatRemaining(ms) {
  if (ms == null) return null;
  if (ms <= 0) return 'Less than a second';

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(' ');
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(Date.now());

  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view your dashboard.');
      setLoading(false);
      return;
    }

    async function fetchDashboard() {
      try {
        setLoading(true);
        const res = await api.get('/gamification/dashboard/me');
        if (res.data.success) setDashboard(res.data.data);
        else setError('Failed to load dashboard');
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();

    // tick for countdowns
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  function handleLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/');
    }
  }

  if (loading) {
     return <div className="p-8 text-orange-600 bg-white rounded">Loading dashboard...</div>;
  }

  if (error) {
      return (
        <div className="p-8 bg-white rounded">
          <p className="text-orange-600 font-bold">{error}</p>
          <Link href="/auth/login" className="btn mt-4 inline-block">Log in</Link>
        </div>
      );
  }

  const { profile, stats, registrations = [], achievements = [], badges = [], certificates = [], history = [] } = dashboard || {};

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-orange-600">Your Dashboard</h1>
          <div className="text-right">
            <div className="text-sm text-orange-500">Welcome back,</div>
            <div className="text-lg font-semibold text-orange-700">{profile?.name}</div>
          </div>
        </header>

        {/* Top summary */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded shadow border border-orange-200">
            <div className="text-xs text-orange-500">Points</div>
            <div className="text-2xl font-bold text-orange-600">{stats?.totalPoints ?? 0}</div>
            <div className="text-sm text-orange-400 mt-2">Earned points across events</div>
          </div>

          <div className="bg-white p-6 rounded shadow border border-orange-200">
            <div className="text-xs text-orange-500">Tier</div>
            <div className="text-2xl font-bold text-orange-600">{stats?.currentTier ?? 'Bronze'}</div>
            <div className="text-sm text-orange-400 mt-2">Your current gamification tier</div>
          </div>

          <div className="bg-white p-6 rounded shadow border border-orange-200">
            <div className="text-xs text-orange-500">Participation</div>
            <div className="text-2xl font-bold text-orange-600">{stats?.totalEventsCompleted ?? 0} / {stats?.totalEventsRegistered ?? 0}</div>
            <div className="text-sm text-orange-400 mt-2">Completed / Registered</div>
          </div>
        </section>

        {/* Achievements & Badges */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded shadow border border-orange-200 md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-orange-600">Registered Events</h2>
            {registrations.length === 0 && <p className="text-orange-400">No data available</p>}
            <div className="space-y-4">
              {registrations.map((r) => {
                const remaining = r.remainingMs != null ? r.remainingMs - (Date.now() - now) : null;
                return (
                  <div key={r.registrationId} className="flex items-center justify-between bg-orange-50 p-4 rounded border border-orange-100">
                    <div>
                      <div className="text-md font-semibold text-orange-700">{r.event.title}</div>
                      <div className="text-sm text-orange-500">{new Date(r.event.date).toLocaleString()} — {r.event.location}</div>
                    </div>
                    <div className="text-right">
                      {r.status === 'Completed' ? (
                        <div className="text-sm text-green-600 font-medium">Completed</div>
                      ) : (
                        <div className="text-sm text-orange-600 font-medium">{formatRemaining((new Date(r.event.date)).getTime() - now)} remaining</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow border border-orange-200">
            <h2 className="text-lg font-semibold mb-4 text-orange-600">Achievements & Badges</h2>
            <div className="space-y-3">
              {achievements.length === 0 && <div className="text-sm text-orange-400">No data available</div>}
              {achievements.map(a => (
                <div key={a.id} className="p-3 rounded border bg-orange-50">
                  <div className="text-sm font-semibold text-orange-700">{a.title}</div>
                  <div className="text-xs text-orange-500">{a.description}</div>
                </div>
              ))}

              <div className="mt-2 border-t pt-2">
                {badges.map(b => (
                  <div key={b.id} className="text-xs text-orange-600 py-1">🏅 {b.title} — {b.description}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Certificates & History */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-white p-6 rounded shadow border border-orange-200">
            <h2 className="text-lg font-semibold mb-4 text-orange-600">Certificates</h2>
            {certificates.length === 0 && <div className="text-sm text-orange-400">No data available</div>}
            <div className="space-y-3">
              {certificates.map(c => (
                <div key={c.certificateId} className="p-3 rounded border flex justify-between items-center bg-orange-50">
                  <div>
                    <div className="text-sm font-semibold text-orange-700">{c.eventName}</div>
                    <div className="text-xs text-orange-500">{new Date(c.date).toLocaleDateString()}</div>
                  </div>
                  <a className="btn" href={c.downloadUrl}>View / Download</a>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow border border-orange-200">
            <h2 className="text-lg font-semibold mb-4 text-orange-600">Participation History</h2>
            {history.length === 0 && <div className="text-sm text-orange-400">No data available</div>}
            <div className="space-y-2 text-sm text-orange-700">
              {history.map(h => (
                <div key={h.registrationId} className="p-2 rounded border bg-orange-50">
                  <div className="font-semibold">{h.event.title}</div>
                  <div className="text-xs text-orange-500">{new Date(h.event.date).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
