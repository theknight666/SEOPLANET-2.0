export default function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Pattern to match sensitive files
  const sensitivePattern = /\.(env|php|sql|bak|zip|htpasswd|log|ini|conf)$/;
  
  if (sensitivePattern.test(path) || path.includes('.git')) {
    return new Response('Not Found', { status: 404 });
  }
}
