/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '.*',
            },
            {
                protocol: 'http',
                hostname: 'localhost'
            },
            {
                protocol: 'https',
                hostname: 'es.web.img2.acsta.net',
            },
        ],
    },
    reactStrictMode : false,
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
