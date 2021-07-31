const { utils: { fromBuildIdentifier } } = require('@electron-forge/core');

const IS_BETA = true;

module.exports = {
  buildIdentifier: true ? 'beta' : 'prod',
  hooks: {
    postPackage: async (forgeConfig, options) => {
      if (options.spinner) {
        options.spinner.info(`Completed packaging for ${options.platform} / ${options.arch} at ${options.outputPaths[0]}`);
      }
    }
  },
  packagerConfig: {
    appBundleId: fromBuildIdentifier({ beta: 'com.rbx.betacollector', prod: 'com.rbx.collector' })
  }
}