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
    <nav className="bg-white shadow-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">EventLink</Link>

        <div className="flex items-center gap-4">
          {authenticated ? (
            <>
              <Link href="/events" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Browse Events</Link>
              <button onClick={handleLogout} className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50">Logout</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-600 hover:text-blue-600">Login</Link>
              <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
