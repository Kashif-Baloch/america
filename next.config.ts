import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: { ignoreBuildErrors: true },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    unoptimized: true
  }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
