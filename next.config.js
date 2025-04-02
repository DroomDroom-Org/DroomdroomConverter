/** @type {import('next').NextConfig} */
const nextConfig = {
	async headers() {
		return [
		  {
			source: '/:path*',
			headers: [
			  {
				key: 'Access-Control-Allow-Origin',
				value: '*'
			  }
			]
		  }
		]
	  },
  basePath: '/converter',
  assetPrefix: '/converter',
  publicRuntimeConfig: {
    basePath: '/converter',
    apiPath: '/converter/api',
    cmcImageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64',
    // Add any other public config values here
  },
  // Add rewrites for sitemap.xml and robots.txt to make them accessible at the root
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/converter/sitemap.xml',
      },
      {
        source: '/robots.txt',
        destination: '/converter/robots.txt',
      }
    ];
  },
	swcMinify: true,
	compiler: {
		styledComponents: true,
	},
	images: {
		domains: ['assets.coingecko.com', 'res.cloudinary.com',"*","s2.coinmarketcap.com"],
		formats: ['image/webp'],
	},
	async redirects() {
		return [
			{
				source: '/community/profile',
				destination: '/community/articles',
				permanent: true,
			},
		];
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	  },
};

module.exports = nextConfig;
