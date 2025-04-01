#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as cfn from 'aws-cdk-lib/aws-cloudformation';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as iot from 'aws-cdk-lib/aws-iot';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

/**
 * Properties of GreengrassFleetProvisioning construct
 */
export interface GreengrassFleetProvisioningProps extends cdk.ResourceProps {
  // The resource prefix
  readonly resourcePrefix: string;

  // The AWS environment (account/region) where this stack will be deployed.
  readonly env: cdk.Environment;

  // The bucket to save the certificate and private key files
  readonly certificateBucket: s3.IBucket;

  // The prefix to save the certificate and private key files in SSM and S3
  readonly certificatePrefix: string;
}

/**
 * A CDK Construct for creating an AWS IoT Greengrass Fleet Provisioning assets (including certificate via Custom Resource)
 */
export class GreengrassFleetProvisioning extends Construct {

  private props: GreengrassFleetProvisioningProps;

  public tokenExchangeRole: iam.Role;
  public fleetProvisioningRole: iam.Role;
  public provisioningClaimPolicy: iot.CfnPolicy;
  public tokenExchangeRoleAlias: iot.CfnRoleAlias;
  public deviceDefaultPolicy: iot.CfnPolicy;
  public fleetProvisionTemplate: iot.CfnProvisioningTemplate;
  public fleetProvisionCustomResource: cfn.CfnCustomResource;

  public certificateId: string;
  public certificateArn: string;
  public credentialEndpoint: string;
  public dataEndpoint: string;

  constructor(scope: Construct, id: string, props: GreengrassFleetProvisioningProps) {
    super(scope, id);
    this.props = props;

    this.tokenExchangeRole = this.addTokenExchangeRole();
    this.fleetProvisioningRole = this.addFleetProvisioningRole();
    this.provisioningClaimPolicy = this.addProvisioningClaimPolicy();
    this.tokenExchangeRoleAlias = this.addTokenExchangeRoleAlias();
    this.deviceDefaultPolicy = this.addDeviceDefaultPolicy();
    this.fleetProvisionTemplate = this.addFleetProvisioningTemplate();
    this.fleetProvisionCustomResource = this.addFleetProvisioningCustomResource();

    this.certificateId = this.addFleetProvisioningCertificateId();
    this.certificateArn = this.addFleetProvisioningCertificateArn();
    this.credentialEndpoint = this.addIoTCredentialEndpoint();
    this.dataEndpoint = this.addIoTDataEndpoint();

    new iot.CfnPolicyPrincipalAttachment(this, 'greengrass-provisioning-claim-policy-attachment', {
      policyName: `${this.addProvisioningClaimPolicy().policyName}`,
      principal: this.addFleetProvisioningCertificateArn(),
    });
  }

  private addFleetProvisioningCustomResource() {
    if (this.fleetProvisionCustomResource === undefined) {
      const lambdaFunction = new nodejs.NodejsFunction(this, 'function', {
        functionName: `${this.props.resourcePrefix}-gg-fleet-provisioning`,
        runtime: lambda.Runtime.NODEJS_LATEST,
        // entry: path.join(__dirname, 'lambda/greengrass-fleet-provisioning.handler.ts'),
        handler: 'handler',
        bundling: {
          minify: true, // minify code, defaults to false
          sourceMap: true, // include source maps, defaults to false
          sourceMapMode: nodejs.SourceMapMode.INLINE, // defaults to SourceMapMode.DEFAULT
          sourcesContent: false, // whether to include original source codes in source maps, defaults to true
          target: 'es2020', // target environment for the generated JavaScript code, defaults to es2020
        },
        timeout: cdk.Duration.seconds(30),
        logRetention: logs.RetentionDays.ONE_DAY,
      });
      lambdaFunction.addToRolePolicy(
        new iam.PolicyStatement({
          actions: [
            'iot:CreateKeysAndCertificate',
            'iot:DescribeEndpoint',
          ],
          resources: [
            '*',
          ],
        }),
      );
      lambdaFunction.addToRolePolicy(
        new iam.PolicyStatement({
          actions: [
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
          resources: [
            'arn:aws:logs:*:*:*',
            `arn:aws:s3:::${this.props.certificateBucket.bucketName}/${this.props.certificatePrefix}*`,
            `arn:aws:iam::${this.props.env.account}:role/${this.props.resourcePrefix}-*`,
            `arn:aws:iot:${this.props.env.region}:${this.props.env.account}:cert/*`,
            `arn:aws:ssm:${this.props.env.region}:${this.props.env.account}:parameter/${this.props.resourcePrefix}*`,
            `arn:aws:kms:${this.props.env.region}:${this.props.env.account}:key/*`,
          ],
        }),
      );

      const { serviceToken } = new cr.Provider(this, `${this.props.resourcePrefix}-cr-lambda-provider`, {
        onEventHandler: lambdaFunction,
        providerFunctionName: `${lambdaFunction.functionName}-provider`,
        logRetention: logs.RetentionDays.ONE_DAY,
      });

      this.fleetProvisionCustomResource = new cfn.CfnCustomResource(this, `${this.props.resourcePrefix}-cr`, {
        serviceToken: serviceToken,
        serviceTimeout: 60,
      });

      this.fleetProvisionCustomResource.addPropertyOverride('ResourcePrefix', this.props.resourcePrefix);
      this.fleetProvisionCustomResource.addPropertyOverride('CertificateBucketName', this.props.certificateBucket.bucketName);
      this.fleetProvisionCustomResource.addPropertyOverride('CertificatePrefix', this.props.certificatePrefix);
    }

    return this.fleetProvisionCustomResource;
  }

  private addFleetProvisioningCertificateId(): any {
    if (this.certificateId === undefined) {
      const _customResource = this.addFleetProvisioningCustomResource();
      this.certificateId = _customResource.getAtt('certificateId').toString();
    }
    return this.certificateId;
  }

  private addFleetProvisioningCertificateArn(): any {
    if (this.certificateArn === undefined) {
      const _customResource = this.addFleetProvisioningCustomResource();
      this.certificateArn = _customResource.getAtt('certificateArn').toString();
    }
    return this.certificateArn;
  }

  private addFleetProvisioningRole() {
    if (this.fleetProvisioningRole === undefined) {
      this.fleetProvisioningRole = new iam.Role(this, `${this.props.resourcePrefix}-gg-fleet-provisioning-role`, {
        roleName: `${this.props.resourcePrefix}-gg-fleet-provisioning`,
        assumedBy: new iam.ServicePrincipal('iot.amazonaws.com'),
        path: '/',
      });

      this.fleetProvisioningRole.assumeRolePolicy?.addStatements(
        new iam.PolicyStatement({
          principals: [
            new iam.ServicePrincipal('iot.amazonaws.com'),
          ],
          actions: [
            'sts:AssumeRole',
          ],
          effect: iam.Effect.ALLOW,
        }),
      );

      this.fleetProvisioningRole.addManagedPolicy({
        managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSIoTThingsRegistration',
      });

      this.fleetProvisioningRole.addToPolicy(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ['*'], // #TODO: - !Sub arn:aws:s3:::${S3BucketName} or !Sub arn:aws:s3:::${S3BucketName}/${S3BucketPrefixPattern}
          actions: [
            'iot:DescribeCertificate',
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents',
            'logs:DescribeLogStreams',
            's3:GetBucketLocation',
            's3:GetObject',
            's3:ListBucket',
            's3:PutObject',
            's3:PutObjectAcl',
          ],
        }),
      );
    }
    return this.fleetProvisioningRole;
  }

  private addFleetProvisioningTemplate() {
    if (this.fleetProvisionTemplate === undefined) {
      this.fleetProvisionTemplate = new iot.CfnProvisioningTemplate(this, `${this.props.resourcePrefix}-gg-provisioning-template`, {
        templateName: `${this.props.resourcePrefix}-gg-fleet-provisioning`,
        description: 'Fleet Provisioning template for AWS IoT Greengrass.',
        enabled: true,
        provisioningRoleArn: this.addFleetProvisioningRole().roleArn,
        templateBody: `
        {
          "Parameters": {
            "ThingName": {
              "Type": "String"
            },
            "ThingGroupName": {
              "Type": "String"
            },
            "AWS::IoT::Certificate::Id": {
              "Type": "String"
            }
          },
          "Resources": {
            "MyGreengrassThing": {
              "OverrideSettings": {
                "AttributePayload": "REPLACE",
                "ThingGroups": "REPLACE",
                "ThingTypeName": "REPLACE"
              },
              "Properties": {
                "AttributePayload": {},
                "ThingGroups": [
                  {
                    "Ref": "ThingGroupName"
                  }
                ],
                "ThingName": {
                  "Ref": "ThingName"
                }
              },
              "Type": "AWS::IoT::Thing"
            },
            "MyGreengrassPolicy": {
              "Properties": {
                "PolicyName": "${this.addDeviceDefaultPolicy().policyName}"
              },
              "Type": "AWS::IoT::Policy"
            },
            "MyGreengrassCertificate": {
              "Properties": {
                "CertificateId": {
                  "Ref": "AWS::IoT::Certificate::Id"
                },
                "Status": "Active"
              },
              "Type": "AWS::IoT::Certificate"
            }
          }
        }`,
      });
    }
    return this.fleetProvisionTemplate;
  }

  private addIoTCredentialEndpoint(): any {
    if (this.credentialEndpoint === undefined) {
      const _customResource = this.addFleetProvisioningCustomResource();
      this.credentialEndpoint = _customResource.getAtt('credentialEndpointAddress').toString();
    }
    return this.credentialEndpoint;
  }

  private addIoTDataEndpoint(): any {
    if (this.dataEndpoint === undefined) {
      const _customResource = this.addFleetProvisioningCustomResource();
      this.dataEndpoint = _customResource.getAtt('dataEndpointAddress').toString();
    }
    return this.dataEndpoint;
  }

  private addTokenExchangeRole() {
    if (this.tokenExchangeRole === undefined) {
      this.tokenExchangeRole = new iam.Role(this, `${this.props.resourcePrefix}-gg-token-exchange-role`, {
        roleName: `${this.props.resourcePrefix}-gg-token-exchange`,
        description: 'Greengrass core devices token exchange role',
        assumedBy: new iam.ServicePrincipal('credentials.iot.amazonaws.com'),
        path: '/',
      });

      this.tokenExchangeRole.assumeRolePolicy?.addStatements(
        new iam.PolicyStatement({
          principals: [
            new iam.ServicePrincipal('credentials.iot.amazonaws.com'),
          ],
          actions: [
            'sts:AssumeRole',
          ],
          effect: iam.Effect.ALLOW,
        }),
      );

      this.tokenExchangeRole.addToPolicy(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ['*'], // #TODO: - !Sub arn:aws:s3:::${S3BucketName} or !Sub arn:aws:s3:::${S3BucketName}/${S3BucketPrefixPattern}
          actions: [
            'iot:DescribeCertificate',
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents',
            'logs:DescribeLogStreams',
            's3:GetBucketLocation',
            's3:GetObject',
            's3:ListBucket',
            's3:PutObject',
            's3:PutObjectAcl',
          ],
        }),
      );
    }
    return this.tokenExchangeRole;

  }

  private addTokenExchangeRoleAlias() {
    if (this.tokenExchangeRoleAlias === undefined) {
      this.tokenExchangeRoleAlias = new iot.CfnRoleAlias(this, `${this.props.resourcePrefix}-gg-token-exchange-alias`, {
        roleAlias: `${this.props.resourcePrefix}-gg-token-exchange`,
        roleArn: this.addTokenExchangeRole().roleArn,
      });
    }
    return this.tokenExchangeRoleAlias;
  }

  private addDeviceDefaultPolicy() {
    if (this.deviceDefaultPolicy === undefined) {
      this.deviceDefaultPolicy = new iot.CfnPolicy(this, `${this.props.resourcePrefix}-gg-thing-policy`, {
        policyName: `${this.props.resourcePrefix}-gg-thing`,
        policyDocument: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'iot:Connect',
                'iot:Publish',
                'iot:Subscribe',
                'iot:Receive',
                'iot:Connect',
                'greengrass:*',
              ],
              resources: ['*'],
            }),
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'iot:AssumeRoleWithCertificate',
              ],
              resources: [this.addTokenExchangeRoleAlias().attrRoleAliasArn],
            }),
          ],
        }),
      });
    }
    return this.deviceDefaultPolicy;
  }

  private addProvisioningClaimPolicy() {
    if (this.provisioningClaimPolicy === undefined) {
      this.provisioningClaimPolicy = new iot.CfnPolicy(this, `${this.props.resourcePrefix}-gg-provisioning-claim-policy`, {
        policyName: `${this.props.resourcePrefix}-gg-fleet-provisioning`,
        policyDocument: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'iot:Connect',
              ],
              resources: ['*'],
            }),
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'iot:Publish',
                'iot:Receive',
              ],
              resources: [
                `arn:aws:iot:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:topic/$aws/certificates/create/*`,
                `arn:aws:iot:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:topic/$aws/provisioning-templates/${this.addFleetProvisioningTemplate().templateName}/provision/*`,
              ],
            }),
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'iot:Subscribe',
              ],
              resources: [
                `arn:aws:iot:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:topicfilter/$aws/certificates/create/*`,
                `arn:aws:iot:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:topicfilter/$aws/provisioning-templates/${this.addFleetProvisioningTemplate().templateName}/provision/*`,
              ],
            }),
          ],
        }),
      });
    }
    return this.provisioningClaimPolicy;
  }
}

