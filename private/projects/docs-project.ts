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
import { TypeScriptProject } from "projen/lib/typescript";

/**
 * Contains configuration for the public (docs) package.
 */
export class DocsProject extends TypeScriptProject {
  constructor(parent: Project) {
    super({
      parent,
      outdir: "public/docs", // nx has issues with root directories being called 'docs'
      defaultReleaseBranch: "mainline",
      sampleCode: false,
      jest: false,
      name: "docs",
      depsUpgrade: false,
      devDeps: ["@types/fs-extra", "exponential-backoff", "jsii-docgen"],
      deps: ["fs-extra"],
    });

    this.package.addField("private", true);

    // TODO: HACK! Remove when https://github.com/cdklabs/jsii-docgen/pull/644 is merged
    this.preCompileTask.exec("npx ts-node ./scripts/perf-boost-hack.ts");

    this.compileTask.reset();
    this.testTask.reset();
    this.packageTask.reset("./scripts/build-docs");
  }
}
