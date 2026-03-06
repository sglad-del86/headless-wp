import Link from 'next/link';

async function getPosts() {
  const res = await fetch('https://cms.project8change.com/wp-json/wp/v2/posts?_embed', {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default async function Page() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-[#f9f9f9]">
      {/* ナビゲーション: スマホでは控えめに、PCではゆったりと */}
      <nav className="fixed top-0 right-0 p-6 sm:p-8 md:p-12 z-50">
        <Link 
          href="/" 
          className="text-[10px] font-bold tracking-[0.4em] text-gray-400 hover:text-[#1a1a1a] transition-all uppercase"
        >
          Index
        </Link>
      </nav>

      {/* 記事一覧: 流動的な余白 (Fluid Spacing) */}
      <section className="max-w-7xl mx-auto px-5 sm:px-10 pt-20 sm:pt-32 pb-32 sm:pb-48 md:pt-48 md:pb-64">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:gap-x-16 gap-y-16 sm:gap-y-24 md:gap-y-40">
          {posts.map((post) => {
            const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            
            return (
              <article key={post.id} className="group cursor-pointer">
                <Link href={`/posts/${post.id}`} className="block">
                  {/* カード: レスポンシブな角丸とエフェクト */}
                  <div className="bg-white rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.02)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.06)] group-hover:-translate-y-4">
                    
                    <div className="aspect-[16/10] overflow-hidden">
                      {featuredImage ? (
                        <img 
                          src={featuredImage} 
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-200 text-[10px] font-bold tracking-widest uppercase">
                          No Image
                        </div>
                      )}
                    </div>
                    
                    {/* カード内余白のレスポンシブ化 */}
                    <div className="p-7 sm:p-10 md:p-14">
                      <time className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] text-gray-300 mb-4 sm:mb-6 block uppercase border-b border-gray-50 pb-4">
                        {new Date(post.date).toLocaleDateString('ja-JP')}
                      </time>
                      <h2 
                        className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug sm:leading-tight text-[#1a1a1a] group-hover:text-gray-600 transition-colors duration-500"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
                      />
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="pb-20 sm:pb-32 text-center">
        <span className="text-[10px] font-bold tracking-[0.5em] text-gray-200 uppercase">
          © 2026 Archive
        </span>
      </footer>
    </main>
  );
}
