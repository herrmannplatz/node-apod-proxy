const http = require('http');
const { URL } = require('url');

const httpProxy = require('http-proxy');

const apiKey = process.env.API_KEY;
const port = process.env.PORT || 3001;

if (!apiKey) {
  console.log('Missing api key.');
  process.exit(1);
}

const proxy = httpProxy.createProxyServer({});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  const urlWithKey = new URL(proxyReq.path, 'https://example.org');
  urlWithKey.searchParams.append('api_key', apiKey);
  proxyReq.path = `${urlWithKey.pathname}${urlWithKey.search}`;
});

var server = http.createServer(function(req, res) {
  proxy.web(req, res, {
    target: 'https://api.nasa.gov',
    headers: {
      host: 'api.nasa.gov'
    }
  });
});

server.listen(port);
console.log(`listening on port ${port}`);
