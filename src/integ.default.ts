import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {
  GreengrassFleetProvisioning,
  GreengrassFleetProvisioningProps,
} from './index';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyStack');

const certificateBucket: s3.Bucket = new s3.Bucket(stack, 'greengrass-fleet-provisioning-certificate-bucket', {
  enforceSSL: true,
  encryption: s3.BucketEncryption.S3_MANAGED,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
});

const props: GreengrassFleetProvisioningProps = {
  resourcePrefix: 'greengrass-fleet-provisioning',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  certificateBucket: certificateBucket,
  certificatePrefix: 'greengrass-fleet-provisioning',

};

new GreengrassFleetProvisioning(
  stack,
  'greengrass-fleet-provisioning',
  props,
);
