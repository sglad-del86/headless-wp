import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

// 1. 動的メタデータの生成 (SEO)
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPage(slug);
  
  if (!page) return { title: 'Page Not Found' };

  return {
    title: `${page.title.rendered.replace(/&#?\w+;/g, '')} | Project 8 Change`,
    description: page.excerpt?.rendered.replace(/<[^>]*>?/gm, '').substring(0, 160) || 'Project 8 Change Page',
  };
}

async function getPage(slug) {
  try {
    const user = (process.env.WP_USER || '').trim();
    const pass = (process.env.WP_PASS || '').trim();
    const auth = Buffer.from(`${user}:${pass}`).toString('base64');

    // スラッグで固定ページを検索
    const res = await fetch(`https://cms.project8change.com/wp-json/wp/v2/pages?slug=${slug}&_embed`, {
      cache: 'no-store',
      headers: { 
        'Accept': 'application/json',
        'Authorization': `Basic ${auth}`
      }
    });
    const pages = await res.json();
    return pages && pages.length > 0 ? pages[0] : null;
  } catch (error) {
    return null;
  }
}

export default async function StaticPage({ params }) {
  const { slug } = await params;
  
  // 既存の固定ルート(contactなど)と重複しないように配慮
  if (slug === 'contact' || slug === 'api') return null;

  const page = await getPage(slug);
  if (!page) notFound();

  const featuredMedia = page._embedded?.['wp:featuredmedia']?.[0];
  const imageUrl = featuredMedia?.source_url;
  const imageAlt = featuredMedia?.alt_text || page.title.rendered;
  const proxiedImageUrl = imageUrl ? `/api/image-proxy?url=${encodeURIComponent(imageUrl)}` : null;

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-6 sm:p-10 z-50 mix-blend-difference pointer-events-none flex justify-between items-center">
        <Link 
          href="/" 
          className="text-[10px] font-bold tracking-[0.4em] text-white hover:opacity-70 transition-opacity uppercase pointer-events-auto"
        >
          ← Index
        </Link>
        <Link 
          href="/contact" 
          className="text-[10px] font-bold tracking-[0.4em] text-white hover:opacity-70 transition-opacity uppercase pointer-events-auto"
        >
          お問い合わせ
        </Link>
      </nav>

      <article className="pb-32 sm:pb-48">
        {/* Editorial Title Section */}
        <header className="pt-32 sm:pt-48 pb-16 sm:pb-24 px-6 sm:px-12 max-w-4xl mx-auto border-b border-gray-100 mb-16 sm:mb-24 animate-fade-in text-center">
          <h1 
            className="text-5xl sm:text-7xl md:text-8xl font-extrabold text-primary leading-[1] tracking-tighter mb-12"
            dangerouslySetInnerHTML={{ __html: page.title.rendered }}
          />
          <div className="w-12 h-[2px] bg-accent mx-auto" />
        </header>

        {/* Hero Image - Proxy enabled */}
        {proxiedImageUrl && (
          <div className="max-w-6xl mx-auto mb-20 sm:mb-32 px-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="aspect-[21/9] w-full bg-gray-50 overflow-hidden relative">
              <Image 
                src={proxiedImageUrl} 
                alt={imageAlt} 
                fill
                priority
                unoptimized
                className="object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-1000" 
              />
            </div>
          </div>
        )}

        {/* Content Body - Prose powered with full optimization */}
        <div className="max-w-3xl mx-auto px-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div 
            className="prose prose-neutral prose-lg sm:prose-xl max-w-none 
              prose-headings:text-primary prose-headings:font-extrabold prose-headings:tracking-tighter
              prose-p:text-secondary prose-p:leading-[1.8] prose-p:mb-8
              prose-a:text-accent prose-a:font-bold prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-accent prose-blockquote:bg-gray-50/50 prose-blockquote:p-8 prose-blockquote:italic prose-blockquote:text-primary
              prose-img:rounded-sm prose-img:shadow-2xl prose-img:my-16
              prose-strong:text-primary
              selection:bg-accent/20 selection:text-primary"
            dangerouslySetInnerHTML={{ 
              __html: page.content.rendered
                // 1. 画像URLをすべてプロキシ経由に書き換え
                .replace(/https?:\/\/cms\.project8change\.com\/wp-content\/uploads\/[^"\s'<>]+/g, (match) => {
                  return `/api/image-proxy?url=${encodeURIComponent(match)}`;
                })
                // 2. IDベースのリンクを変換
                .replace(/href="https:\/\/cms\.project8change\.com\/\?p=(\d+)"/g, 'href="/posts/$1"')
                // 3. 基本的なドメイン置換
                .replaceAll('https://cms.project8change.com', '')
                // 4. 正規化
                .replace(/href="\/(?!posts|contact|api|wp-content|wp-includes)([^"]+)"/g, 'href="/posts/$1"')
            }}
          />
        </div>
      </article>

      <footer className="py-24 border-t border-gray-50 text-center">
        <span className="text-[10px] font-bold tracking-[0.6em] text-accent uppercase">
          Project 8 Change
        </span>
      </footer>
    </main>
  );
}
