import {
  IoTClient,
  DeleteCertificateCommand,
  DeleteCertificateCommandInput,
  DeleteCertificateCommandOutput,
  CreateKeysAndCertificateCommand,
  CreateKeysAndCertificateCommandOutput,
  DescribeEndpointCommand,
  DescribeEndpointCommandInput,
  DescribeEndpointCommandOutput,
  UpdateCertificateCommand,
  UpdateCertificateCommandInput,
  UpdateCertificateCommandOutput,
} from '@aws-sdk/client-iot';

export interface IoTClientPort {
  createKeysAndCertificate: () => Promise<CreateKeysAndCertificateCommandOutput>;
  deleteCertificate: (input: DeleteCertificateCommandInput) => Promise<DeleteCertificateCommandOutput>;
  describeEndpoint: (input: DescribeEndpointCommandInput) => Promise<DescribeEndpointCommandOutput>;
  updateCertificate: (input: UpdateCertificateCommandInput) => Promise<UpdateCertificateCommandOutput>;
}

export const IoTClientAdapter = (client: IoTClient): IoTClientPort => {
  return {
    createKeysAndCertificate: async () => {
      return client.send(new CreateKeysAndCertificateCommand({
        setAsActive: true,
      }));
    },
    deleteCertificate: async (input) => {
      return client.send(new DeleteCertificateCommand(input));
    },
    describeEndpoint: async (input) => {
      return client.send(new DescribeEndpointCommand(input));
    },
    updateCertificate: async (input) => {
      return client.send(new UpdateCertificateCommand(input));
    },
  };
};
