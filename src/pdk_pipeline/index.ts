// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CfnOutput } from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-codecommit";
import {
  CodePipeline,
  CodePipelineProps,
  CodePipelineSource,
  ShellStep,
  ShellStepProps,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

const DEFAULT_BRANCH_NAME = "mainline";

/**
 * Properties to configure the PDKPipeline.
 *
 * Note: Due to limitations with JSII and generic support it should be noted that
 * the synth, synthShellStepPartialProps.input and
 * synthShellStepPartialProps.primaryOutputDirectory properties will be ignored
 * if passed in to this construct.
 *
 * synthShellStepPartialProps.commands is marked as a required field, however
 * if you pass in [] the default commands of this construct will be retained.
 */
export interface PDKPipelineProps extends CodePipelineProps {
  /**
   * Enables a build job to trigger on PR merges to the defaultBranchName. This
   * will automatically build the codebase and add an Approval to the PR on
   * successful build.
   *
   * @default true
   */
  readonly prBuildChecker?: boolean;

  /**
   * Name of the CodeCommit repository to create.
   */
  readonly repositoryName: string;

  /**
   * Output directory for cdk synthesized artifacts i.e: packages/infra/cdk.out.
   */
  readonly primarySynthDirectory: string;

  /**
   * PDKPipeline by default assumes a NX Monorepo structure for it's codebase and
   * uses sane defaults for the install and run commands. To override these defaults
   * and/or provide additional inputs, specify env settings, etc you can provide
   * a partial ShellStepProps.
   */
  readonly synthShellStepPartialProps?: ShellStepProps;

  /**
   * Branch to trigger the pipeline execution.
   *
   * @default mainline
   */
  readonly defaultBranchName?: string;
}

/**
 * An extension to CodePipeline which configures sane defaults for a NX Monorepo
 * codebase. In addition to this, it also creates a CodeCommit repository with
 * automated PR builds and approvals.
 */
export class PDKPipeline extends CodePipeline {
  private readonly codeRepository: Repository;

  public constructor(
    scope: Construct,
    id: string,
    { synth, ...props }: PDKPipelineProps
  ) {
    const codeRepository = new Repository(scope, "CodeRepository", {
      repositoryName: props.repositoryName,
    });

    // TODO: Implement prBuildChecker

    // ignore input and primaryOutputDirectory
    const {
      input,
      primaryOutputDirectory,
      commands,
      ...synthShellStepPartialProps
    } = props.synthShellStepPartialProps || {};

    const codePipelineProps: CodePipelineProps = {
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.codeCommit(
          codeRepository,
          props.defaultBranchName || DEFAULT_BRANCH_NAME
        ),
        installCommands: ["yarn install --frozen-lockfile"],
        commands:
          commands && commands.length > 0
            ? commands
            : ["npx nx run-many --target=build --all"],
        primaryOutputDirectory: props.primarySynthDirectory,
        ...(synthShellStepPartialProps || {}),
      }),
      ...props,
    };

    super(scope, id, codePipelineProps);

    this.codeRepository = codeRepository;

    new CfnOutput(scope, "CodeRepositoryArn", {
      exportName: "CodeRepositoryHttpUrl",
      value: this.codeRepository.repositoryCloneUrlHttp,
    });
  }
}
