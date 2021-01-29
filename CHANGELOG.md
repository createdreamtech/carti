# [1.6.0](https://github.com/createdreamtech/carti/compare/1.5.6...1.6.0) (2021-01-29)


### Bug Fixes

* add support for proper catching of errors from cli ([9784373](https://github.com/createdreamtech/carti/commit/9784373a6855bd2de84a925a14a8fa395ec00f08))
* auto calculation of drive size for machine add ([f629c2e](https://github.com/createdreamtech/carti/commit/f629c2e9c149c77a1cc3d5da4e5d2370529d1a49))
* corrects get duplicate behavior and clarifies global flag handling ([39b20d0](https://github.com/createdreamtech/carti/commit/39b20d0ed47da030748be45cd82761e797cb9935))


### Features

* add a docker info command ([dd6f112](https://github.com/createdreamtech/carti/commit/dd6f11279050cd86dbfae6e911e232a2e9785c50))
* add support for a progress bar ([2a1bdf2](https://github.com/createdreamtech/carti/commit/2a1bdf20148b1d68cd812aada959662dba4f32a1))
* add support for defaultRepo specification ([76b0716](https://github.com/createdreamtech/carti/commit/76b0716997e2bc58dd9f15cdae90768b568cb5d8))
* add support for has from repo context ([4f5596f](https://github.com/createdreamtech/carti/commit/4f5596f4ea560109f36996aa7747dad319842e69))
* add support for listing repo entries ([cfaa4db](https://github.com/createdreamtech/carti/commit/cfaa4db47e9b64a12e804db6ff9f13296bcc4044))
* add support for repos to be specified in carti-machine-package ([19c1f2b](https://github.com/createdreamtech/carti/commit/19c1f2b10d07a9d9d22b233e9978c9b445b0f4f4))
* add support for resolving origin queries on config/repo ([2e99b19](https://github.com/createdreamtech/carti/commit/2e99b19b41bc594a0d6cfa115731f14f8faf2ce7))

## [1.5.6](https://github.com/createdreamtech/carti/compare/1.5.5...1.5.6) (2021-01-28)


### Bug Fixes

* ram default length is incorrect it does not behave like flash ([3391cd2](https://github.com/createdreamtech/carti/commit/3391cd275b0127db1a664d0b099095e25b62ae26))

## [1.5.5](https://github.com/createdreamtech/carti/compare/1.5.4...1.5.5) (2021-01-28)


### Bug Fixes

* corrects version command conflict with bundles ([08d849f](https://github.com/createdreamtech/carti/commit/08d849ff9e7d6245a51d61befbd71ab0013c8fd3))
* missing version bump for redirect enabling ([68d7de0](https://github.com/createdreamtech/carti/commit/68d7de0c7cf3b9195ad7749c7cd95c045c878eb4))
* quite output and pull in redirect request fix from upstream ([a7e8cc4](https://github.com/createdreamtech/carti/commit/a7e8cc4236cd7cee17ceb8cda4bdb39facce9588))

## [1.5.4](https://github.com/createdreamtech/carti/compare/1.5.3...1.5.4) (2021-01-27)


### Bug Fixes

* multiple asset resolution machine bug ([95c4f25](https://github.com/createdreamtech/carti/commit/95c4f25ce062dab0a4ee51c25b4d11b11ccb3c76))

## [1.5.3](https://github.com/createdreamtech/carti/compare/1.5.2...1.5.3) (2021-01-27)


### Bug Fixes

* defaults to output whenever called ([c66e269](https://github.com/createdreamtech/carti/commit/c66e2694e6664379ad3ed26799c331734901a187))
* missing default assets for cartesi machine ([e7d1960](https://github.com/createdreamtech/carti/commit/e7d196082a71ce9ac1042f5f24f3151e27ee3b35))

## [1.5.2](https://github.com/createdreamtech/carti/compare/1.5.1...1.5.2) (2021-01-27)


### Bug Fixes

* add version and defaults command, with messaging cleanup ([c5e5abd](https://github.com/createdreamtech/carti/commit/c5e5abd2beab7d9e93bec4f0b256d58f31fbff14))
* change defaults to use bundle system ([bc18cb9](https://github.com/createdreamtech/carti/commit/bc18cb9589afd95e35308af9796149a0e254f3b5)), closes [#36](https://github.com/createdreamtech/carti/issues/36)
* temp. disable stdout check spawn sync issues refactor at later date ([efc5efb](https://github.com/createdreamtech/carti/commit/efc5efb866df3a27d4364c167a56276f3541ab69))

## [1.5.1](https://github.com/createdreamtech/carti/compare/1.5.0...1.5.1) (2021-01-27)


### Bug Fixes

* patch https to follow redirects properly ([29048c3](https://github.com/createdreamtech/carti/commit/29048c325164bf75a10ebe8830bbabfda5832f66))

# [1.5.0](https://github.com/createdreamtech/carti/compare/1.4.0...1.5.0) (2021-01-27)


### Features

* add global storage to carti ([7b49d23](https://github.com/createdreamtech/carti/commit/7b49d23b22004526d82824bbf2834763efbdd256))

# [1.4.0](https://github.com/createdreamtech/carti/compare/1.3.0...1.4.0) (2021-01-26)


### Bug Fixes

* correct auto creating carti_bundles behavior ([19c3390](https://github.com/createdreamtech/carti/commit/19c3390b7b30d5ba9a7c2d9beb64224b1d2649f9))
* this removes the auto creation of bundles_json resolving ([be3a4cc](https://github.com/createdreamtech/carti/commit/be3a4cca7647ba44a4b802fffd04930a1b6b9cf3)), closes [#14](https://github.com/createdreamtech/carti/issues/14)


### Features

* add support for auto computing start and length, and setting ([cc5dd94](https://github.com/createdreamtech/carti/commit/cc5dd942919c4a9f0a2f7cf7384dd2b559637875)), closes [#17](https://github.com/createdreamtech/carti/issues/17) [#34](https://github.com/createdreamtech/carti/issues/34) [#35](https://github.com/createdreamtech/carti/issues/35)
* add support for creating cartesi lua config ([e6cff3e](https://github.com/createdreamtech/carti/commit/e6cff3efde536c5e67e9985cb90eb72cbc0441e5)), closes [#37](https://github.com/createdreamtech/carti/issues/37) [#32](https://github.com/createdreamtech/carti/issues/32)
* add support for machine rm ([494c0f3](https://github.com/createdreamtech/carti/commit/494c0f3358cd5db9989a55f44f2f69e6a2b09e2e)), closes [#40](https://github.com/createdreamtech/carti/issues/40)
* add support for specifying boot args ([44e2ee6](https://github.com/createdreamtech/carti/commit/44e2ee6ba1e3fae881fc9afeeb990ac68814358e)), closes [#31](https://github.com/createdreamtech/carti/issues/31) [#33](https://github.com/createdreamtech/carti/issues/33)

# [1.3.0](https://github.com/createdreamtech/carti/compare/1.2.1...1.3.0) (2021-01-17)


### Bug Fixes

* add missing integration test for get command ([c3d68cc](https://github.com/createdreamtech/carti/commit/c3d68cc307d8f10469491c55ad644f6c6ec56994))
* refactor repo to respect relative path which also corrects ([9cbc2dc](https://github.com/createdreamtech/carti/commit/9cbc2dcd5d91ccef91a88ae5a78d0248bc219610)), closes [#12](https://github.com/createdreamtech/carti/issues/12) [#13](https://github.com/createdreamtech/carti/issues/13)


### Features

* add support for -y to auto select bundle w/o prompt ([d14610e](https://github.com/createdreamtech/carti/commit/d14610eb5a9c9d9d6c4e26932ebd6298a29cbb1d)), closes [#11](https://github.com/createdreamtech/carti/issues/11)
* add support for auto choosing machine add ([be6a0a9](https://github.com/createdreamtech/carti/commit/be6a0a970cea6fef579688936caf634d415540a0)), closes [#11](https://github.com/createdreamtech/carti/issues/11)
* add support for by passing prompt for install ([0d7c4ab](https://github.com/createdreamtech/carti/commit/0d7c4ab1a471622a55baea7a479b1831e7ae62b6)), closes [#11](https://github.com/createdreamtech/carti/issues/11)
* add support for uri resolved bundling ([128ee4e](https://github.com/createdreamtech/carti/commit/128ee4e15b1e76c4fa44e8a3591d61f06253ff2f)), closes [#16](https://github.com/createdreamtech/carti/issues/16)
* this adds get command which will return a bundle ([c4e5bc9](https://github.com/createdreamtech/carti/commit/c4e5bc947a18c327807f1d223f40180b10b79eff)), closes [#15](https://github.com/createdreamtech/carti/issues/15)

## [1.2.1](https://github.com/createdreamtech/carti/compare/1.2.0...1.2.1) (2021-01-14)


### Bug Fixes

* corrects uri for disk publish ([cda8153](https://github.com/createdreamtech/carti/commit/cda8153367a4f9015bbe4476ab77fc32ecae1520)), closes [#18](https://github.com/createdreamtech/carti/issues/18)
* localpath resolution when package has remote origin ([28e969f](https://github.com/createdreamtech/carti/commit/28e969fd0c9543c41cda59cf0d3b700f193dcbca))
* stops auto creating bundles.json now only created upon need ([2618482](https://github.com/createdreamtech/carti/commit/261848234e5dd09c3a03a1b31cf54cad0a28739c)), closes [#14](https://github.com/createdreamtech/carti/issues/14)

# [1.2.0](https://github.com/createdreamtech/carti/compare/1.1.0...1.2.0) (2021-01-05)


### Bug Fixes

* machine install command to also store local data when install remote pkg ([f6bd69a](https://github.com/createdreamtech/carti/commit/f6bd69a25469f501e90e8807be4177ca8a9f75ac))


### Features

* add nobuild support for install command ([450eec1](https://github.com/createdreamtech/carti/commit/450eec17c6f5328520b46b1811bc8d6fa1885e79))

# [1.1.0](https://github.com/createdreamtech/carti/compare/1.0.0...1.1.0) (2021-01-05)


### Bug Fixes

* broken path resolution for git based repo ([065e9fd](https://github.com/createdreamtech/carti/commit/065e9fd79436fe3c62d309242dc9d395175ac722))
* concurrency issues with test ([465d6cc](https://github.com/createdreamtech/carti/commit/465d6cce2e3909ae80a3b93018cf2f5e6000a8ba))
* correct duplicate commands prompt ([1eac12a](https://github.com/createdreamtech/carti/commit/1eac12aa36786157350faa834c7ca30699b7e8a0))
* issues parsing command args/handling publish nosave arg ([09ef5cc](https://github.com/createdreamtech/carti/commit/09ef5ccfb3156944d4147b7e91366e6e2c978fa8))
* publish async handling ([78f2586](https://github.com/createdreamtech/carti/commit/78f25868e705fbd246433a8b07b88f794ed6ab9c))
* refactor publish to not leak path information ([ddd3a9f](https://github.com/createdreamtech/carti/commit/ddd3a9f84a82b1e66ff8bba1787e280646b4d299))
* rm duplicate publish command ([f3ef99b](https://github.com/createdreamtech/carti/commit/f3ef99bb64c1a97e04b807e93080e44da22bb680))


### Features

* add support for listing all packages local or not installed ([d7e4027](https://github.com/createdreamtech/carti/commit/d7e4027b444baf2e0a71df1e57aac23872bc4c1d))
* add which command to locate local bundles abs path ([626db1a](https://github.com/createdreamtech/carti/commit/626db1a1e6d51a44812d70414cca50597e21dad8))

# 1.0.0 (2021-01-05)


### Bug Fixes

* .bundles.json written format ([f972678](https://github.com/createdreamtech/carti/commit/f97267844f6416c01daa0dc0a0e7ca93a786f6c6))
* add missing cli command for bundle ([9a2e64e](https://github.com/createdreamtech/carti/commit/9a2e64e54bf9d018254cc3860ac34fd7cccbbdfb))
* add support for mocha ([aac8527](https://github.com/createdreamtech/carti/commit/aac8527d1411135aafbba0ab4a6676289a0f9b33))
* carry through filename support vs default cid naming ([43def91](https://github.com/createdreamtech/carti/commit/43def91f260f140d5397063456f86dacd6690110))
* command structure to support sub commands ([3a91870](https://github.com/createdreamtech/carti/commit/3a918702b8ac1f90953ccb9efc64d44bc8ee1c5b))
* config refactor ([282a851](https://github.com/createdreamtech/carti/commit/282a8513f8002878dfdb2c6953759c4153d1317b))
* correct default dir existince bug ([550054d](https://github.com/createdreamtech/carti/commit/550054d83de5965598820576bd498a6e1f695748))
* correct home dir assumption for storage ([d5dd4f2](https://github.com/createdreamtech/carti/commit/d5dd4f2997207644357bb45fcc610e5d93f2b900))
* correct index initialization for storage ([c21600a](https://github.com/createdreamtech/carti/commit/c21600ab54bc83c7230706b60161d555d36d605d))
* dir path for fixture ([7b18664](https://github.com/createdreamtech/carti/commit/7b18664bcda056fc7e41eb146ead03a6f7f624a5))
* disk fetcher path resolution ([1c05d10](https://github.com/createdreamtech/carti/commit/1c05d10fecb87689f826ca5fd8f477412c5f71b6))
* fetching id by non name ([119eceb](https://github.com/createdreamtech/carti/commit/119eceba932b32419bab1ce1c42d6f779fcc310d))
* fix storage to respect quick lookup index ([303a312](https://github.com/createdreamtech/carti/commit/303a3125c469fe123d95a06300f49142a890f230))
* local configuration index should reflect remote installations ([5ee1d78](https://github.com/createdreamtech/carti/commit/5ee1d7830c2c90863ece0a69dfb110e3d1f59cca))
* machine to support latest packages mapping ([0304be3](https://github.com/createdreamtech/carti/commit/0304be3f75aaa084d822d069a251331b9db415ae))
* make support for uri optionally specified within a bundle ([fbe61b4](https://github.com/createdreamtech/carti/commit/fbe61b4498180efd93a70fde9f39503fd68f1af1))
* order of commandline parsing for short name args ([588024e](https://github.com/createdreamtech/carti/commit/588024e1dbe02439f27127fc249f1ce65268fb2b))
* package.json typo ([9500155](https://github.com/createdreamtech/carti/commit/9500155b4544c4162a23ec5c186a14eab2dcdc7c))
* refactor global_listing to bundle_listing ([8ba6dc5](https://github.com/createdreamtech/carti/commit/8ba6dc577fdea5a85389c4024a12b6bcc6364f9e))
* refactor support for paths with repos to be absolute ([254c704](https://github.com/createdreamtech/carti/commit/254c7040a5b2add1a0d6d36857bd6f3d94ff7264))
* refactor support for publishing bundles ([c5db421](https://github.com/createdreamtech/carti/commit/c5db4219fbb0a49957e3bbcaec20f8c177c1e90e))
* remote disk bundle resolution to adhere to strict format ([198f84b](https://github.com/createdreamtech/carti/commit/198f84bd585db1d6a7ba590be8860cb35c56b3a4))
* rm typedocs to resolve dependencies ([223d4cc](https://github.com/createdreamtech/carti/commit/223d4cc960216b3c5488ebd019414ea8c07f0f8a))
* skip integration test for now ([3f0e962](https://github.com/createdreamtech/carti/commit/3f0e96201829cbafd5930ff2e53f9628d7881c90))
* temporarily remove support for --version ([c76917b](https://github.com/createdreamtech/carti/commit/c76917b81f965e8953df9789de4fa2528d21200a))
* test to respect fixtures ([783ca91](https://github.com/createdreamtech/carti/commit/783ca91b7ca49a18c632118457dfd0256816df5e))


### Features

* add bundle command to cli ([824598c](https://github.com/createdreamtech/carti/commit/824598c93d8b091357b2958818b7bba3a7594637))
* add ci ([ff6d3c2](https://github.com/createdreamtech/carti/commit/ff6d3c21fe4bee27dafac9d1f1400a93e25f192a))
* add commadn for listing local pacakges ([79fa3a2](https://github.com/createdreamtech/carti/commit/79fa3a245f8f3bf735fbc5f30580cbc2c83cdc86))
* add first stab at command cli structure ([45fb9b1](https://github.com/createdreamtech/carti/commit/45fb9b1b7b952f97570c8739695b155bc9d71aba))
* add initial machine command work ([cd86c5d](https://github.com/createdreamtech/carti/commit/cd86c5d7e5dbb2836a700103002a3175b0b48d8a))
* add integration tests for carti ([a4ff65f](https://github.com/createdreamtech/carti/commit/a4ff65f737733398760b6d22c7e9b439a3204ad4))
* add logging system infrastructure ([e1e968b](https://github.com/createdreamtech/carti/commit/e1e968b63d6b84e4076fa05f102c602652de7163))
* add publish command ([7d6324d](https://github.com/createdreamtech/carti/commit/7d6324d82d7ede8d12eaf201291fa3118d53b375))
* add publish command ([ea9aca6](https://github.com/createdreamtech/carti/commit/ea9aca65bf21168609465da8270f1f38b1118234))
* add sketch for fetcher folder structure ([3d661db](https://github.com/createdreamtech/carti/commit/3d661db389e7ed8350e1aaf1556305859471a08f))
* add structure for repo package management lib ([6db7e61](https://github.com/createdreamtech/carti/commit/6db7e6191cdad42bfaf743e7aeb8a587fc132ebf))
* add support for a short desc format for bundle for cli ([bacb5eb](https://github.com/createdreamtech/carti/commit/bacb5eb0524e53a4929432b63ee606f8aea52836))
* add support for adding a run script to create built machines ([d20b894](https://github.com/createdreamtech/carti/commit/d20b894f364f764b9418076a3790243a18038e69))
* add support for fetching from disk or git ([1eab0c0](https://github.com/createdreamtech/carti/commit/1eab0c05ecb8d8e93f9d28b9a92d34d7c2360b5a))
* add support for installation ([6140987](https://github.com/createdreamtech/carti/commit/61409873f2274d3486b2c6c45017d7665e7388a6))
* add support for just uri based publishing w/o uploading ([cc0b7f4](https://github.com/createdreamtech/carti/commit/cc0b7f476f1fb1f5f7dccbde3fa687308df84493))
* add support for managing additions and subtractions from bundles.json ([56bb7b2](https://github.com/createdreamtech/carti/commit/56bb7b2cb488b407b3369846b8fa8b335b1ca85a))
* add support for optional bundle prompt questions for cli ([777cdf1](https://github.com/createdreamtech/carti/commit/777cdf1fefa22d2ef67858302d084e9af8d05b04))
* add support for package respoitories ([304a999](https://github.com/createdreamtech/carti/commit/304a999ca1f4bf85d1158032e91cc667faa5fa4a))
* add support for stream to string util ([e79cbf1](https://github.com/createdreamtech/carti/commit/e79cbf11381ae457f4e661437f819f897ae83075))
* adds support for machine build to build and run a cartesi machine from spec ([0c81c86](https://github.com/createdreamtech/carti/commit/0c81c86bcbda7266749d0f102b1f22bbb6430bfe))
* create a unified bundle fetcher for disk or http ([8a89ede](https://github.com/createdreamtech/carti/commit/8a89ede8e57a3d34c4bec70ae775128582dc7918))
* expose code to a singular default config for the cli ([6b9bf42](https://github.com/createdreamtech/carti/commit/6b9bf4280b84686aac96018e39408cbbf0eafa4e))
* expose commands to cli ([d5a5998](https://github.com/createdreamtech/carti/commit/d5a5998a1198f05cbfa1b23ae014b8ccdfa173de))
* expose publish cli command ([2fe3b2e](https://github.com/createdreamtech/carti/commit/2fe3b2edc4991770c589dd28ff763c4cfed7b173))
* impl nosave option and add uri only extension to publish ([d756a56](https://github.com/createdreamtech/carti/commit/d756a56cb637b9fe96f134df83f851afc734ee26))
* init commit and structure ([b272336](https://github.com/createdreamtech/carti/commit/b272336e6bd9878869aff88822148adcd87dc9b3))
* refactor code to support config object ([38893e0](https://github.com/createdreamtech/carti/commit/38893e0aed87365d4d7d308dc3b4ff40b1aae6ee))
* refactor config to include repo ([221492e](https://github.com/createdreamtech/carti/commit/221492e87ca14b1e367caf7d241835d8da4d6c8e))
* wip add carti local to package.json ([fa9f0d8](https://github.com/createdreamtech/carti/commit/fa9f0d8f62e4a7b68cd940e3430b9108e5e8d67e))
* wip additional cli sketch ([11d25b0](https://github.com/createdreamtech/carti/commit/11d25b0e72b44310b46318724aec9219e930d88f))
* wip initial commands structure sketch ([a951312](https://github.com/createdreamtech/carti/commit/a951312a3f6ad3e91b503f7223a960fb07875219))
* wip sketch for global resource storage for an index and repository storage ([7e8ab39](https://github.com/createdreamtech/carti/commit/7e8ab393da78a01e563ab96c4724f2cb3c2e502b))
