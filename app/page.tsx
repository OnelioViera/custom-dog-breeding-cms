import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-primary to-secondary">
      <div className="text-center text-white space-y-6">
        <div className="text-6xl font-bold mb-4">OJV</div>
        <h1 className="text-4xl font-bold">Web Design CMS</h1>
        <p className="text-xl opacity-90">
          Custom Content Management for Dog Breeding Businesses
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/admin"
            className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Go to Dashboard →
          </Link>
        </div>
      </div>
    </main>
  );
}

