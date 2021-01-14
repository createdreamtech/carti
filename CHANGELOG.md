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
