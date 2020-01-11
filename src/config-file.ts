export interface ConfigFile {
  [k: string]: {
    endpoint: string,
    sinks: string[]
  }
}
