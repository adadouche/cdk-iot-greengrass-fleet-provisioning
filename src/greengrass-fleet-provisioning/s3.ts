import {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';

export interface S3ClientPort {
  deleteObject: (input: DeleteObjectCommandInput) => Promise<DeleteObjectCommandOutput>;
  putObject: (input: PutObjectCommandInput) => Promise<PutObjectCommandOutput>;
}

export const S3ClientAdapter = (client: S3Client): S3ClientPort => {
  return {
    deleteObject: async (input) => {
      return client.send(new DeleteObjectCommand(input));
    },
    putObject: async (input) => {
      return client.send(new PutObjectCommand(input));
    },
  };
};
