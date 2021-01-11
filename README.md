## Table of Contents
  - [About The Project](#about-the-project)
  - [Getting Started](#getting-started)
      - [Prerequisites](#prerequisites)
      - [Installation](#installation)
  - [Organization](#organization)
    - [Components](#components)
- [Contributing](#contributing)
- [Resources](#resources)

<!-- about the project -->
## About The Project
Carti is a package manager for Cartesi that enables developers to publish and reuse Cartesi assets such as ROM, RAM and flash drives, as well as organizing those assets into full machine configurations in a shareable and discoverable way.  

## Concepts
Carti provides a command line interface (CLI) for the following major tasks:
1. Create *bundles* from local assets (such as an `ext2` file representing a flash drive with a cross-compiled utility) in order to allow those assets to be indexed, stored and retrieved from remote locations
1. Publish *bundle repositories* so that users can list and download assets produced by the community
1. Allow users to specify a full Cartesi Machine configuration using bundles, making it possible to reuse assets produced and published by the community

## CLI Overview
### Bundles
#### `carti bundle`
Creates a bundle from an existing asset, wrapping it with necessary metadata.
#### `carti install`
Installs a bundle locally by looking it up in a configured repository and retrieving the corresponding asset from its specified remote storage location.
#### `carti publish`
Publishes a bundle's asset to an indicated accessible remote storage such as S3.
#### `carti list`
Lists bundles locally installed and/or available from the configured repositories.
#### `carti which`
Resolves bundle location including local asset path.
### Repositories
#### `carti repo add`
Includes an existing repository as a source of bundles to be installed and used locally.
#### `carti repo rm`
Removes a repository as a source of bundles to be installed and used locally.

#### `carti repo update`
Updates the local cached listings of bundles available from repositories.

### Cartesi Machines
#### `carti machine add`
Adds a bundle to a local Carti machine configuration file.
#### `carti machine install`
Installs bundles referenced by a Carti machine configuration file and produces a corresponding Cartesi Lua machine configuration pointing at local assets. This Lua file can then be used with regular Cartesi tools.
#### `carti machine publish`
Creates and publishes bundles for all assets referenced by a regular Cartesi Lua machine configuration, and produces a corresponding Carti machine configuration file using those bundles.
## Getting Started

### Prerequisites

- node v15.x.x or greater.
- npm v6.10.3 or greater.
- docker if you'd like to build stored machines

### Installation

Install via npm package

```bash
 npm install -g @createdreamtech/carti
```

To get a bundle
```sh
mdkir carti-example
cd carti-example 
# all commands have support for --help and will help guide you
carti --help
# add a listing of bundle locations
carti repo add https://github.com/createdreamtech/carti-example-packages  
# you should now see a list of available bundles
carti list --all
# @flashdrive/remote-test-data:1.0.0:baen.... 
carti install remote-test-data 
carti list
# @flashdrive/remote-test-data:1.0.0:baenrwic6ybfsdmdtm52fhgbeip6ndoi3e62bonaadmotji4x6vvdpedt3m:local
carti machine init
cat carti-machine-package.json
# create a default stored machine template 
carti machine build

ls stored_machine/
# 0000000000001000-f000.bin	0000000080000000-4000000.bin	8000000000000000-3c00000.bin	config		hash

# it creates a stored_machine that you can then load using descrates or just manually via cmdline
# right now the copy paste cmd needs tlc so just ignore

# add your own flash drive to a machine 
carti machine add flash remote-test-data --start 0x80000000000 --length 0x100000
# notice the additional entry in the flash section
cat carti-machine-package.json
# rm the flash-data entry as it's no longer necessary
carti machine build
# And you've just created your own machine from parts
cd ..
mkdir fully_specced
# we will install a machine just from a spec file it will resolve the required packages given you have repos that 
# resolve the packages specified.
carti machine install https://raw.githubusercontent.com/createdreamtech/carti-example-packages/main/examples/custom-flash/carti-machine-package.json
carti list

# will install all the machine bundles withotu building a stored machine
carti machine install --nobuild https://raw.githubusercontent.com/createdreamtech/carti-example-packages/main/examples/custom-flash/carti-machine-package.json

#
```
## Organization(Stale)
```
.
├── encoders
│   ├── encoders.ts
│   ├── hashers.ts
├── examples
│   ├── README.md
│   ├── generate_package.sh
│   ├── index.ts
│   └── run-config.lua
├── fetcher
│   ├── fetcher.ts
│   ├── index.ts
├── fixtures
├── generated
│   ├── machine_config_pkg_schema.ts
│   ├── machine_config_schema.ts
│   └── mirror_config_schema.ts
├── index.ts
├── machine-config-package-schema.json
├── machine-config-schema.json
├── mirror-config-schema.json
├── packager
│   ├── index.ts
│   ├── fetcher.ts
│   └── utils.ts
├── parser
│   ├── index.ts
│   ├── lua_config_template.ts
│   ├── lua_config_template_test.ts
│   ├── lua_parser.test.ts
│   └── lua_parser.ts
└── storage
    ├── disk.ts
    ├── index.ts
    ├── memory.ts
    ├── provider.ts
    ├── s3.ts
    └── util.ts
```
### Components(Stale)
#### Encoders
Contains the code to encode data be that CBOR, BASE64, etc... 
#### Packager
Contains the code that bundles together file based assets, encodes, and stores the data
#### Storage
Contains the code to store and retrieve data from storage be that Disk, Memory, IPFS, Git, S3
#### Fetcher
Contains code to resolve package data from URI or other platform, which may or may not intersect with Storage
i.e. HTTP might have fetcher and Storage may just implement retrieval from s3 api
#### Parser
Contains the code to parse lua config files and generate lua config files used to run cartesi machines
#### Examples
Contains an example of how this lib can be used to generate cartesi machines and package machine data
#### Generated
Contains code generated from the schemas that describe the various package formats
#### Utils
Contains code to generate tyepscript types from schemas and produces /generated
#### *-schema.json
##### machine-config-package-schema.json
The schema for carti packages, includes separate section for managing assets and a format that links to them via CIDs it also includes some tenative metadata
##### machine-config-schema.json
The schema that directly translate cartesi machine configurations generated from the cartesi machine lua based output
from dump-configuration
##### mirror-config-schema.json
A tenative description of the actual storage location of the package in question, with this file it becomes possible to
describe where the package can expect to resolve the CIDs( content identifiers ) for the cartesi assets

## Roadmap

See the [open issues](https://github.com/createdreamtech/carti-lib/issues) for a list of proposed features (and known issues).

## Contributing

How to contribute, build and release are outlined in [CONTRIBUTING.md](CONTRIBUTING.md), [BUILDING.md](BUILDING.md) and [RELEASING.md](RELEASING.md) respectively. Commits in this repository follow the [CONVENTIONAL_COMMITS.md](CONVENTIONAL_COMMITS.md) specification.

## License

Apache License 2.0

## Resources
- [Carti.Specification](https://createdreamtech/carti-spec)  - update coming soon
- [Carti](https://github.com/createdreamtech/carti) - the cli package coming soon