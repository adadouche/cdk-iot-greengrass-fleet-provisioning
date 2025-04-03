# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### GreengrassFleetProvisioning <a name="GreengrassFleetProvisioning" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning"></a>

A CDK Construct for creating an AWS IoT Greengrass Fleet Provisioning assets (including certificate via Custom Resource).

#### Initializers <a name="Initializers" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.Initializer"></a>

```typescript
import { GreengrassFleetProvisioning } from 'cdk-iot-greengrass-fleet-provisioning'

new GreengrassFleetProvisioning(scope: Construct, id: string, props: GreengrassFleetProvisioningProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps">GreengrassFleetProvisioningProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps">GreengrassFleetProvisioningProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.isConstruct"></a>

```typescript
import { GreengrassFleetProvisioning } from 'cdk-iot-greengrass-fleet-provisioning'

GreengrassFleetProvisioning.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.certificateArn">certificateArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.certificateId">certificateId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.credentialEndpoint">credentialEndpoint</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.dataEndpoint">dataEndpoint</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.deviceDefaultPolicy">deviceDefaultPolicy</a></code> | <code>aws-cdk-lib.aws_iot.CfnPolicy</code> | *No description.* |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.fleetProvisionCustomResource">fleetProvisionCustomResource</a></code> | <code>aws-cdk-lib.aws_cloudformation.CfnCustomResource</code> | *No description.* |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.fleetProvisioningRole">fleetProvisioningRole</a></code> | <code>aws-cdk-lib.aws_iam.Role</code> | *No description.* |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.fleetProvisionTemplate">fleetProvisionTemplate</a></code> | <code>aws-cdk-lib.aws_iot.CfnProvisioningTemplate</code> | *No description.* |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.provisioningClaimPolicy">provisioningClaimPolicy</a></code> | <code>aws-cdk-lib.aws_iot.CfnPolicy</code> | *No description.* |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.tokenExchangeRole">tokenExchangeRole</a></code> | <code>aws-cdk-lib.aws_iam.Role</code> | *No description.* |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.tokenExchangeRoleAlias">tokenExchangeRoleAlias</a></code> | <code>aws-cdk-lib.aws_iot.CfnRoleAlias</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `certificateArn`<sup>Required</sup> <a name="certificateArn" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.certificateArn"></a>

```typescript
public readonly certificateArn: string;
```

- *Type:* string

---

##### `certificateId`<sup>Required</sup> <a name="certificateId" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.certificateId"></a>

```typescript
public readonly certificateId: string;
```

- *Type:* string

---

##### `credentialEndpoint`<sup>Required</sup> <a name="credentialEndpoint" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.credentialEndpoint"></a>

```typescript
public readonly credentialEndpoint: string;
```

- *Type:* string

---

##### `dataEndpoint`<sup>Required</sup> <a name="dataEndpoint" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.dataEndpoint"></a>

```typescript
public readonly dataEndpoint: string;
```

- *Type:* string

---

##### `deviceDefaultPolicy`<sup>Required</sup> <a name="deviceDefaultPolicy" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.deviceDefaultPolicy"></a>

```typescript
public readonly deviceDefaultPolicy: CfnPolicy;
```

- *Type:* aws-cdk-lib.aws_iot.CfnPolicy

---

##### `fleetProvisionCustomResource`<sup>Required</sup> <a name="fleetProvisionCustomResource" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.fleetProvisionCustomResource"></a>

```typescript
public readonly fleetProvisionCustomResource: CfnCustomResource;
```

- *Type:* aws-cdk-lib.aws_cloudformation.CfnCustomResource

---

##### `fleetProvisioningRole`<sup>Required</sup> <a name="fleetProvisioningRole" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.fleetProvisioningRole"></a>

```typescript
public readonly fleetProvisioningRole: Role;
```

- *Type:* aws-cdk-lib.aws_iam.Role

---

##### `fleetProvisionTemplate`<sup>Required</sup> <a name="fleetProvisionTemplate" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.fleetProvisionTemplate"></a>

```typescript
public readonly fleetProvisionTemplate: CfnProvisioningTemplate;
```

- *Type:* aws-cdk-lib.aws_iot.CfnProvisioningTemplate

---

##### `provisioningClaimPolicy`<sup>Required</sup> <a name="provisioningClaimPolicy" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.provisioningClaimPolicy"></a>

```typescript
public readonly provisioningClaimPolicy: CfnPolicy;
```

- *Type:* aws-cdk-lib.aws_iot.CfnPolicy

---

##### `tokenExchangeRole`<sup>Required</sup> <a name="tokenExchangeRole" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.tokenExchangeRole"></a>

```typescript
public readonly tokenExchangeRole: Role;
```

- *Type:* aws-cdk-lib.aws_iam.Role

---

##### `tokenExchangeRoleAlias`<sup>Required</sup> <a name="tokenExchangeRoleAlias" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioning.property.tokenExchangeRoleAlias"></a>

```typescript
public readonly tokenExchangeRoleAlias: CfnRoleAlias;
```

- *Type:* aws-cdk-lib.aws_iot.CfnRoleAlias

---


## Structs <a name="Structs" id="Structs"></a>

### GreengrassFleetProvisioningProps <a name="GreengrassFleetProvisioningProps" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps"></a>

Properties of GreengrassFleetProvisioning construct.

#### Initializer <a name="Initializer" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.Initializer"></a>

```typescript
import { GreengrassFleetProvisioningProps } from 'cdk-iot-greengrass-fleet-provisioning'

const greengrassFleetProvisioningProps: GreengrassFleetProvisioningProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.property.certificateBucket">certificateBucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.property.certificatePrefix">certificatePrefix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.property.env">env</a></code> | <code>aws-cdk-lib.Environment</code> | *No description.* |
| <code><a href="#cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.property.resourcePrefix">resourcePrefix</a></code> | <code>string</code> | *No description.* |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
  CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
  by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `certificateBucket`<sup>Required</sup> <a name="certificateBucket" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.property.certificateBucket"></a>

```typescript
public readonly certificateBucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

---

##### `certificatePrefix`<sup>Required</sup> <a name="certificatePrefix" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.property.certificatePrefix"></a>

```typescript
public readonly certificatePrefix: string;
```

- *Type:* string

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.property.env"></a>

```typescript
public readonly env: Environment;
```

- *Type:* aws-cdk-lib.Environment

---

##### `resourcePrefix`<sup>Required</sup> <a name="resourcePrefix" id="cdk-iot-greengrass-fleet-provisioning.GreengrassFleetProvisioningProps.property.resourcePrefix"></a>

```typescript
public readonly resourcePrefix: string;
```

- *Type:* string

---



