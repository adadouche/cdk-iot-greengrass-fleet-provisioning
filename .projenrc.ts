import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Abdelhalim Dadouche',
  authorAddress: 'adadouche@hotmail.com',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.8.0',
  name: 'cdk-iot-greengrass-fleet-provisioning',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/adadouche/cdk-iot-greengrass-fleet-provisioning.git',
  sampleCode: false,

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();