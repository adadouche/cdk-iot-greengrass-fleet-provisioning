import { IoTClient } from '@aws-sdk/client-iot';
import { S3Client } from '@aws-sdk/client-s3';
import { SSMClient } from '@aws-sdk/client-ssm';
import { ServiceException } from '@smithy/smithy-client';
import {
  CdkCustomResourceEvent,
  CdkCustomResourceResponse,
  Context,
  Callback,
} from 'aws-lambda';
import {
  CreateResourcesResponse,
  DeleteResourcesResponse,
  ResourceProperties,
} from './greengrass-fleet-provisioning.types';
import { IoTClientAdapter } from './lib/iot';
import { S3ClientAdapter } from './lib/s3';
import { SSMClientAdapter } from './lib/ssm';

const iotClient = IoTClientAdapter(new IoTClient());
const ssmClient = SSMClientAdapter(new SSMClient());
const s3Client = S3ClientAdapter(new S3Client());

export const handler = async (event: CdkCustomResourceEvent<ResourceProperties>, context: Context, _callback: Callback): Promise<CdkCustomResourceResponse> => {
  const response: CdkCustomResourceResponse = {
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    PhysicalResourceId: context.logGroupName,
    Status: 'SUCCESS',
  };

  console.log(`RequestType : ${event.RequestType}`);

  try {
    if (event.RequestType === 'Create') {
      response.Data = await createResource(event.ResourceProperties);
      response.PhysicalResourceId = response.Data.certificateId;
    } else if (event.RequestType === 'Delete') {
      response.Data = await deleteResource(event.ResourceProperties, event.PhysicalResourceId);
      response.PhysicalResourceId = event.PhysicalResourceId;
    } else if (event.RequestType === 'Update') {
      response.PhysicalResourceId = event.PhysicalResourceId;
      // response.Data = await deleteResource(event.ResourceProperties);
      // response.Data = await createResource(event.ResourceProperties);
    } else {
      throw new Error('Received invalid request type');
    }
  } catch (err) {
    console.error(`catching error : ${err}`);
    const reason = (err as ServiceException).message;
    response.Status = 'FAILED';
    response.Reason = reason;
    throw new Error(`Received an exception with the following message: ${reason}`);
    // @ts-ignore
    response.PhysicalResourceId = event.PhysicalResourceId || LogicalResourceId;
  }
  console.log('Response:');
  console.log(`${JSON.stringify(response)}`);
  return response;
};

async function createResource(resource: ResourceProperties): Promise<CreateResourcesResponse> {
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
    endpointType: 'iot:CredentialProvider',
  });;

  return {
    certificateId: certificateId!,
    certificateArn: certificateArn!,
    credentialEndpointAddress: credentialEndpointAddress.endpointAddress!,
    dataEndpointAddress: dataEndpointAddress.endpointAddress!,
  };
}

async function deleteResource(resource: ResourceProperties, certificateId: string): Promise<DeleteResourcesResponse> {

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