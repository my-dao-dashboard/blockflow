Blockflow
=========
> New block notification over HTTP

Building
---------
As usual, install dependencies, then build.
```shell script
yarn install --pure-lockfile
yarn build
```

Optionally, you could package it into single executable:
```shell script
yarn package
```

This would bake executables into `pkg/` folder. Just copy it to a target machine, and run.

Usage
-----

Create a config file that specifies environments, sinks, and ethereum endpoints. Endpoint must be a WebSocket
connection to an ethereum node. Sinks are HTTP addresses that are to be called upon new block arrival.

Example:
```json
{
  "main": {
    "endpoint": "ws://mainnet.eth.daoscan.net:8546",
    "sinks": [
      "https://dev.daoscan.net/block",
      "https://daoscan.net/block"
    ]
  }
}
```
