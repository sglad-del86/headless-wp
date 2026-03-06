import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getPost(id) {
  const res = await fetch(`https://cms.project8change.com/wp-json/wp/v2/posts/${id}?_embed`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <main className="min-h-screen bg-[#f9f9f9]">
      {/* 戻るボタン: スマホでは控えめに */}
      <nav className="p-6 sm:p-8 md:p-12">
        <Link 
          href="/" 
          className="text-[10px] font-bold tracking-[0.4em] text-gray-400 hover:text-[#1a1a1a] transition-all uppercase"
        >
          ← Back
        </Link>
      </nav>

      <article className="px-5 sm:px-10 pb-24 sm:pb-40">
        {/* ヘッダー: 流動的なフォントサイズ */}
        <header className="max-w-2xl mx-auto pt-8 sm:pt-16 md:pt-24 mb-12 sm:mb-20 md:mb-32">
          <time className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] text-gray-300 mb-6 sm:mb-8 block uppercase">
            {new Date(post.date).toLocaleDateString('ja-JP')}
          </time>
          <h1 
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-[#1a1a1a] leading-[1.2] sm:leading-[1.15] tracking-tight"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </header>

        {/* ヒーロー画像: レスポンシブな角丸 */}
        {featuredImage && (
          <div className="max-w-4xl mx-auto mb-16 sm:mb-24 md:mb-32">
            <div className="aspect-[16/9] sm:aspect-video w-full rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] bg-slate-100">
              <img src={featuredImage} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* 本文: 可読性を重視したレスポンシブタイポグラフィ */}
        <div className="max-w-2xl mx-auto">
          <div 
            className="prose prose-neutral prose-base sm:prose-lg md:prose-xl max-w-none 
              prose-headings:text-[#1a1a1a] prose-headings:font-bold prose-headings:tracking-tight
              prose-p:text-[#333333] prose-p:leading-[1.7] sm:prose-p:leading-[1.8]
              prose-a:text-[#1a1a1a] prose-a:font-bold prose-a:underline prose-a:underline-offset-4
              prose-img:rounded-[1.5rem] sm:prose-img:rounded-[2rem] prose-img:w-full prose-img:h-auto"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          <div className="mt-20 sm:mt-32 pt-16 border-t border-gray-100 flex justify-center">
            <Link 
              href="/" 
              className="px-10 sm:px-14 py-4 sm:py-5 bg-[#1a1a1a] text-white font-bold hover:bg-gray-800 transition-all text-[10px] uppercase tracking-[0.4em] rounded-full shadow-xl active:scale-95 text-center"
            >
              Scroll to Index
            </Link>
          </div>
        </div>
      </article>

      <footer className="py-24 text-center opacity-20">
        <p className="text-[10px] font-bold uppercase tracking-[0.5em]">
          End of Journal
        </p>
      </footer>
    </main>
  );
}
