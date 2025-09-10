/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // ✅ Optimisation des images pour éviter le rechargement
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 an de cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Configuration pour éviter le déchargement
    loader: 'default',
    unoptimized: false, // ✅ Réactive l'optimisation
  },
  // ✅ Optimisations de performance
  experimental: {
    // optimizeCss: true, // ❌ Temporairement désactivé pour le debug
    optimizePackageImports: ['lucide-react'],
  },
  // ✅ Configuration pour la stabilité des assets
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
