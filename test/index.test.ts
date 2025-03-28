import { beforeEach, describe, expect, test } from '@jest/globals';

import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { DEFAULT_ENV, normalizedTemplateFromStack } from './util';
import {
  GreengrassFleetProvisioning,
  GreengrassFleetProvisioningProps,
} from '../src/index';

describe('GreengrassFleetProvisioningStack', () => {
  const resource_prefix = 'test';

  let app: cdk.App;
  let stack: cdk.Stack;
  let construct: GreengrassFleetProvisioning;
  let props: GreengrassFleetProvisioningProps;
  let template: Template;

  beforeEach(() => {
    app = new cdk.App();

    stack = new cdk.Stack(app, `${resource_prefix}-common`, {
      env: DEFAULT_ENV,
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

    construct = new GreengrassFleetProvisioning(stack, `${resource_prefix}-construct`, props);

    // Create template from stack
    template = Template.fromStack(stack);
  });

  test('Lambda functions should be configured with latest nodeJS version', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler',
      FunctionName: `${props.resourcePrefix}-gg-fleet-provisioning`,
      Runtime: lambda.Runtime.NODEJS_LATEST.toString(),
    });
  });


  test('Lambda functions should be configured with proper execution roles -> 1', () => {
    template.resourcePropertiesCountIs('AWS::IAM::Role', {
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
    }, 3);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyName: Match.stringLikeRegexp(`${construct.node.id.replace(/-/g, '')}functionServiceRoleDefaultPolicy*`),
      PolicyDocument: {
        Statement: Match.arrayWith([Match.objectLike(
          {
            Action: [
              'logs:CreateLogGroup',
              'logs:CreateLogStream',
              'logs:PutLogEvents',
              'iam:PassRole',
              'iot:DeleteCertificate',
              'iot:UpdateCertificate',
              'kms:GenerateDataKey',
              's3:DeleteObject',
              's3:PutObject',
              'ssm:DeleteParameter',
              'ssm:GetParameter',
              'ssm:PutParameter',
            ],
            Effect: 'Allow',
            Resource: [
              'arn:aws:logs:*:*:*', {
                'Fn::Join': [
                  '',
                  [
                    'arn:aws:s3:::',
                    {
                      Ref: Match.stringLikeRegexp(`${resource_prefix}cert*`),
                    },
                    `/${props.certificatePrefix}*`,
                  ],
                ],
              },
              `arn:aws:iam::${props.env.account}:role/${props.resourcePrefix}-*`,
              `arn:aws:iot:${props.env.region}:${props.env.account}:cert/*`,
              `arn:aws:ssm:${props.env.region}:${props.env.account}:parameter/${props.resourcePrefix}*`,
              `arn:aws:kms:${props.env.region}:${props.env.account}:key/*`,
            ],
          },
        )]),
      },
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([Match.objectLike(
          {
            Action: [
              'iot:CreateKeysAndCertificate',
              'iot:DescribeEndpoint',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
        )]),
      },
    });
  });

  test('Snapshot', () => {
    /* We must change some randomly generated file names used in the S3 asset construct. */
    const templateWithConstKeys = normalizedTemplateFromStack(stack);
    expect(templateWithConstKeys).toMatchSnapshot();
  });
});