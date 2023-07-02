import { getCdkHandlerPath } from '@swarmion/serverless-helpers';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { sharedCdkEsbuildConfig } from '@pull-dating/serverless-configuration';

import { deleteUserContract } from 'contracts/deleteUserContract';
import { ApiWithCognitoAuthorizerProps } from 'functions/types';

export class DeleteUser extends Construct {
  public deleteUserFunction: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    { restApi, authorizer }: ApiWithCognitoAuthorizerProps,
  ) {
    super(scope, id);

    this.deleteUserFunction = new NodejsFunction(this, 'Lambda', {
      entry: getCdkHandlerPath(__dirname),
      handler: 'main',
      runtime: Runtime.NODEJS_16_X,
      architecture: Architecture.ARM_64,
      awsSdkConnectionReuse: true,
      bundling: sharedCdkEsbuildConfig,
    });

    restApi.root
      .resourceForPath(deleteUserContract.path)
      .addMethod(
        deleteUserContract.method,
        new LambdaIntegration(this.deleteUserFunction),
        { authorizer },
      );
  }
}
