import Link from 'next/link';
import ContactForm from '../../components/ContactForm';
import Providers from '../../components/Providers';

export const metadata = {
  title: 'Contact | Project 8 Change',
  description: 'Get in touch with the Project 8 Change editorial team.',
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
              <h1 className="text-[10px] font-bold tracking-[0.6em] text-accent uppercase mb-8">
                Communications
              </h1>
              <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter leading-[0.9] mb-12">
                対話を、<br />はじめましょう。
              </h2>
              <div className="flex gap-12 text-[9px] font-bold tracking-[0.2em] text-secondary uppercase">
                <div>
                  <p className="text-accent mb-2">お問い合わせ先</p>
                  <p>tomo81222chapu@gmail.com</p>
                </div>
                <div>
                  <p className="text-accent mb-2">営業時間</p>
                  <p>月曜 — 金曜, 9時 — 17時</p>
                </div>
              </div>
            </header>

            {/* Form Container */}
            <div className="bg-gray-50/50 p-8 sm:p-16 rounded-sm border border-gray-100">
              <ContactForm />
            </div>
          </div>
        </section>

        <footer className="py-24 border-t border-gray-50 text-center">
          <span className="text-[10px] font-bold tracking-[0.6em] text-accent uppercase">
            Project 8 Change
          </span>
        </footer>
      </main>
    </Providers>
  );
}
