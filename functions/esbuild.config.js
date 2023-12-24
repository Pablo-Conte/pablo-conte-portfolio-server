/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require("esbuild");
const { exec } = require("child_process");

const { dependencies, devDependencies } = require("./package.json");

exec(
  'find ./src -type f -name "*.ts" -o -name "*.js"',
  (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    const splitStdout = stdout?.split("\n")?.filter((path) => path !== "");
    splitStdout.push("./index.ts");
    esbuild
      .build({
        entryPoints: splitStdout,
        allowOverwrite: true,
        minify: true,
        sourcemap: true,
        outdir: "./lib",
        platform: "node",
        logLevel: "silent",
        external: Object.keys(dependencies).concat(
          Object.keys(devDependencies)
        ),
        target: ["node20.10.0"],
        bundle: true,
        resolveExtensions: [".ts", ".js", ".json"],
      })
      .then((result) => {
        console.log(
          `Successfully compiled ${splitStdout?.length} files with Esbuild`
        );
        if (result?.errors?.length > 0) {
          result?.errors?.forEach((error) =>
            console.log(`error -> ${error.text}`)
          );
        }
      });
  }
);
