import { awscdk } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Abdelhalim Dadouche',
  authorAddress: 'adadouche@hotmail.com',
  
  packageName: "cdk-iot-greengrass-fleet-provisioning",  /* The "name" in package.json. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  cdkVersion: '2.185.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.8.0',
  name: 'cdk-iot-greengrass-fleet-provisioning',
  license: 'MIT',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/adadouche/cdk-iot-greengrass-fleet-provisioning.git',

  /* Runtime dependencies of this module. */
  deps: [
    'aws-cdk-lib@2.185.0',
  ],
  /* Build dependencies for this module. */
  devDeps: [
    '@types/aws-lambda@^8.10.147',
    '@types/node@^20.14.8',
    '@jest/globals',
    '@smithy/smithy-client',
    'esbuild@^0.25.1',
    'aws-cdk@^2.185.0',
  ],
  bundledDeps: [
    '@aws-sdk/client-iot@^3.758.0',
    '@aws-sdk/client-s3@^3.758.0',
    '@aws-sdk/client-ssm@^3.758.0',
    'aws-lambda@^1.0.7',
  ],
});
project.synth();