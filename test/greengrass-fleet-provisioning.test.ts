import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as assertions from 'aws-cdk-lib/assertions';
import {
  GreengrassFleetProvisioning,
  GreengrassFleetProvisioningProps
} from '../src/index';

const mockApp = new cdk.App();
const stack = new cdk.Stack(mockApp);

const certificateBucket: s3.Bucket = new s3.Bucket(stack, 'greengrass-fleet-provisioning-certificate-bucket');

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
  'test-greengrass-fleet-provisioning',
  props,
);

const template = assertions.Template.fromStack(stack);

test('Lambda functions should be configured with latest nodeJS version', () => {
  template.hasResourceProperties("AWS::Lambda::Function", {
    Handler: "index.handler",
    FunctionName: `${props.resourcePrefix}-gg-fleet-provisioning`,
    Runtime: lambda.Runtime.NODEJS_LATEST,
  });
});


test('Lambda functions should be configured with proper execution roles', () => {
  template.allResourcesProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'lambda.amazonaws.com',
          },
        },
      ],
      Version: '2012-10-17',
    },
  });


});
