import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Discover & Participate in University Events
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          EventLink is the central hub for all university events across Bangladesh.
          Track your participation, earn rewards, and build your portfolio.
        </p>
        <div className="space-x-4">
          <Link
            href="/auth/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            href="/events"
            className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50"
          >
            Browse Events
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <p>&copy; 2025 EventLink. All rights reserved.</p>
      </footer>
    </div>
  );
}
