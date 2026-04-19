// generateSnapRoutes.js
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_DATABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function generateRoutes() {
  const { data, error } = await supabase
    .from('articles')
    .select('slug');

  if (error) {
    console.error('Failed to fetch articles:', error);
    process.exit(1);
  }

  const routes = ['/', '/en', '/ar', '/ckb', ...data.map((a) => `/en/articles/${a.slug}`)];

  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  pkg.reactSnap = { ...pkg.reactSnap, routes };
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

  console.log('✅ React Snap routes updated:', routes);
}

generateRoutes();
