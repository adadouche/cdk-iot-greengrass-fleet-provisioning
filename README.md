
[![Source](https://img.shields.io/badge/Source-GitHub-blue?logo=github)][source]
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
[![GitHub](https://img.shields.io/github/license/adadouche/cdk-iot-greengrass-fleet-provisioning?style=flat-square)](https://github.com/adadouche/cdk-iot-greengrass-fleet-provisioning/blob/main/LICENSE)
[![npm package](https://img.shields.io/npm/v/cdk-iot-greengrass-fleet-provisioning?color=brightgreen&style=flat-square)](https://www.npmjs.com/package/cdk-iot-greengrass-fleet-provisioning)
[![GitHub Workflow](https://img.shields.io/github/actions/workflow/status/adadouche/cdk-iot-greengrass-fleet-provisioning/release.yml?branch=main&label=release&style=flat-square)](https://github.com/adadouche/cdk-iot-greengrass-fleet-provisioning/actions/workflows/release.yml)
[![GitHub release](https://img.shields.io/github/v/release/adadouche/cdk-iot-greengrass-fleet-provisioning?sort=semver&style=flat-square)](https://github.com/adadouche/cdk-iot-greengrass-fleet-provisioning/releases)
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod&style=flat-square)](https://gitpod.io/#https://github.com/adadouche/cdk-iot-greengrass-fleet-provisioning)

# CDK Construct for AWS IoT Greengrass Fleet Provisioning (with AWS IoT Certificates)

[AWS CDK] L3 construct for managing AWS IoT fleet provisioning for Greengrass devices (including [AWS IoT Core] Certificates).

> This construct was largely inspired by the [CDK IoT Core Certificates](https://constructs.dev/packages/cdk-iot-core-certificates) construct developped by [devops-at-home](https://github.com/devops-at-home)  which was archived on [GitHub](https://github.com/devops-at-home/cdk-iot-core-certificates) hence the need for a new CDK Construct.
>

As mentioned in the orginal construct, CloudFormation doesn't directly support creation of certificates for AWS IoT Core. 
Also in order to provison fleets of devices, the AWS IoT Greengrass requires a number of assets that needs to be manually created including an AWS IoT Certificate.

This construct provides an easy interface for creating AWS IoT Greengrass fleet provisioning assests.

It will create the following:
- Token Exchange IAM Role
- Token Exchange IoT Role Alias
- Fleet Provisioning IAM Role
- IoT Claim Policy
- IoT Default Device Policy
- IoT Fleet Provisioning Template
- Lambda based Custom resource

The Lambda based Custom resource will:
- Create an AWS IoT Certificate
- Store the IoT Certificate generated assest (PEM, Keys and Root CA) in S3
- Store the IoT Certificate generated assest (PEM, Keys and Root CA) as SSM Parameters

### Certificates in S3 & Certificates in SSM Parameter Store

The certificates stored in S3 will be using the following path format :
    
    `<prefix>/<certificate-id>.<object-type>`

The certificates stored in SSM Parameter Store will be using the following name format :
    
    `/<prefix>/<certificate-id>/<object-type>`

where :
- `prefix` : provided via the construct attribute `resourcePrefix`
- `certificate-id` : represents the generated AWS IoT Certificate Id
- `object-type` : one of the following 
    - `arn`: contains the AWS IoT Certificate ARN
    - `pem`: contains the AWS IoT Certificate PEM
    - `key.prv` / `key-private`: contains the AWS IoT Certificate Public Key
    - `key.pub` / `key-public` : contains the AWS IoT Certificate Private Key
    - `root` / `root-ca`: contains the AWS Root CA

An additional S3 file with no extension will contain the AWS IoT Certificate Id.

An additional SSM Parameter Store entry (`/<prefix>/certificateId`) will contain the AWS IoT Certificate Id.

## Installation

This package has peer dependencies, which need to be installed along in the expected version.

For TypeScript/NodeJS, add these to your `dependencies` in `package.json`:

-   cdk-iot-greengrass-fleet-provisioning

## Usage

```ts
import { GreengrassFleetProvisioning } from 'cdk-iot-greengrass-fleet-provisioning';

const {
    tokenExchangeRole, /* iam.Role */
    fleetProvisioningRole, /* iam.Role */
    provisioningClaimPolicy, /* iot.CfnPolicy */
    tokenExchangeRoleAlias, /* iot.CfnRoleAlias */
    deviceDefaultPolicy, /* iot.CfnPolicy */
    fleetProvisionTemplate, /* iot.CfnProvisioningTemplate */
    fleetProvisionCustomResource, /* cfn.CfnCustomResource */

    certificateId, /* string */
    certificateArn, /* string */
    credentialEndpoint, /* string - AWS IoT Credential Endpoint*/
    dataEndpoint, /* string - AWS IoT Data Endpoint*/
} = new GreengrassFleetProvisioning(this, 'greengrass-fleet-provisioning', {
    env: env /* cdk.Environment */,
    resourcePrefix: resourcePrefix /* string*/ ,
    certificateBucket: certificateBucket /* cdk.aws_s3.Bucket*/,
    certificatePrefix: certificatePrefix /* string */,
});
```

[AWS CDK]: https://aws.amazon.com/cdk/
[AWS CloudFormation Custom Resource]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html
[AWS IoT Core]: https://aws.amazon.com/iot-core/
[AWS SSM Parameter Store]: https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html

[npm]:  https://www.npmjs.com/package/cdk-iot-greengrass-fleet-provisioning
[docs]: https://awscdk.io/packages/cdk-iot-greengrass-fleet-provisioning

[source]:  https://github.com/adadouche/cdk-iot-greengrass-fleet-provisioning
[release]: https://github.com/adadouche/cdk-iot-greengrass-fleet-provisioning/actions/workflows/release.yml
[license]: https://github.com/adadouche/cdk-iot-greengrass-fleet-provisioning/blob/main/LICENSE