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
import { Project } from "projen";
import { Stability } from "projen/lib/cdk";
import { PDKProject } from "../pdk-project";

/**
 * Contains configuration for the NXMonorepoProject.
 */
export class NXMonorepoProject extends PDKProject {
  constructor(parent: Project) {
    super({
      parent,
      author: "AWS APJ COPE",
      authorAddress: "apj-cope@amazon.com",
      defaultReleaseBranch: "mainline",
      name: "nx-monorepo",
      keywords: ["aws", "pdk", "jsii", "projen"],
      repositoryUrl: "https://github.com/aws/aws-prototyping-sdk",
      devDeps: ["projen"],
      peerDeps: ["projen"],
      bundledDeps: ["@nrwl/devkit"],
      stability: Stability.STABLE,
    });

    this.compileTask.exec(
      'rsync -a ./src/** ./lib --include="*/" --include="**/*.js" --exclude="*" --prune-empty-dirs'
    );
  }
}
