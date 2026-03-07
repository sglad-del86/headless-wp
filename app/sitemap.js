export default async function sitemap() {
  const baseUrl = 'https://project8change.com';

  const user = process.env.WP_USER;
  const pass = process.env.WP_PASS;
  const auth = Buffer.from(`${user}:${pass}`).toString('base64');

  // APIから全記事を取得してURLリストを作成
  const response = await fetch('https://cms.project8change.com/wp-json/wp/v2/posts?per_page=100', {
    headers: {
      'Authorization': `Basic ${auth}`
    }
  });
  const posts = await response.json();

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: new Date(post.modified),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postUrls,
  ];
}
