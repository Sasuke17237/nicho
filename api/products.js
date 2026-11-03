// Vercel Serverless API: /api/products
// Handles real-time cross-device sync and saves to GitHub

const GITHUB_REPO = 'Sasuke17237/nicho';
const FILE_PATH = 'data/products.json';

function getToken(req) {
  return process.env.GITHUB_TOKEN || (req && req.headers ? req.headers['x-github-token'] : '') || '';
}

// In-memory runtime cache for instant cross-device sync
let memoryCache = null;

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-github-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Return current products
  if (req.method === 'GET') {
    if (memoryCache && Array.isArray(memoryCache) && memoryCache.length > 0) {
      return res.status(200).json(memoryCache);
    }

    try {
      const token = getToken(req);
      const getUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;
      const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Vercel-Serverless-Store'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const ghRes = await fetch(getUrl, { headers });

      if (ghRes.ok) {
        const fileData = await ghRes.json();
        const jsonContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const parsed = JSON.parse(jsonContent);
        memoryCache = parsed;
        return res.status(200).json(parsed);
      }
    } catch (err) {
      console.warn('Could not fetch from GitHub, falling back:', err);
    }

    return res.status(200).json([]);
  }

  // POST: Save updated products to memory cache & GitHub
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      const products = Array.isArray(body) ? body : (body && body.products ? body.products : null);

      if (!products || !Array.isArray(products)) {
        return res.status(400).json({ error: 'Lista de produtos inválida.' });
      }

      // Update in-memory cache immediately
      memoryCache = products;

      const token = getToken(req);
      if (!token) {
        return res.status(200).json({
          success: true,
          warning: 'Salvo em cache de memória do servidor. Para persistência permanente, configure GITHUB_TOKEN na Vercel.',
          count: products.length
        });
      }

      const fileUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;

      // 1. Get current SHA of data/products.json
      let sha = null;
      try {
        const getShaRes = await fetch(fileUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Vercel-Serverless-Store'
          }
        });
        if (getShaRes.ok) {
          const shaData = await getShaRes.json();
          sha = shaData.sha;
        }
      } catch (e) {
        console.warn('Error fetching SHA:', e);
      }

      // 2. Commit updated products to GitHub
      const jsonString = JSON.stringify(products, null, 2);
      const encoded = Buffer.from(jsonString, 'utf-8').toString('base64');

      const commitRes = await fetch(fileUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Vercel-Serverless-Store'
        },
        body: JSON.stringify({
          message: 'update: produtos atualizados via painel kakashi',
          content: encoded,
          sha: sha
        })
      });

      if (commitRes.ok) {
        return res.status(200).json({
          success: true,
          message: 'Produtos salvos e sincronizados com sucesso!',
          count: products.length
        });
      } else {
        const errData = await commitRes.json();
        return res.status(200).json({
          success: true,
          warning: errData.message || 'Sincronizado na memória.',
          count: products.length
        });
      }
    } catch (err) {
      console.error('Server error saving products:', err);
      return res.status(500).json({ error: 'Erro interno ao salvar produtos.' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' });
};
