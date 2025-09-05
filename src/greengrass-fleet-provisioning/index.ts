import { IoTClient } from '@aws-sdk/client-iot';
import { S3Client } from '@aws-sdk/client-s3';
import { SSMClient } from '@aws-sdk/client-ssm';

export * from './types';
export * from './iot';
export * from './s3';
export * from './ssm';

import { IoTClientAdapter } from './iot';
import { S3ClientAdapter } from './s3';
import { SSMClientAdapter } from './ssm';

import {
  CreateResourcesResponse,
  DeleteResourcesResponse,
  ResourceProperties,
} from './types';

const iotClient = IoTClientAdapter(new IoTClient());
const ssmClient = SSMClientAdapter(new SSMClient());
const s3Client = S3ClientAdapter(new S3Client());

export async function createResource(resource: ResourceProperties): Promise<CreateResourcesResponse> {
  const { certificateId, certificateArn, certificatePem, keyPair } = await iotClient.createKeysAndCertificate();
  console.log(`Iot Certificate - Created Certificate with Id ${certificateId}`);

  const pathCertificate: string = `${resource.CertificatePrefix}/${certificateId}`;
  const pathCertificatePem: string = `${pathCertificate}.pem`;
  const pathCertificatePrivateKey: string = `${pathCertificate}.key.prv`;
  const pathCertificatePublicKey: string = `${pathCertificate}.key.pub`;
  const pathCertificateRoot: string = `${pathCertificate}.root`;

  const response = await fetch('https://www.amazontrust.com/repository/AmazonRootCA1.pem');
  const buffer = await response.arrayBuffer();
  const certificateRootCA: string = Buffer.from(buffer).toString();

  await s3Client.putObject({
    Bucket: resource.CertificateBucketName,
    Key: `${pathCertificate}`,
    Body: certificateId,
  });
  await s3Client.putObject({
    Bucket: resource.CertificateBucketName,
    Key: `${pathCertificate}.arn`,
    Body: certificateArn,
  });
  await s3Client.putObject({
    Bucket: resource.CertificateBucketName,
    Key: `${pathCertificatePem}`,
    Body: certificatePem,
  });
  await s3Client.putObject({
    Bucket: resource.CertificateBucketName,
    Key: `${pathCertificatePrivateKey}`,
    Body: keyPair?.PrivateKey,
  });
  await s3Client.putObject({
    Bucket: resource.CertificateBucketName,
    Key: `${pathCertificatePublicKey}`,
    Body: keyPair?.PublicKey,
  });
  await s3Client.putObject({
    Bucket: resource.CertificateBucketName,
    Key: `${pathCertificateRoot}`,
    Body: certificateRootCA,
  });

  await ssmClient.putParameter({
    Name: `/${resource.ResourcePrefix}/certificateId`,
    Value: `${certificateId}`,
    Type: 'String',
    Overwrite: true,
  });
  await ssmClient.putParameter({
    Name: `/${resource.ResourcePrefix}/${certificateId}/pem`,
    Value: `${certificatePem}`,
    Type: 'String',
    Overwrite: true,
  });
  await ssmClient.putParameter({
    Name: `/${resource.ResourcePrefix}/${certificateId}/key-private`,
    Value: `${keyPair!.PrivateKey!}`,
    Type: 'String',
    Overwrite: true,
  });
  await ssmClient.putParameter({
    Name: `/${resource.ResourcePrefix}/${certificateId}/key-public`,
    Value: `${keyPair!.PublicKey!}`,
    Type: 'String',
    Overwrite: true,
  });
  await ssmClient.putParameter({
    Name: `/${resource.ResourcePrefix}/${certificateId}/root-ca`,
    Value: `${certificateRootCA}`,
    Type: 'String',
    Overwrite: true,
  });

  const credentialEndpointAddress = await iotClient.describeEndpoint({
    endpointType: 'iot:CredentialProvider',
  });
  const dataEndpointAddress = await iotClient.describeEndpoint({
    endpointType: 'iot:Data-ATS',
  });;

  return {
    certificateId: certificateId!,
    certificateArn: certificateArn!,
    credentialEndpointAddress: credentialEndpointAddress.endpointAddress!,
    dataEndpointAddress: dataEndpointAddress.endpointAddress!,

    // s3CertificatePem: `s3://${resource.CertificateBucketName}/${pathCertificatePem}`,
    // s3CertificatePrivateKey: `s3://${resource.CertificateBucketName}/${pathCertificatePrivateKey}`,
    // s3CertificatePublicKey: `s3://${resource.CertificateBucketName}/${pathCertificatePublicKey}`,
    // s3CertificateRoot: `s3://${resource.CertificateBucketName}/${pathCertificateRoot}`,

    // ssmParamCertificateId: `/${resource.ResourcePrefix}/certificateId`,
    // ssmParamCertificatePem: `/${resource.ResourcePrefix}/${certificateId}/pem`,
    // ssmParamCertificatePrivateKey: `/${resource.ResourcePrefix}/${certificateId}/key-private`,
    // ssmParamCertificatePublicKey: `/${resource.ResourcePrefix}/${certificateId}/key-public`,
    // ssmParamCertificateRoot: `/${resource.ResourcePrefix}/${certificateId}/root-ca`,
  };
}

export async function deleteResource(resource: ResourceProperties, certificateId: string): Promise<DeleteResourcesResponse> {

  const pathCertificate: string = `${resource.CertificatePrefix}/${certificateId}`;
  const pathCertificatePem: string = `${pathCertificate}.pem`;
  const pathCertificatePrivateKey: string = `${pathCertificate}.key.prv`;
  const pathCertificatePublicKey: string = `${pathCertificate}.key.pub`;
  const pathCertificateRoot: string = `${pathCertificate}.root`;

  await s3Client.deleteObject({
    Bucket: resource.CertificateBucketName,
    Key: `${pathCertificate}`,
  });
  await s3Client.deleteObject({
    Bucket: resource.CertificateBucketName,
    Key: `${pathCertificate}.arn`,
  });
  await s3Client.deleteObject({
    Bucket: resource.CertificateBucketName,
    Key: `${pathCertificatePem}`,
  });
  await s3Client.deleteObject({
    Bucket: resource.CertificateBucketName,
    Key: `${pathCertificatePrivateKey}`,
  });
  await s3Client.deleteObject({
    Bucket: resource.CertificateBucketName,
    Key: `${pathCertificatePublicKey}`,
  });
  await s3Client.deleteObject({
    Bucket: resource.CertificateBucketName,
    Key: `${pathCertificateRoot}`,
  });

  // delete if it's the current one
  const ssmParamCertificateId = await ssmClient.getParameter({
    Name: `/${resource.ResourcePrefix}/certificateId`,
  });
  if (ssmParamCertificateId.Parameter?.Value === certificateId) {
    await ssmClient.deleteParameter({
      Name: `/${resource.ResourcePrefix}/certificateId`,
    });
  }
  await ssmClient.deleteParameter({
    Name: `/${resource.ResourcePrefix}/${certificateId}/pem`,
  });
  await ssmClient.deleteParameter({
    Name: `/${resource.ResourcePrefix}/${certificateId}/key-private`,
  });
  await ssmClient.deleteParameter({
    Name: `/${resource.ResourcePrefix}/${certificateId}/key-public`,
  });
  await ssmClient.deleteParameter({
    Name: `/${resource.ResourcePrefix}/${certificateId}/root-ca`,
  });

  await iotClient.updateCertificate({
    certificateId: certificateId,
    newStatus: 'INACTIVE',
  });
  await iotClient.deleteCertificate({
    certificateId: certificateId,
  });

  return {
  };
}
