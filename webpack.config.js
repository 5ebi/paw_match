import { createExpoWebpackConfigAsync } from '@expo/webpack-config';

const configureWebpack = async function (env, argv) {
  console.log('Webpack config is being loaded!');
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@prisma/client'],
      },
    },
    argv,
  );

  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    net: false,
    tls: false,
  };

  return config;
};

export default configureWebpack;
