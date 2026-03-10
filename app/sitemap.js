export default async function sitemap() {
  const baseUrl = 'https://project8change.com';

  const user = process.env.WP_USER;
  const pass = process.env.WP_PASS;
  const auth = Buffer.from(`${user}:${pass}`).toString('base64');

  const [postsRes, pagesRes] = await Promise.all([
    fetch('https://cms.project8change.com/wp-json/wp/v2/posts?per_page=100', {
      headers: { 'Authorization': `Basic ${auth}` }
    }),
    fetch('https://cms.project8change.com/wp-json/wp/v2/pages?per_page=100', {
      headers: { 'Authorization': `Basic ${auth}` }
    })
  ]);

  const posts = await postsRes.json();
  const pages = await pagesRes.json();

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: new Date(post.modified),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const pageUrls = pages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(page.modified),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...pageUrls,
    ...postUrls,
  ];
}
