import {
  SSMClient,
  GetParameterCommand,
  GetParameterCommandInput,
  GetParameterCommandOutput,
  DeleteParameterCommand,
  DeleteParameterCommandInput,
  DeleteParameterCommandOutput,
  PutParameterCommand,
  PutParameterCommandInput,
  PutParameterCommandOutput,
} from '@aws-sdk/client-ssm';

export interface SSMClientPort {
  getParameter: (input: GetParameterCommandInput) => Promise<GetParameterCommandOutput>;
  deleteParameter: (input: DeleteParameterCommandInput) => Promise<DeleteParameterCommandOutput>;
  putParameter: (input: PutParameterCommandInput) => Promise<PutParameterCommandOutput>;
}

export const SSMClientAdapter = (client: SSMClient): SSMClientPort => {
  return {
    getParameter: async (input) => {
      return client.send(new GetParameterCommand(input));
    },
    deleteParameter: async (input) => {
      return client.send(new DeleteParameterCommand(input));
    },
    putParameter: async (input) => {
      return client.send(new PutParameterCommand(input));
    },
  };
};
