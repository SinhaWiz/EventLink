"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Nav() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    setAuthenticated(Boolean(token));
    try {
      setUser(u ? JSON.parse(u) : null);
    } catch (err) {
      setUser(null);
    }
    // Listen for auth change events in-page (login/register/logout)
    const onAuthChanged = () => {
      const t = localStorage.getItem('token');
      const usr = localStorage.getItem('user');
      setAuthenticated(Boolean(t));
      try {
        setUser(usr ? JSON.parse(usr) : null);
      } catch (err) {
        setUser(null);
      }
    };

    window.addEventListener('auth-changed', onAuthChanged);

    // Also respond to storage events (other tabs)
    const onStorage = (e) => {
      if (e.key === 'token' || e.key === 'user') onAuthChanged();
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('auth-changed', onAuthChanged);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  function handleLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthenticated(false);
      setUser(null);
      router.push('/');
    }
  }

  return (
    <nav className="bg-orange-50 shadow-sm p-4 border-b border-orange-200">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-orange-600">EventLink</Link>

        <div className="flex items-center gap-4">
          {authenticated ? (
            <>
              <Link href="/events" className="btn">Browse Events</Link>
              <button onClick={handleLogout} className="btn" style={{background: 'white', color: '#ff6600', border: '1px solid #ff6600'}}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-orange-600 hover:text-orange-700 font-semibold">Login</Link>
              <Link href="/auth/register" className="btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
