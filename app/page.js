import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Project 8 Change | Thoughts & Observations',
  description: 'Next.jsとWordPress REST APIを融合させた、次世代のデジタルジャーナル。洗練された読書体験を提供します。',
  openGraph: {
    title: 'Project 8 Change',
    description: 'Thoughts & Observations Archive',
    type: 'website',
  },
};

async function getPosts() {
  try {
    const res = await fetch('https://cms.project8change.com/index.php/wp-json/wp/v2/posts?_embed&per_page=12', {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return { posts: [], error: `API Error: ${res.status}` };
    const data = await res.json();
    return { posts: Array.isArray(data) ? data : [], error: null };
  } catch (error) {
    return { posts: [], error: error.message };
  }
}

export default async function Page() {
  const { posts, error } = await getPosts();

  return (
    <main className="min-h-screen bg-white">
      {error && (
        <div className="fixed bottom-0 right-0 m-4 p-4 bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold uppercase tracking-widest z-[100] rounded-sm">
          System Warning: {error}
        </div>
      )}
      {/* Editorial Header */}
      <header className="pt-24 pb-12 sm:pt-40 sm:pb-24 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8 border-b border-gray-100">
        <div className="animate-fade-in">
          <h1 className="text-[10px] font-bold tracking-[0.6em] text-accent uppercase mb-6">
            Project 8 Change
          </h1>
          <p className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[0.9] max-w-2xl">
            Thoughts & Observations.
          </p>
        </div>
        <div className="hidden md:block pb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p className="text-[11px] font-medium text-secondary uppercase tracking-[0.2em]">
            Volume 01 / Mar 2026
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-6 sm:p-10 z-50 mix-blend-difference pointer-events-none">
        <Link 
          href="/" 
          className="text-[10px] font-bold tracking-[0.4em] text-white hover:opacity-70 transition-opacity uppercase pointer-events-auto"
        >
          Index
        </Link>
      </nav>

      {/* Post Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-32">
        {posts.length === 0 ? (
          <div className="py-20 text-center animate-fade-in">
            <p className="text-[10px] font-bold tracking-[0.4em] text-secondary uppercase">
              No entries found at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 sm:gap-y-32">
            {posts.map((post, index) => {
              const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
              
              return (
                <article 
                  key={post.id} 
                  className="group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link href={`/posts/${post.id}`} className="block">
                    <div className="space-y-8">
                      {/* Visual Container */}
                      <div className="aspect-[4/5] overflow-hidden rounded-sm bg-gray-50 relative">
                        {featuredImage ? (
                          <Image 
                            src={featuredImage} 
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-110"
                            priority={index < 3}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold tracking-[0.5em] text-gray-200 uppercase">
                            No Visual
                          </div>
                        )}
                        
                        {/* Overlay for premium feel */}
                        <div className="absolute inset-0 border border-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      
                      {/* Content Section */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="h-[1px] w-8 bg-accent" />
                          <time className="text-[9px] font-bold tracking-[0.3em] text-secondary uppercase">
                            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                          </time>
                        </div>
                        
                        <h2 
                          className="text-2xl sm:text-3xl font-bold leading-[1.1] tracking-tight group-hover:text-accent transition-colors duration-500"
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
                        />
                        
                        <div 
                          className="text-sm text-secondary line-clamp-3 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                        />
                        
                        <div className="pt-4 overflow-hidden">
                          <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] inline-flex items-center gap-2 relative">
                            Read Archive
                            <span className="w-0 group-hover:w-6 h-[1px] bg-accent transition-all duration-500" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <footer className="py-32 border-t border-gray-50 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
          <span className="text-[10px] font-bold tracking-[0.6em] text-accent uppercase">
            Project 8 Change
          </span>
          <div className="flex gap-12 text-[9px] font-bold tracking-[0.4em] text-gray-300 uppercase">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
          </div>
          <p className="text-[10px] font-bold tracking-[0.5em] text-gray-200 uppercase mt-8">
            © 2026 Archive Series
          </p>
          {/* Debug Info */}
          <div className="mt-4 opacity-10 text-[8px] uppercase tracking-widest text-gray-400">
            Node: {process.env.NODE_ENV} | Items: {posts.length}
          </div>
        </div>
      </footer>
    </main>
  );
}
