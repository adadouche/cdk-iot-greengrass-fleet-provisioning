import { beforeEach, describe, expect, test } from '@jest/globals';

import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {
  GreengrassFleetProvisioning,
  GreengrassFleetProvisioningProps,
} from '../src/index';
import { DEFAULT_ENV, normalizedTemplateFromStack } from './util';

describe('GreengrassFleetProvisioningStack', () => {
  const resource_prefix = "test";

  let app: cdk.App;
  let stack: cdk.Stack;
  let props: GreengrassFleetProvisioningProps;
  let template: Template;

  beforeEach(() => {
    app = new cdk.App();

    stack = new cdk.Stack(app, `${resource_prefix}-common`, {
      env: DEFAULT_ENV
    });

    // Create required resources for testing
    const certificateBucket: s3.Bucket = new s3.Bucket(stack, `${resource_prefix}-cert`);

    // Create the pipeline stack & props
    props = {
      resourcePrefix: 'greengrass-fleet-provisioning',
      env: DEFAULT_ENV,
      certificateBucket: certificateBucket,
      certificatePrefix: 'greengrass-fleet-provisioning',
    };

    new GreengrassFleetProvisioning(stack, `${resource_prefix}-construct`, props);

    // Create template from stack
    template = Template.fromStack(stack);
  });

  test('Lambda functions should be configured with latest nodeJS version', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler',
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

  test("Snapshot", () => {
    /* We must change some randomly generated file names used in the S3 asset construct. */
    const templateWithConstKeys = normalizedTemplateFromStack(stack);
    expect(templateWithConstKeys).toMatchSnapshot();
  });
});