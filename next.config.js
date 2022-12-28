/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGO_URL:
      "mongodb+srv://Karam_Shbeb:KHR1Fgen9LcYCtQK@cluster0.ylkyu3l.mongodb.net/?retryWrites=true&w=majority",
  },
};

module.exports = nextConfig;
