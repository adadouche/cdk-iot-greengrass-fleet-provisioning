import { awscdk, javascript } from 'projen';
import { YarnNodeLinker } from 'projen/lib/javascript';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Abdelhalim Dadouche',
  authorAddress: 'adadouche@hotmail.com',
  packageName: 'cdk-iot-greengrass-fleet-provisioning', /* The "name" in package.json. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  cdkVersion: '2.186.0',
  jsiiVersion: '~5.8.0',
  defaultReleaseBranch: 'main',
  name: 'cdk-iot-greengrass-fleet-provisioning',
  license: 'MIT',
  projenrcTs: true,
  keywords: [
    'cdk', 'AWS', 'AWS IoT Core', 'AWS IoT Greengrass', 'AWS IoT Certificate',
  ],
  repositoryUrl: 'https://github.com/adadouche/cdk-iot-greengrass-fleet-provisioning.git',
  /* Runtime dependencies of this module. */
  deps: [
    // 'aws-cdk-lib@^2.186.0',
  ],
  /* Build dependencies for this module. */
  devDeps: [
    '@types/aws-lambda@^8.10.147',
    '@types/node@^20.14.8',
    '@jest/globals',
    'esbuild@^0.25.1',
    'aws-cdk-lib@^2.186.0',
  ],
  bundledDeps: [
    '@aws-sdk/client-iot@^3.777.0',
    '@aws-sdk/client-s3@^3.777.0',
    '@aws-sdk/client-ssm@^3.777.0',
    '@smithy/smithy-client@^4.2.0',
    'aws-lambda@^1.0.7',
  ],
  packageManager: javascript.NodePackageManager.YARN_BERRY,
  yarnBerryOptions: {
    version: '4.7.0',
    yarnRcOptions: {
      nodeLinker: YarnNodeLinker.NODE_MODULES,
    },
  },
  workflowNodeVersion: '20.14.0',
  workflowPackageCache: true,
  workflowBootstrapSteps: [
    {
      name: 'Enable Corepack',
      run: 'corepack enable',
    },
  ],
  // dependabot: true,
});
project.synth();