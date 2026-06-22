export default async function handler(req, res) {
  // Parse the incoming request URL
  const urlObj = new URL(req.url, 'http://localhost');
  
  // Extract the original path captured by the vercel rewrite
  const path = urlObj.searchParams.get('path') || '';
  urlObj.searchParams.delete('path');
  
  // Reconstruct any original query parameters
  const search = urlObj.searchParams.toString();
  const queryString = search ? `?${search}` : '';
  
  // Construct the target URL (the original URL the bot requested)
  const targetUrl = `https://seoplanet.in/${path}${queryString}`;
  
  // Construct the Prerender.io API URL
  const prerenderUrl = `https://service.prerender.io/${targetUrl}`;

  try {
    const response = await fetch(prerenderUrl, {
      headers: {
        'X-Prerender-Token': process.env.PRERENDER_TOKEN || '',
      },
    });

    if (!response.ok) {
      console.error(`Prerender API error ${response.status}: ${response.statusText} for URL: ${targetUrl}`);
      return res.status(response.status).send('Error fetching prerendered content');
    }

    const body = await response.text();
    
    res.status(response.status);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Set caching headers so Vercel edge caches the prerendered HTML
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');
    res.send(body);
  } catch (error) {
    console.error('Error proxying to Prerender.io:', error);
    res.status(500).send('Internal Server Error while communicating with Prerender service');
  }
}
