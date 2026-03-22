export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-wood-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <h1 className="text-3xl font-display font-bold text-wood-900">
              Millwork<span className="text-brand-600">Database</span>
            </h1>
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}
