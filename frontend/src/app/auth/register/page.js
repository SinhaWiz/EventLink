'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    university: '',
    department: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const { name, email, password, phone, university, department } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      // Notify other components that auth changed so Nav updates immediately
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth-changed'));
      // Redirect into the dashboard after registration
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration Error:', err);
      setError(err.response?.data?.error || err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border rounded text-black"
              value={name}
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border rounded text-black"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border rounded text-black"
              value={password}
              onChange={onChange}
              required
              minLength="6"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              className="w-full p-2 border rounded text-black"
              value={phone}
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">University</label>
            <input
              type="text"
              name="university"
              className="w-full p-2 border rounded text-black"
              value={university}
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Department</label>
            <input
              type="text"
              name="department"
              className="w-full p-2 border rounded text-black"
              value={department}
              onChange={onChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
