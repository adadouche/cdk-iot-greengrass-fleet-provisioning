import { ServiceException } from '@smithy/smithy-client';
import {
  CdkCustomResourceEvent,
  CdkCustomResourceResponse,
  Context,
  Callback,
} from 'aws-lambda';
import { createResource, deleteResource } from './greengrass-fleet-provisioning';
import { ResourceProperties } from './greengrass-fleet-provisioning/types';

export const handler = async (
  event: CdkCustomResourceEvent<ResourceProperties>,
  context: Context,
  _callback: Callback,
): Promise<CdkCustomResourceResponse> => {
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
