import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-white dark:bg-gray-900">
      <section className="container mx-auto flex flex-col items-center justify-center text-center py-24 px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white transition-opacity duration-700 ease-out opacity-0 animate-fade-in">
          Build Something Great
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 transition-opacity duration-700 delay-150 ease-out opacity-0 animate-fade-in">
          Launch your ideas faster with our platform.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/get-started"
            className="px-8 py-3 rounded-md bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/wordpress"
            className="px-8 py-3 rounded-md border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            One-click WordPress
          </Link>
        </div>
      </section>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(0.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
