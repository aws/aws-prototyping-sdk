/*********************************************************************************************************************
 Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License").
 You may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 ******************************************************************************************************************** */

import { AuthorizationType, CorsOptions } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";

/**
 * Defines an integration for an individual API operation
 */
export interface OpenApiIntegration {
  /**
   * The lambda function to service the api operation
   */
  readonly function: IFunction;
}

/**
 * A mapping of operation id to the integration for that operation
 */
export type OpenApiIntegrations = {
  readonly [operationId: string]: OpenApiIntegration;
};

/**
 * Structure to contain an API operation's method and path
 */
export interface MethodAndPath {
  /**
   * The path of this operation in the api
   */
  readonly path: string;
  /**
   * The http method of this operation
   */
  readonly method: string;
}

/**
 * Type for the generated Operation Lookup structure, providing details about the method and path of each API operation
 */
export type OperationLookup = {
  readonly [operationId: string]: MethodAndPath;
};

/**
 * Auth types supported by the construct
 * TODO: Support cognito auth!
 */
export type SupportedAuthTypes = AuthorizationType.IAM | AuthorizationType.NONE;

/**
 * Options required alongside an Open API specification to create API Gateway resources
 */
export interface OpenApiOptions {
  /**
   * A mapping of API operation to its integration
   */
  readonly integrations: OpenApiIntegrations;
  /**
   * Details about each operation
   */
  readonly operationLookup: OperationLookup;
  /**
   * The authorization type to use for the API
   */
  readonly authType?: SupportedAuthTypes;
  /**
   * Cross Origin Resource Sharing options for the API
   */
  readonly corsOptions?: CorsOptions;
}