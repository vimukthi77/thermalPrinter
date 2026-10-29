const http = require('http');

http.get('http://localhost:3000/', (res) => {
  console.log('GET http://localhost:3000/ -> Status:', res.statusCode);
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const cssMatches = Array.from(data.matchAll(/href="(\/_next\/static\/[^"]+)"/g)).map(m => m[1]);
    const jsMatches = Array.from(data.matchAll(/src="(\/_next\/static\/[^"]+)"/g)).map(m => m[1]);
    console.log('CSS URLs found:', cssMatches);
    console.log('JS URLs found:', jsMatches);

    for (const u of cssMatches) {
      http.get('http://localhost:3000' + u, (cRes) => {
        let body = '';
        cRes.on('data', c => body += c);
        cRes.on('end', () => {
          console.log('CSS URL:', u, '-> Status:', cRes.statusCode, 'Length:', body.length);
        });
      });
    }

    for (const u of jsMatches) {
      http.get('http://localhost:3000' + u, (jRes) => {
        let body = '';
        jRes.on('data', c => body += c);
        jRes.on('end', () => {
          console.log('JS URL:', u, '-> Status:', jRes.statusCode, 'Length:', body.length);
        });
      });
    }
  });
}).on('error', err => console.log('Err:', err.message));
