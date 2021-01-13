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

## Sample use cases and workflow
### Use case: reusing a flash drive
A developer creates a Cartesi Machine that includes a flash drive with a utility that was cross-compiled for RISC-V (for instance, the utility for computing Dogecoin/Litecoin hashes using `libscrypt`, as detailed in the [Descartes Tutorials](https://github.com/cartesi/descartes-tutorials/tree/master/dogecoin-hash)). Other users would like to build machines using that utility, but without having to repeat all the original work - which may indeed be very complex if there are many dependencies involved.

1. First, the developer *bundles* and *publishes* the corresponding `ext2` file:
   ```bash
   carti bundle --type flash --name scrypt-hash --version 1.0.0 scrypt-hash.ext2
   carti publish s3 --bucket xyz scrypt-hash
   ```

1. At this point the `publish` command has recorded the bundle's metadata and remote S3 asset location in the local `bundles.json` repository index file. This index file can then be committed to Git, so that it becomes available at the URL https://raw.githubusercontent.com/my-org/my-repo/main/bundles.json.

1. Another user that wishes to reuse this drive for his own Cartesi Machine then adds the original developer's repository and installs the desired bundle:
   ```bash
   carti repo add https://raw.githubusercontent.com/my-org/my-repo/main/bundles.json
   carti install scrypt-hash
   ```

1. Finally, the user can build a Cartesi Machine using the installed asset, here using the `which` command to more easily retrieve the asset's path in the local filesystem:
   ```bash
   cartesi-machine \
    --flash-drive="label:scrypt-hash,filename:$(carti which -py scrypt-hash)" \
    --flash-drive="label:input,length:1<<12" \
    --flash-drive="label:output,length:1<<12" \
    -- $'cd /mnt/scrypt-hash ; ./scrypt-hash $(flashdrive input) $(flashdrive output)'
   ```

### Use case: running and customizing a published Cartesi Machine

A developer wishes to allow other users to run his Cartesi Machine. This could be accomplished by simply providing the full stored machine (as described in the [Cartesi documentation](https://cartesi.io/en/docs/machine/host/cmdline/#persistent-cartesi-machines)), but that would entail uploading a large amount of data that is almost entirely already available online, such as the contents of the kernel and `rootfs` drive. In this context, Carti can be used to create and publish a lightweight Cartesi Machine configuration that can handle bundles referring to remotely stored assets.

1. First, the developer extracts the Lua configuration for his Cartesi Machine and creates a corresponding Carti machine configuration referring to published bundles:
   ```bash
   carti machine publish s3 --bucket xyz machine-config.lua > carti-machine.json
   ```

1. The generated `carti-machine.json` file is then distributed, and another user downloads it. The user then *installs* the machine, so as to retrieve all remote assets and build a regular Cartesi Machine configuration in Lua, that only refers to local files:
   ```bash
   carti machine install carti-machine.json > machine-config.lua
   ```

1. The user then instantiates and runs the machine using the Cartesi Machine Lua interface, as explained in [the Cartesi documentation](https://cartesi.io/en/docs/machine/host/lua/#loading-and-running-machines).

1. Being a human-readable JSON file, the user can then customize the machine configuration, for example by changing the command line. He can also update the version of the referenced bundles, for instance to retrieve a newer version that fixes a bug.

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