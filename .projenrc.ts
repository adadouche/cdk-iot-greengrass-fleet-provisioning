import { awscdk } from 'projen';
import { javascript } from 'projen';
import { YarnNodeLinker } from 'projen/lib/javascript';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Abdelhalim Dadouche',
  authorAddress: 'adadouche@hotmail.com',
  cdkVersion: '2.185.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.8.0',
  name: 'cdk-iot-greengrass-fleet-provisioning',
  license: 'MIT',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/adadouche/cdk-iot-greengrass-fleet-provisioning.git',

  /* Runtime dependencies of this module. */
  deps: [
    "aws-cdk-lib@2.185.0"
  ],
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  /* Build dependencies for this module. */
  devDeps: [
    '@types/node',
    '@types/aws-lambda',
    '@aws-sdk/client-iot',
    '@aws-sdk/client-s3',
    '@aws-sdk/client-ssm',
    'esbuild',
    'aws-lambda',
    "aws-cdk@^2.185.0"
  ],
  
  // packageName: undefined,  /* The "name" in package.json. */
  packageManager: javascript.NodePackageManager.YARN_BERRY,
  yarnBerryOptions: {
    yarnRcOptions: {
      nodeLinker: YarnNodeLinker.NODE_MODULES
    }
  },
});

project.synth();