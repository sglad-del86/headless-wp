import Link from 'next/link';
import ContactForm from '../../components/ContactForm';
import Providers from '../../components/Providers';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'お問い合わせ | Project 8 Change',
  description: 'Project 8 Change お問い合わせフォーム',
};

export default function ContactPage() {
  return (
    <Providers>
      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full p-6 sm:p-10 z-50 mix-blend-difference pointer-events-none">
          <Link 
            href="/" 
            className="text-[10px] font-bold tracking-[0.4em] text-white hover:opacity-70 transition-opacity uppercase pointer-events-auto"
          >
            ← Home
          </Link>
        </nav>

        <section className="pt-32 sm:pt-48 pb-32 px-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <header className="mb-20 sm:mb-32 animate-fade-in">
              <h1 className="text-[12px] font-bold tracking-[0.6em] text-accent uppercase mb-8">
                Communications
              </h1>
              <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tighter leading-[0.9] mb-12">
                対話を、<br />はじめましょう。
              </h2>
              <div className="flex gap-12 text-[13px] font-medium text-secondary uppercase tracking-widest leading-relaxed">
                <div className="border-l-2 border-accent pl-6">
                  <p className="text-accent font-bold mb-2">お問い合わせ</p>
                  <p className="text-primary">こちらのフォームより、<br />お気軽にご連絡ください。</p>
                </div>
              </div>
            </header>

            {/* Form Container */}
            <div className="bg-gray-50/50 p-8 sm:p-16 rounded-sm border border-gray-100">
              <ContactForm />
            </div>
          </div>
        </section>

        <footer className="py-24 border-t border-gray-50 text-center relative">
          <span className="text-[10px] font-bold tracking-[0.6em] text-accent uppercase">
            Project 8 Change
          </span>
          {/* Version identifier to confirm update */}
          <div className="absolute bottom-4 right-4 text-[8px] text-gray-100 uppercase tracking-widest">
            Update: SEC-01
          </div>
        </footer>
      </main>
    </Providers>
  );
}
