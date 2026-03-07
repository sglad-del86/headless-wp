import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

// 1. 動的メタデータの生成 (SEO: Title, Description, OGP)
export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  
  if (!post) return { title: 'Post Not Found' };

  const excerpt = post.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 160);
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return {
    title: `${post.title.rendered.replace(/&#?\w+;/g, '')} | Project 8 Change`,
    description: excerpt,
    openGraph: {
      title: post.title.rendered,
      description: excerpt,
      images: featuredImage ? [featuredImage] : [],
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.rendered,
      description: excerpt,
      images: featuredImage ? [featuredImage] : [],
    },
  };
}

async function getPost(id) {
  try {
    const res = await fetch(`https://cms.project8change.com/index.php/wp-json/wp/v2/posts/${id}?_embed`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
  const imageUrl = featuredImage?.source_url;
  const imageAlt = featuredImage?.alt_text || post.title.rendered;

  // 2. 構造化データの作成 (SEO: JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title.rendered,
    image: imageUrl,
    datePublished: post.date,
    dateModified: post.modified,
    author: [{
      '@type': 'Person',
      name: 'Project 8 Change Editorial',
    }],
    publisher: {
      '@type': 'Organization',
      name: 'Project 8 Change',
      logo: {
        '@type': 'ImageObject',
        url: 'https://project8change.com/logo.png' 
      }
    },
    description: post.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 160),
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 3. JSON-LD の注入 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-6 sm:p-10 z-50 mix-blend-difference pointer-events-none flex justify-between items-center">
        <Link 
          href="/" 
          className="text-[10px] font-bold tracking-[0.4em] text-white hover:opacity-70 transition-opacity uppercase pointer-events-auto"
        >
          ← Index
        </Link>
        <div className="hidden sm:block">
          <span className="text-[10px] font-bold tracking-[0.4em] text-white uppercase opacity-40">
            Reader View
          </span>
        </div>
      </nav>

      <article className="pb-32 sm:pb-48">
        {/* Editorial Title Section */}
        <header className="pt-32 sm:pt-48 pb-16 sm:pb-24 px-6 sm:px-12 max-w-4xl mx-auto border-b border-gray-100 mb-16 sm:mb-24 animate-fade-in text-center">
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="h-[1px] w-8 bg-accent" />
            <time className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}
            </time>
            <span className="h-[1px] w-8 bg-accent" />
          </div>
          
          <h1 
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-primary leading-[1] tracking-tighter mb-12"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          
          <div className="flex justify-center gap-12 text-[10px] font-bold tracking-[0.2em] text-secondary uppercase">
            <span>By Editorial Staff</span>
            <span>Est. 4 min read</span>
          </div>
        </header>

        {/* Hero Image - Optimized with next/image */}
        {imageUrl && (
          <div className="max-w-6xl mx-auto mb-20 sm:mb-32 px-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="aspect-[21/9] w-full bg-gray-50 overflow-hidden relative">
              <Image 
                src={imageUrl} 
                alt={imageAlt} 
                fill
                priority
                className="object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-1000" 
              />
            </div>
          </div>
        )}

        {/* Content Body - Prose powered */}
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
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* Footer Navigation */}
          <div className="mt-32 pt-16 border-t border-gray-100 flex flex-col items-center gap-12">
            <p className="text-[11px] font-bold tracking-[0.5em] text-gray-300 uppercase">
              End of Chapter
            </p>
            <Link 
              href="/" 
              className="group flex flex-col items-center gap-4 py-8"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-[0.6em] text-primary group-hover:text-accent transition-colors">
                Return to Index
              </span>
              <div className="w-12 h-[1px] bg-gray-200 group-hover:w-24 group-hover:bg-accent transition-all duration-700" />
            </Link>
          </div>
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
