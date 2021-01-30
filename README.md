<h1 align="center" style="margin-top: 1em; margin-bottom: 3em;">
  <p><a href="https://cartipkgr.urpkgr.com/"><img alt="open-rpc logo" src="https://raw.githubusercontent.com/createdreamtech/carti-design/main/svg/carti-logo.svg" alt="https://cartipkgr.urpkgr.com/" width="125"></a></p>
  <p><a herf="https://cartipkgr.urpkgr.com/">Carti</a></p>
</h1>


## Table of Contents
  - [About The Project](#about-the-project)
  - [Getting Started](#getting-started)
      - [Requirements](#requirements)
      - [Installation](#installation)
  - [Concepts](#concepts)
  - [Sample Use Cases](#sample-use-cases)
    - [Components](#components)
- [Adv Tutorial](https://cartipkgr.urpkgr.com/tutorial)
- [Docs](https://cartipkgr.urpkgr.com/docs)
- [Contributing](#contributing)
- [Resources](#resources)

<!-- about the project -->
## About The Project
Carti is a package manager for Cartesi that enables developers to publish and reuse Cartesi assets such as ROM, RAM and flash drives, as well as organizing those assets into full machine configurations in a shareable and discoverable way.  

## Getting Started
### Requirements
```
nodejs v15.x.x or greater
# I recommend using nvm
# https://github.com/nvm-sh/nvm
# example usage: nvm use v15.0.1 
# Suggestion to run the entire tutorial install docker
```
### Installation
```
npm install -g @createdreamtech/carti 
carti --help
carti version 
```
-  Add the default machine data
```
carti machine install -g --nobundle --nobuild \
https://raw.githubusercontent.com/createdreamtech/carti-default/main/carti-machine-package.json 
```
-  Create a default machine 
```
mkdir carti-example
cd carti-example
carti machine init
cat carti-machine-package.json
```
- Install the cartesi machine config
```
carti machine install carti-machine-package.json

# This outputs by default a mountable build directory that contains all the bundles related to your machine
as well as a machine-config.lua
```
For more insights visit the [website](https://cartipkgr.urpkgr.com) 

## Concepts
Carti provides a command line interface (CLI) for the following major tasks:
1. Create *bundles* from local assets (such as an `ext2` file representing a flash drive with a cross-compiled utility) in order to allow those assets to be indexed, stored and retrieved from remote locations
1. Publish *bundle repositories* so that users can list and download assets produced by the community
1. Allow users to specify a full Cartesi Machine configuration using bundles, making it possible to reuse assets produced and published by the community

## Sample Use Cases 
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


## Roadmap

See the [open issues](https://github.com/createdreamtech/carti-lib/issues) for a list of proposed features (and known issues).

## Contributing

How to contribute, build and release are outlined in [CONTRIBUTING.md](CONTRIBUTING.md), [BUILDING.md](BUILDING.md) and [RELEASING.md](RELEASING.md) respectively. Commits in this repository follow the [CONVENTIONAL_COMMITS.md](CONVENTIONAL_COMMITS.md) specification.

## License

Apache License 2.0

## Resources
- [Carti.Specification](https://createdreamtech/carti-spec)  - update coming soon
- [Carti](https://github.com/createdreamtech/carti) - the cli package coming soon