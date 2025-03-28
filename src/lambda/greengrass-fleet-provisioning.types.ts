// this file is physically present in /lambda, as it is required for build the lambda zip
// the file is symlinked into /lib, as otherwise jsii is refusing to find it, even when the whole lambda directory is not ignored

import { CloudFormationCustomResourceResourcePropertiesCommon } from 'aws-lambda';

export type Config = {
  Account: string | undefined;
  Region: string | undefined;
};

export enum LogLevel {
  /* eslint-disable @typescript-eslint/naming-convention */
  ERROR,
  WARN,
  INFO,
  DEBUG,
  /* eslint-enable @typescript-eslint/naming-convention */
}

export interface ResourceProperties extends CloudFormationCustomResourceResourcePropertiesCommon {
  /* eslint-disable @typescript-eslint/naming-convention */
  Name: string;
  Description: string;
  StackName: string;
  Tags: Record<string, string>;
  LogLevel?: LogLevel;
  /* eslint-enable @typescript-eslint/naming-convention */
  ResourcePrefix: string;
  CertificateBucketName: string;
  CertificatePrefix: string;
}

export type CreateResourcesResponse = {
  certificateId: string;
  certificateArn: string;
  credentialEndpointAddress: string;
  dataEndpointAddress: string;

  // s3CertificatePem: string,
  // s3CertificatePrivateKey: string,
  // s3CertificatePublicKey: string,
  // s3CertificateRoot: string,

  // ssmParamCertificateId: string,
  // ssmParamCertificatePem: string,
  // ssmParamCertificatePrivateKey: string,
  // ssmParamCertificatePublicKey: string,
  // ssmParamCertificateRoot: string,
};
export type DeleteResourcesResponse = {
};
