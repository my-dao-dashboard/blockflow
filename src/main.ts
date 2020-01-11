import { BlockFlow } from "./block-flow";
import commander from "commander";
import fs from "fs";
import path from "path";
import { ConfigFile } from "./config-file";

const packageJsonPath = path.resolve(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
const version = packageJson.version;

commander
  .arguments("<config>")
  .version(version)
  .action(configPath => {
    const fullConfigPath = path.resolve(process.cwd(), configPath);
    const config = JSON.parse(fs.readFileSync(fullConfigPath).toString()) as ConfigFile;
    for (let env of Object.getOwnPropertyNames(config)) {
      const flow = new BlockFlow({
        name: env,
        ethereumEndpoint: config[env].endpoint,
        sinks: config[env].sinks
      });
      flow.start();
    }
  });

commander.parse(process.argv);
