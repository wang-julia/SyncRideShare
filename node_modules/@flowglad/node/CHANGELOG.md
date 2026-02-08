# Changelog
## 0.29.0 (2026-01-18)

Full Changelog: [v0.28.0...v0.29.0](https://github.com/flowglad/flowglad-node/compare/v0.28.0...v0.29.0)

### Features

* **api:** manual updates ([72f67e6](https://github.com/flowglad/flowglad-node/commit/72f67e6f50b9d4b3e9ea73cef084145d8319172c))


### Chores

* **internal:** update `actions/checkout` version ([eff5d28](https://github.com/flowglad/flowglad-node/commit/eff5d28d4f55686d613abafaa37e70431cc5e1ac))

## 0.28.0 (2026-01-15)

Full Changelog: [v0.27.0...v0.28.0](https://github.com/flowglad/flowglad-node/compare/v0.27.0...v0.28.0)

### Features

* **api:** manual updates ([d854d31](https://github.com/flowglad/flowglad-node/commit/d854d31e91def59b95839a8773e8fbb7f86bf97e))

## 0.27.0 (2026-01-15)

Full Changelog: [v0.26.0...v0.27.0](https://github.com/flowglad/flowglad-node/compare/v0.26.0...v0.27.0)

### Features

* **api:** manual updates ([d31080b](https://github.com/flowglad/flowglad-node/commit/d31080bff349dcec053302f6ddf882b27baea1b6))


### Chores

* **internal:** upgrade babel, qs, js-yaml ([8dee709](https://github.com/flowglad/flowglad-node/commit/8dee7098002c176157e1b586f99954bf34b0d51a))

## 0.26.0 (2026-01-14)

Full Changelog: [v0.25.0...v0.26.0](https://github.com/flowglad/flowglad-node/compare/v0.25.0...v0.26.0)

### Features

* **api:** manual updates ([ef4e892](https://github.com/flowglad/flowglad-node/commit/ef4e8928b934fcfcfd58db93e4f4cab36cd4d5c1))

## 0.25.0 (2026-01-11)

Full Changelog: [v0.24.0...v0.25.0](https://github.com/flowglad/flowglad-node/compare/v0.24.0...v0.25.0)

### ⚠ BREAKING CHANGES

* **mcp:** remove deprecated tool schemes
* **mcp:** **Migration:** To migrate, simply modify the command used to invoke the MCP server. Currently, the only supported tool scheme is code mode. Now, starting the server with just `node /path/to/mcp/server` or `npx package-name` will invoke code tools: changing your command to one of these is likely all you will need to do.

### Features

* **api:** manual updates ([29826ca](https://github.com/flowglad/flowglad-node/commit/29826ca3deedb1382c79982f0b985a89e34b6303))


### Bug Fixes

* **mcp:** add client instantiation options to code tool ([9af9932](https://github.com/flowglad/flowglad-node/commit/9af99329f36d61f792255d4695210d67940260c0))
* **mcp:** correct code tool api output types ([197ce20](https://github.com/flowglad/flowglad-node/commit/197ce20b7ee748d289a72f2635adfd771758791c))
* **mcp:** fix env parsing ([8a5559a](https://github.com/flowglad/flowglad-node/commit/8a5559af7e05604e83adc7490fadd8a9e8f6fbda))
* **mcp:** fix options parsing ([ea70ab3](https://github.com/flowglad/flowglad-node/commit/ea70ab343003f46bcde3854187f595f8b338e48c))
* **mcp:** pass base url to code tool ([3ad4714](https://github.com/flowglad/flowglad-node/commit/3ad4714d57a8aa9abe6a903a253033516c944fae))
* **mcp:** update code tool prompt ([79cec40](https://github.com/flowglad/flowglad-node/commit/79cec4063636ccab620615bbcbad29be4c64b7ab))


### Chores

* break long lines in snippets into multiline ([749834d](https://github.com/flowglad/flowglad-node/commit/749834df7ecb9ba1ad1835b056dad9efcf9752e0))
* **internal:** codegen related update ([7992c52](https://github.com/flowglad/flowglad-node/commit/7992c52fc93041d6cf70a64218c3145b3342008c))
* **mcp:** remove deprecated tool schemes ([6d54339](https://github.com/flowglad/flowglad-node/commit/6d5433967c016f96cea8294cbc9bc7b34d869a6e))
* **mcp:** update lockfile ([06783ad](https://github.com/flowglad/flowglad-node/commit/06783ad1f379228e59aac505e5eba2fa824d8e94))


### Documentation

* prominently feature MCP server setup in root SDK readmes ([e385728](https://github.com/flowglad/flowglad-node/commit/e3857289316efbb6e1487b0dde5c1396b1178d35))

## 0.24.0 (2025-12-08)

Full Changelog: [v0.23.0...v0.24.0](https://github.com/flowglad/flowglad-node/compare/v0.23.0...v0.24.0)

### Features

* **api:** manual updates ([533552d](https://github.com/flowglad/flowglad-node/commit/533552d8c6d991a0112811d45878478708d438d6))
* **mcp:** add detail field to docs search tool ([8f77fc6](https://github.com/flowglad/flowglad-node/commit/8f77fc63d5b4f1bd1d7dd91540fcda293eb23446))
* **mcp:** add typescript check to code execution tool ([7578b49](https://github.com/flowglad/flowglad-node/commit/7578b4915985dd8f6e838391edf606fd60647963))
* **mcp:** handle code mode calls in the Stainless API ([42fd808](https://github.com/flowglad/flowglad-node/commit/42fd808cd8ec2a409488eb75547f350346d77dc5))
* **mcp:** return logs on code tool errors ([709d568](https://github.com/flowglad/flowglad-node/commit/709d568089128af16a33960bd8528be7774c99f6))


### Bug Fixes

* **mcp:** correct code tool API endpoint ([42ff072](https://github.com/flowglad/flowglad-node/commit/42ff072b8078f78c2ee00fe024a5ed44c552301c))
* **mcp:** return correct lines on typescript errors ([4597857](https://github.com/flowglad/flowglad-node/commit/4597857934207a36fbc78b4ca73e21c9b19d1da5))
* **mcp:** return tool execution error on api error ([53a87cf](https://github.com/flowglad/flowglad-node/commit/53a87cfb1c4b1dfdd23c14ad392af14ea4f17f18))


### Chores

* **client:** fix logger property type ([78eb993](https://github.com/flowglad/flowglad-node/commit/78eb993f61b5c5528942ef52cc778794833613d2))
* **internal:** codegen related update ([07d7563](https://github.com/flowglad/flowglad-node/commit/07d7563a6fcd0f41af3c473fafbb170a1fb5b81f))
* **internal:** codegen related update ([8e7dd46](https://github.com/flowglad/flowglad-node/commit/8e7dd46ab42f14aa74bb605b4438ce1df4ee6e34))
* **internal:** upgrade eslint ([6b56a2d](https://github.com/flowglad/flowglad-node/commit/6b56a2d8837a4d089528993bb6c3f45bd03baf12))
* use latest @modelcontextprotocol/sdk ([430a047](https://github.com/flowglad/flowglad-node/commit/430a04773b86428e9b5ee9be10d6884bb97e9bd7))

## 0.23.0 (2025-11-25)

Full Changelog: [v0.22.0...v0.23.0](https://github.com/flowglad/flowglad-node/compare/v0.22.0...v0.23.0)

### Features

* **api:** manual updates ([1a19816](https://github.com/flowglad/flowglad-node/commit/1a19816abcef63fe94de504d04586c5ceb3ed58e))
* **api:** update via SDK Studio ([539f4c4](https://github.com/flowglad/flowglad-node/commit/539f4c4518cb92b9d71ae7c890f55498cbf47d88))
* **mcp:** enable optional code execution tool on http mcp servers ([090ca8f](https://github.com/flowglad/flowglad-node/commit/090ca8fb6207a056c1f4dc41fbd3b457bcc7007d))


### Bug Fixes

* **mcpb:** pin @anthropic-ai/mcpb version ([c8bf746](https://github.com/flowglad/flowglad-node/commit/c8bf74639585d555710ec2a68d1a51224bd12d8f))
* **mcp:** return tool execution error on jq failure ([047276b](https://github.com/flowglad/flowglad-node/commit/047276bc4d3bd247613d349f63f1bdbdb60b1416))


### Chores

* **internal:** codegen related update ([f45deec](https://github.com/flowglad/flowglad-node/commit/f45deec19f15bc5e89faa32905fdf0b1ef03abe5))
* **internal:** codegen related update ([d8c690d](https://github.com/flowglad/flowglad-node/commit/d8c690d0b0b316915e3276cee1aa2c07099a6ddf))
* **internal:** grammar fix (it's -&gt; its) ([ceea4b0](https://github.com/flowglad/flowglad-node/commit/ceea4b006184694f7fdd6c38a6b9efc8534270c0))
* mcp code tool explicit error message when missing a run function ([9f95cba](https://github.com/flowglad/flowglad-node/commit/9f95cba7b813396b26890f8ce60f895eb066a321))
* **mcp:** add friendlier MCP code tool errors on incorrect method invocations ([69bd7b0](https://github.com/flowglad/flowglad-node/commit/69bd7b061e2806e6843fab6ef5c7ef6c42dc230e))
* **mcp:** add line numbers to code tool errors ([48cfd3a](https://github.com/flowglad/flowglad-node/commit/48cfd3a78bd865fd461cacabc85b720e12cbedee))
* **mcp:** clarify http auth error ([8a6a2cb](https://github.com/flowglad/flowglad-node/commit/8a6a2cbd9cae370bcbf1bd8c24a2d2b70ca0f8b4))
* **mcp:** upgrade jq-web ([51ca5f4](https://github.com/flowglad/flowglad-node/commit/51ca5f4ac13ccf1b7d2c7d11d3996005c7362717))
* use structured error when code execution tool errors ([20cc664](https://github.com/flowglad/flowglad-node/commit/20cc6648e532399cbc3517e57badf36a61e6cd17))


### Documentation

* **mcp:** add a README button for one-click add to Cursor ([d0679c8](https://github.com/flowglad/flowglad-node/commit/d0679c80b534c7f4d853a494685333f2ef761c61))
* **mcp:** add a README link to add server to VS Code or Claude Code ([5526204](https://github.com/flowglad/flowglad-node/commit/55262048deb2efe9c80d17ca998fe10bf6dd48af))

## 0.22.0 (2025-10-18)

Full Changelog: [v0.21.0...v0.22.0](https://github.com/flowglad/flowglad-node/compare/v0.21.0...v0.22.0)

### Features

* **api:** pre-launch SDK release ([dcfff9e](https://github.com/flowglad/flowglad-node/commit/dcfff9e3bfa07cfbbbe10e47e8889bb6fc920eda))
* clean up environment call outs ([6dd40c6](https://github.com/flowglad/flowglad-node/commit/6dd40c6a4371b69cd1a5b81a46290fb534e64960))
* **mcp:** add code execution tool ([b6cd343](https://github.com/flowglad/flowglad-node/commit/b6cd3435bd2b5ed81dff1c6998deb378815bec1c))
* **mcp:** add logging when environment variable is set ([1a342dd](https://github.com/flowglad/flowglad-node/commit/1a342dd3ee2ad5216f48fd9000094d13b06a823b))
* **mcp:** add option to infer mcp client ([79eb017](https://github.com/flowglad/flowglad-node/commit/79eb0176c1f772f9dafcc4cbc30f780f9333efa4))
* **mcp:** add unix socket option for remote MCP ([d9046c9](https://github.com/flowglad/flowglad-node/commit/d9046c9f0ff82694a1da1785b283873f9f67a415))
* **mcp:** parse query string as mcp client options in mcp server ([4595852](https://github.com/flowglad/flowglad-node/commit/45958528bbef675814b9d3fa71c647722c1801f9))
* **mcp:** remote server with passthru auth ([3790db5](https://github.com/flowglad/flowglad-node/commit/3790db5b8572ae511b04a16e5c019da11511b7fa))
* **mcp:** support filtering tool results by a jq expression ([b6fb8e2](https://github.com/flowglad/flowglad-node/commit/b6fb8e222bd687786c96a0b023b22f371a4bbf7d))


### Bug Fixes

* **ci:** release-doctor — report correct token name ([51f10bf](https://github.com/flowglad/flowglad-node/commit/51f10bf06bf5c8700293510678a512dc23ea9b57))
* **client:** get fetchOptions type more reliably ([f992b90](https://github.com/flowglad/flowglad-node/commit/f992b90421e4693bc00d956a736c70691b494bfb))
* **mcp:** avoid sending `jq_filter` to base API ([47e138e](https://github.com/flowglad/flowglad-node/commit/47e138e835bc86287ad681923bd9d37554ffaf29))
* **mcp:** fix bug in header handling ([b02cec9](https://github.com/flowglad/flowglad-node/commit/b02cec933dfea867bc0fd7cff8d1752c1deeddd3))
* **mcp:** fix tool description of jq_filter ([a3c1124](https://github.com/flowglad/flowglad-node/commit/a3c112419f677e9864bd7c2e3b20eb6dc0739cd0))
* **mcp:** generate additionalProperties=true for map schemas to avoid validation issues ([7a8aefb](https://github.com/flowglad/flowglad-node/commit/7a8aefbbac9baa8e9c9bbfa19cf4731e8066df7e))
* **mcp:** include required section for top-level properties and support naming transformations ([d954143](https://github.com/flowglad/flowglad-node/commit/d9541434fddbcf1be078671a1047dfc81f3327bd))
* **mcp:** relax input type for asTextContextResult ([4eb359e](https://github.com/flowglad/flowglad-node/commit/4eb359e33f8de5825640fb86203956c4496ab8de))
* **mcp:** reverse validJson capability option and limit scope ([0114889](https://github.com/flowglad/flowglad-node/commit/01148896da612b853195710bf33ebdf2ef2339f7))
* **mcp:** support jq filtering on cloudflare workers ([1cb62d7](https://github.com/flowglad/flowglad-node/commit/1cb62d721ed4c9b10745fe940590c7e0f518f34a))


### Chores

* add docs to RequestOptions type ([5673bd9](https://github.com/flowglad/flowglad-node/commit/5673bd9adaf5d53b6b740bf972236ad50c2a0300))
* add package to package.json ([4e57a8f](https://github.com/flowglad/flowglad-node/commit/4e57a8f2250113400fa243aff2577eda22258b29))
* **ci:** only run for pushes and fork pull requests ([7133a67](https://github.com/flowglad/flowglad-node/commit/7133a67258382c3a4f657185410be9b51c18f68f))
* **client:** improve path param validation ([40bf088](https://github.com/flowglad/flowglad-node/commit/40bf088914e1bed67f4bdffb0d2f57d15acb005b))
* **client:** qualify global Blob ([cd495ee](https://github.com/flowglad/flowglad-node/commit/cd495ee6316fd1446b3f75c6391614a65fa077b2))
* **deps:** update dependency @types/node to v20.17.58 ([7de8c26](https://github.com/flowglad/flowglad-node/commit/7de8c26d2445a86dbb169927474d4532fc9be9db))
* **internal:** codegen related update ([1fee692](https://github.com/flowglad/flowglad-node/commit/1fee69217a0af68c31e20ff9dce4b5a1aa2a5796))
* **internal:** codegen related update ([0b5da41](https://github.com/flowglad/flowglad-node/commit/0b5da41eee71d91adfe082a3ccedf362acee76f8))
* **internal:** codegen related update ([5cc2ae0](https://github.com/flowglad/flowglad-node/commit/5cc2ae097780f0c82353c97bf3a174b3f540e9ef))
* **internal:** codegen related update ([a3b57a4](https://github.com/flowglad/flowglad-node/commit/a3b57a4f643053e79b6dd171076df37494824738))
* **internal:** formatting change ([57a4460](https://github.com/flowglad/flowglad-node/commit/57a4460b3bb1954afcb735b61f3c30f622b40404))
* **internal:** make mcp-server publishing public by defaut ([dedddc8](https://github.com/flowglad/flowglad-node/commit/dedddc805fbf512c0d65c8d2d728b652d32c653e))
* **internal:** move publish config ([65be443](https://github.com/flowglad/flowglad-node/commit/65be443b89aadf906fe1a6cbddb5a00e0174fcb1))
* **internal:** refactor array check ([88ca819](https://github.com/flowglad/flowglad-node/commit/88ca819ac06af4800a2337b4ad4a57276cded8ee))
* **internal:** remove redundant imports config ([62fbf68](https://github.com/flowglad/flowglad-node/commit/62fbf68fcc53ef784abf22955bd63e81c062779e))
* **internal:** update comment in script ([ecd3afd](https://github.com/flowglad/flowglad-node/commit/ecd3afd63aabdf4d9d92ed49dfbf60d603987118))
* make some internal functions async ([d14a6a0](https://github.com/flowglad/flowglad-node/commit/d14a6a0c3ede0dfbd908bccc52e0a20f9bab2e79))
* **mcp:** add cors to oauth metadata route ([1a638e6](https://github.com/flowglad/flowglad-node/commit/1a638e6e931926156ab3d312abbea1ee6de1e69c))
* **mcp:** document remote server in README.md ([13d6332](https://github.com/flowglad/flowglad-node/commit/13d6332d23369dc5d6ba4838c250ec58fec9866d))
* **mcp:** formatting ([30ba925](https://github.com/flowglad/flowglad-node/commit/30ba92555911cb0fc0e5069f3ecc736549663db5))
* **mcp:** minor cleanup of types and package.json ([53ee586](https://github.com/flowglad/flowglad-node/commit/53ee5863b0f001ea4f87412c740347e4b471cd19))
* **mcp:** refactor streamable http transport ([537cc07](https://github.com/flowglad/flowglad-node/commit/537cc079137027a1b7c5bb50c9e6dd89a8210c98))
* **mcp:** rework imports in tools ([4fb589d](https://github.com/flowglad/flowglad-node/commit/4fb589d6bbd22237a3dfb908c9b76935086259cc))
* **mcp:** update package.json ([3e6dbd9](https://github.com/flowglad/flowglad-node/commit/3e6dbd9ce8bd763d5f0c07e9cafdd81b57c9b7c7))
* **mcp:** update README ([8640f1b](https://github.com/flowglad/flowglad-node/commit/8640f1b212b97452e5e80076f979e0c9af089b49))
* **mcp:** update types ([fa495cb](https://github.com/flowglad/flowglad-node/commit/fa495cb6f78f4ff90234cd024aff809bfaee726b))
* **ts:** reorder package.json imports ([75a2591](https://github.com/flowglad/flowglad-node/commit/75a25917485552028c3b738098a3ca198378f347))
* update @stainless-api/prism-cli to v5.15.0 ([1a848b0](https://github.com/flowglad/flowglad-node/commit/1a848b075c1d9bc00c3a4fcc775e29c4445e5d48))
* update CI script ([7958db2](https://github.com/flowglad/flowglad-node/commit/7958db2cb6b6c62ae8e177f84698b480d8f2d1fd))

## 0.21.0 (2025-06-25)

Full Changelog: [v0.20.0...v0.21.0](https://github.com/flowglad/flowglad-node/compare/v0.20.0...v0.21.0)

### Features

* **api:** activate subscription checkout session ([9a2a56e](https://github.com/flowglad/flowglad-node/commit/9a2a56e061fe8db260568d0a5547c4dc81a3756a))


### Refactors

* **types:** replace Record with mapped types ([560e1a4](https://github.com/flowglad/flowglad-node/commit/560e1a4b96210410b5a934a8c42f68c6f8280ed0))

## 0.20.0 (2025-06-23)

Full Changelog: [v0.19.3...v0.20.0](https://github.com/flowglad/flowglad-node/compare/v0.19.3...v0.20.0)

### Features

* **client:** add support for endpoint-specific base URLs ([5a82f21](https://github.com/flowglad/flowglad-node/commit/5a82f2175b03b4f3a8257997de18443fa95adb6b))
* **client:** add withOptions helper ([ccd3f8d](https://github.com/flowglad/flowglad-node/commit/ccd3f8d8d85f1be17fb41047572477810b138941))


### Bug Fixes

* **client:** always overwrite when merging headers ([be6125e](https://github.com/flowglad/flowglad-node/commit/be6125e4fa45c50f6bdf6cf79d21c346faf099ee))
* **client:** explicitly copy fetch in withOptions ([a075167](https://github.com/flowglad/flowglad-node/commit/a075167dc9cee2557b3b89a84e652a0c9148b74a))
* compat with more runtimes ([c6e2c80](https://github.com/flowglad/flowglad-node/commit/c6e2c80a6f410aeb25ab05c8ea3ea1cdd6e15ae4))
* publish script — handle NPM errors correctly ([58f80d7](https://github.com/flowglad/flowglad-node/commit/58f80d7d4c2a250e3f01b9fec831f82c3a2329ec))


### Chores

* adjust eslint.config.mjs ignore pattern ([17914a2](https://github.com/flowglad/flowglad-node/commit/17914a24f1796b54b28cefc6dc62c684259a3b60))
* avoid type error in certain environments ([f8edd17](https://github.com/flowglad/flowglad-node/commit/f8edd17560cc0dc62801e18c0eb36248bc458eee))
* **ci:** enable for pull requests ([3742f46](https://github.com/flowglad/flowglad-node/commit/3742f46b541c90d80a3f62584d53e93f612c312f))
* **client:** drop support for EOL node versions ([fe63be8](https://github.com/flowglad/flowglad-node/commit/fe63be8a99b4bc10335ade513595b5c57df36c51))
* **client:** refactor imports ([7ccd8cd](https://github.com/flowglad/flowglad-node/commit/7ccd8cd67f75c4f8aaf4745b6f6b8814d0d017f1))
* configure new SDK language ([fc92220](https://github.com/flowglad/flowglad-node/commit/fc92220a3df6f0032f664592e6ab4540b5a5ce95))
* **deps:** bump eslint-plugin-prettier ([cad7a60](https://github.com/flowglad/flowglad-node/commit/cad7a603f5d66d6ba02fbe6d6e3af7695b209370))
* **docs:** grammar improvements ([381cb9f](https://github.com/flowglad/flowglad-node/commit/381cb9fa9171106cefef5161b3cab75f616affa4))
* **docs:** use top-level-await in example snippets ([fa4d484](https://github.com/flowglad/flowglad-node/commit/fa4d484b457830c7fa307af2955422dec4dacbb6))
* improve publish-npm script --latest tag logic ([25c4a83](https://github.com/flowglad/flowglad-node/commit/25c4a834927a82798fd3be38fc8c9c3eba544045))
* **internal:** add pure annotations, make base APIResource abstract ([3c796f4](https://github.com/flowglad/flowglad-node/commit/3c796f4c39455395e8548f08229d3a3dc468a2fc))
* **internal:** codegen related update ([46cb6de](https://github.com/flowglad/flowglad-node/commit/46cb6de1846471fd9e329d1d7e8724e3d2dadc35))
* **internal:** fix readablestream types in node 20 ([7e9b2bc](https://github.com/flowglad/flowglad-node/commit/7e9b2bc80d4159f465548ebf1fbb6637176c4de3))
* **internal:** refactor utils ([c77f96e](https://github.com/flowglad/flowglad-node/commit/c77f96efcc737e22af3564dcd9cb1cc5aa5448cd))
* **internal:** share typescript helpers ([3d4da28](https://github.com/flowglad/flowglad-node/commit/3d4da2880f8db32231763163897e8a81922d2e9e))
* **internal:** update jest config ([fc657ba](https://github.com/flowglad/flowglad-node/commit/fc657ba6cd143572fdf23a060527606e0c4e8354))
* **package:** remove engines ([fc2699b](https://github.com/flowglad/flowglad-node/commit/fc2699b14740fc8de8b13a4461bfaf4bfbbf39e6))
* **readme:** update badges ([aeeecfb](https://github.com/flowglad/flowglad-node/commit/aeeecfbba8054e1346ba5af3b16b2564c2018b85))
* **readme:** use better example snippet for undocumented params ([830a80c](https://github.com/flowglad/flowglad-node/commit/830a80c218feee976d2b919867d298629162bb22))


### Documentation

* **readme:** fix typo ([6dd84f2](https://github.com/flowglad/flowglad-node/commit/6dd84f2502fb96abd38fd9842b5ab4a690aa4f93))

## 0.19.3 (2025-04-28)

Full Changelog: [v0.19.2...v0.19.3](https://github.com/flowglad/flowglad-node/compare/v0.19.2...v0.19.3)

### Bug Fixes

* **api:** lift targetSubscriptionId on add payment method checkout session ([13835f2](https://github.com/flowglad/flowglad-node/commit/13835f24eb4ff08877e793c48f7343d6b589ac90))
* **internal:** fix file uploads in node 18 jest ([12f59fa](https://github.com/flowglad/flowglad-node/commit/12f59fa1b535d03a25e3f80b8dfbdf1056939156))


### Chores

* **ci:** add timeout thresholds for CI jobs ([4c5276b](https://github.com/flowglad/flowglad-node/commit/4c5276bcf69db2a4a9c29f4b5856c8c51ba6e829))
* **ci:** only use depot for staging repos ([0821ddd](https://github.com/flowglad/flowglad-node/commit/0821ddd52ba6416de8fdc6972a699874bcd0dcf1))
* **client:** minor internal fixes ([5d814c8](https://github.com/flowglad/flowglad-node/commit/5d814c82736e924d8fdbb1fb06319566b822e2b6))
* **internal:** codegen related update ([d032c38](https://github.com/flowglad/flowglad-node/commit/d032c382b347ef17e58b2e4e1f1778afc8c5d655))
* **perf:** faster base64 decoding ([7e3a28c](https://github.com/flowglad/flowglad-node/commit/7e3a28c3e842500a6cc7c9d972a6e30ad0b660e3))

## 0.19.2 (2025-04-10)

Full Changelog: [v0.19.1...v0.19.2](https://github.com/flowglad/flowglad-node/compare/v0.19.1...v0.19.2)

### Bug Fixes

* **api:** fix trialEnd timestamp issue ([9f75ccf](https://github.com/flowglad/flowglad-node/commit/9f75ccfdcfe1686c1e5d8835a35891fb87cd4151))

## 0.19.1 (2025-04-10)

Full Changelog: [v0.19.0...v0.19.1](https://github.com/flowglad/flowglad-node/compare/v0.19.0...v0.19.1)

### Bug Fixes

* **api:** fix missing priceId on CheckoutSessionCreateParams ([e48ce4e](https://github.com/flowglad/flowglad-node/commit/e48ce4e167d67d621b3f517c297ee25f874632c1))
* **api:** fix refund payment, better types on checkout session creation ([862204c](https://github.com/flowglad/flowglad-node/commit/862204c4cab30f85a91bf9885cddc968ce2c6a24))

## 0.19.0 (2025-04-10)

Full Changelog: [v0.18.3...v0.19.0](https://github.com/flowglad/flowglad-node/compare/v0.18.3...v0.19.0)

### Features

* **api:** create subscription ([a7966f4](https://github.com/flowglad/flowglad-node/commit/a7966f49eb35a9d7ab3fbe71da61c7aa85b8ca8e))


### Bug Fixes

* **client:** send all configured auth headers ([#161](https://github.com/flowglad/flowglad-node/issues/161)) ([b3d6785](https://github.com/flowglad/flowglad-node/commit/b3d6785ee24ed8ed9e68b098cb98409147ab6bfb))
* **mcp:** remove unused tools.ts ([#159](https://github.com/flowglad/flowglad-node/issues/159)) ([6d71ce3](https://github.com/flowglad/flowglad-node/commit/6d71ce3b5d5a2fb97a13cb28f92af4132645dfd5))


### Chores

* **internal:** improve node 18 shims ([ea417c1](https://github.com/flowglad/flowglad-node/commit/ea417c1b26ae924d6de90d1679d38478f4a4190a))
* **internal:** reduce CI branch coverage ([cdf1059](https://github.com/flowglad/flowglad-node/commit/cdf1059418db42cc2246c9c8ffb1d9442653438e))
* **internal:** upload builds and expand CI branch coverage ([28e6aaf](https://github.com/flowglad/flowglad-node/commit/28e6aaff6edf957144169feba4c3041f4afef6cd))

## 0.18.3 (2025-04-05)

Full Changelog: [v0.18.2...v0.18.3](https://github.com/flowglad/flowglad-node/compare/v0.18.2...v0.18.3)

### Bug Fixes

* **api:** manual updates on checkout session ([#156](https://github.com/flowglad/flowglad-node/issues/156)) ([c1fdb86](https://github.com/flowglad/flowglad-node/commit/c1fdb867c271d265b70bb6d191a1ca5c9a723ef6))
* **api:** manual updates to checkout sessions create params ([#153](https://github.com/flowglad/flowglad-node/issues/153)) ([555cda9](https://github.com/flowglad/flowglad-node/commit/555cda923bbc72369a2688c3077196ca37762a94))

## 0.18.2 (2025-04-04)

Full Changelog: [v0.18.1...v0.18.2](https://github.com/flowglad/flowglad-node/compare/v0.18.1...v0.18.2)

### Bug Fixes

* **api:** checkout session type ([#149](https://github.com/flowglad/flowglad-node/issues/149)) ([cf6ceb6](https://github.com/flowglad/flowglad-node/commit/cf6ceb6c4b2b4099550ffd630b0eebe827e1e7c7))

## 0.18.1 (2025-04-04)

Full Changelog: [v0.18.0...v0.18.1](https://github.com/flowglad/flowglad-node/compare/v0.18.0...v0.18.1)

### Bug Fixes

* **api:** improve type resolution when importing as a package ([#145](https://github.com/flowglad/flowglad-node/issues/145)) ([cd14ac4](https://github.com/flowglad/flowglad-node/commit/cd14ac41c41249fd96d485764b5e233dd1424004))
* **client:** send `X-Stainless-Timeout` in seconds ([#143](https://github.com/flowglad/flowglad-node/issues/143)) ([3b3077d](https://github.com/flowglad/flowglad-node/commit/3b3077ddf8e8a2c021aa4038ab07903bb180563b))
* pluralize `list` response variables ([#141](https://github.com/flowglad/flowglad-node/issues/141)) ([99ed092](https://github.com/flowglad/flowglad-node/commit/99ed092ff9e59bb20c9bc2d92275486d48c95541))


### Chores

* **internal:** add aliases for Record and Array ([#144](https://github.com/flowglad/flowglad-node/issues/144)) ([8f6f3c7](https://github.com/flowglad/flowglad-node/commit/8f6f3c7ad97e62b602c7ce93fb79f1b03ab16e93))

## 0.18.0 (2025-04-01)

Full Changelog: [v0.17.0...v0.18.0](https://github.com/flowglad/flowglad-node/compare/v0.17.0...v0.18.0)

### Features

* **api:** add usage meters to catalog type, add cru operations for usage events and usage meters ([#137](https://github.com/flowglad/flowglad-node/issues/137)) ([e72e0f2](https://github.com/flowglad/flowglad-node/commit/e72e0f2595979b17c211a38c8d8a0c94a5033ee2))

## 0.17.0 (2025-04-01)

Full Changelog: [v0.16.1...v0.17.0](https://github.com/flowglad/flowglad-node/compare/v0.16.1...v0.17.0)

### Features

* **api:** add usage meter aggregation types and price + usage meter associations ([#133](https://github.com/flowglad/flowglad-node/issues/133)) ([780dd04](https://github.com/flowglad/flowglad-node/commit/780dd04f61a3d5c2a2cb0cc96e75b9af46d1d08e))

## 0.16.1 (2025-03-29)

Full Changelog: [v0.16.0...v0.16.1](https://github.com/flowglad/flowglad-node/compare/v0.16.0...v0.16.1)

### Bug Fixes

* **api:** add checkout quantity, subscription.current ([#129](https://github.com/flowglad/flowglad-node/issues/129)) ([ba73464](https://github.com/flowglad/flowglad-node/commit/ba73464eb7bc72cdc87808c05256571a0392c235))

## 0.16.0 (2025-03-27)

Full Changelog: [v0.15.0...v0.16.0](https://github.com/flowglad/flowglad-node/compare/v0.15.0...v0.16.0)

### Features

* **api:** add default price to product object ([#124](https://github.com/flowglad/flowglad-node/issues/124)) ([01deb5d](https://github.com/flowglad/flowglad-node/commit/01deb5d9745a3563ac189ccc8227c690f7b532d8))


### Bug Fixes

* **api:** add better docs on discriminated unions ([#127](https://github.com/flowglad/flowglad-node/issues/127)) ([6ad4e61](https://github.com/flowglad/flowglad-node/commit/6ad4e614edbf1a95aa7faefb2041ea2fafda991e))
* **api:** add better docs on prices ([#125](https://github.com/flowglad/flowglad-node/issues/125)) ([3a10830](https://github.com/flowglad/flowglad-node/commit/3a10830e4bf254787f9da5bb9ea874a50ba9b52f))


### Chores

* **client:** move misc public files to new `core/` directory, deprecate old paths ([#122](https://github.com/flowglad/flowglad-node/issues/122)) ([e799b65](https://github.com/flowglad/flowglad-node/commit/e799b654b363a3b7a4238ae3f19e981ccc0480dc))

## 0.15.0 (2025-03-26)

Full Changelog: [v0.14.0...v0.15.0](https://github.com/flowglad/flowglad-node/compare/v0.14.0...v0.15.0)

### Features

* **api:** add output name to checkout session ([#119](https://github.com/flowglad/flowglad-node/issues/119)) ([e13aabb](https://github.com/flowglad/flowglad-node/commit/e13aabb1b98ddf4ac9f7185aca802e06c66308ab))

## 0.14.0 (2025-03-25)

Full Changelog: [v0.13.0...v0.14.0](https://github.com/flowglad/flowglad-node/compare/v0.13.0...v0.14.0)

### Features

* **api:** add checkout session outputmetadata ([#116](https://github.com/flowglad/flowglad-node/issues/116)) ([13103bb](https://github.com/flowglad/flowglad-node/commit/13103bb69a22fd6689099503d56d98fc94ad7aa9))

## 0.13.0 (2025-03-25)

Full Changelog: [v0.12.0...v0.13.0](https://github.com/flowglad/flowglad-node/compare/v0.12.0...v0.13.0)

### Features

* **api:** add outputMetadata to checkoutSessions ([#113](https://github.com/flowglad/flowglad-node/issues/113)) ([6dca5fd](https://github.com/flowglad/flowglad-node/commit/6dca5fdf0edf336efaa8f3c838dd265e773348be))

## 0.12.0 (2025-03-24)

Full Changelog: [v0.11.1...v0.12.0](https://github.com/flowglad/flowglad-node/compare/v0.11.1...v0.12.0)

### Features

* **api:** clone catalog method ([#109](https://github.com/flowglad/flowglad-node/issues/109)) ([cff44ba](https://github.com/flowglad/flowglad-node/commit/cff44bae45aba4cf85661d29232e427edb740da2))
* **api:** clone catalog method ([#111](https://github.com/flowglad/flowglad-node/issues/111)) ([279f962](https://github.com/flowglad/flowglad-node/commit/279f96280fd447d8ae24856f2ac746a995b34551))

## 0.11.1 (2025-03-24)

Full Changelog: [v0.11.0...v0.11.1](https://github.com/flowglad/flowglad-node/compare/v0.11.0...v0.11.1)

### Bug Fixes

* **api:** improve catalog detail response in customer billing ([#105](https://github.com/flowglad/flowglad-node/issues/105)) ([b207ad2](https://github.com/flowglad/flowglad-node/commit/b207ad2f763d62c403012c8b9c75785354a5edb8))

## 0.11.0 (2025-03-24)

Full Changelog: [v0.10.0...v0.11.0](https://github.com/flowglad/flowglad-node/compare/v0.10.0...v0.11.0)

### Features

* **api:** add catalogs ([#104](https://github.com/flowglad/flowglad-node/issues/104)) ([a9bda8d](https://github.com/flowglad/flowglad-node/commit/a9bda8d2ae6c0ec836bb50a1891f0dc919eb4932))


### Chores

* **internal:** codegen related update ([#102](https://github.com/flowglad/flowglad-node/issues/102)) ([876c3a6](https://github.com/flowglad/flowglad-node/commit/876c3a6d4bcc497fc5cb763a171ec4d1e153b87d))

## 0.10.0 (2025-03-19)

Full Changelog: [v0.9.1...v0.10.0](https://github.com/flowglad/flowglad-node/compare/v0.9.1...v0.10.0)

### Features

* add SKIP_BREW env var to ./scripts/bootstrap ([#65](https://github.com/flowglad/flowglad-node/issues/65)) ([028f384](https://github.com/flowglad/flowglad-node/commit/028f384d60118ee13bd5e3ae339608d12f7d2280))
* **api:** add invoice creation ([#97](https://github.com/flowglad/flowglad-node/issues/97)) ([67972ee](https://github.com/flowglad/flowglad-node/commit/67972ee453fbc2f23d6a4a8aa9168aaa77316518))
* **api:** add payment methods ([#53](https://github.com/flowglad/flowglad-node/issues/53)) ([d2868ba](https://github.com/flowglad/flowglad-node/commit/d2868babb3ca4cb112837ef5ece758e420be6faf))
* **api:** add payment methods to openapi spec ([#56](https://github.com/flowglad/flowglad-node/issues/56)) ([9e61941](https://github.com/flowglad/flowglad-node/commit/9e61941a218efa0c2aa485e0f5b288af9af5fec6))
* **api:** add url to open api purchase session response schema ([#45](https://github.com/flowglad/flowglad-node/issues/45)) ([58e5eaf](https://github.com/flowglad/flowglad-node/commit/58e5eafa85656de933d9dce9e6c57263b5fa51a3))
* **api:** all camel case everything ([#68](https://github.com/flowglad/flowglad-node/issues/68)) ([489ed56](https://github.com/flowglad/flowglad-node/commit/489ed56d680f911ee4359d5f9b864beb8170bf40))
* **api:** clean up ambiguous types, rm installment amounts ([#7](https://github.com/flowglad/flowglad-node/issues/7)) ([4d683db](https://github.com/flowglad/flowglad-node/commit/4d683db6df39ea87f265a1c2b75cce56d50dc674))
* **api:** Config update for agreea/dev ([#8](https://github.com/flowglad/flowglad-node/issues/8)) ([5e67321](https://github.com/flowglad/flowglad-node/commit/5e6732112006af37941429877446b3435d8d3dce))
* **api:** fix final price ([#82](https://github.com/flowglad/flowglad-node/issues/82)) ([3e281ab](https://github.com/flowglad/flowglad-node/commit/3e281abe1dc5a383719cbbeafa7b589d26576597))
* **api:** Fix flowglad API key ([#5](https://github.com/flowglad/flowglad-node/issues/5)) ([8664078](https://github.com/flowglad/flowglad-node/commit/8664078e6a187fd41107c92ad218d6e4ea0c618d))
* **api:** fix payment method return type ([#59](https://github.com/flowglad/flowglad-node/issues/59)) ([1ba2778](https://github.com/flowglad/flowglad-node/commit/1ba2778717cce15d741bae18f14daf91234f4518))
* **api:** invoice with line items in customer ([#72](https://github.com/flowglad/flowglad-node/issues/72)) ([79ebcdb](https://github.com/flowglad/flowglad-node/commit/79ebcdbe79d027ea0586877bc9e0e780a510f3eb))
* **api:** manual updates ([#13](https://github.com/flowglad/flowglad-node/issues/13)) ([37db566](https://github.com/flowglad/flowglad-node/commit/37db5661f576ac5c87825e9cfac27bc703627bde))
* **api:** manual updates ([#14](https://github.com/flowglad/flowglad-node/issues/14)) ([a27b272](https://github.com/flowglad/flowglad-node/commit/a27b2727b1015840ae0856696c25acb6a97399d7))
* **api:** manual updates ([#15](https://github.com/flowglad/flowglad-node/issues/15)) ([fb3698c](https://github.com/flowglad/flowglad-node/commit/fb3698cecdd1e0768ed96c8af34ee4be775ffb50))
* **api:** manual updates ([#16](https://github.com/flowglad/flowglad-node/issues/16)) ([3efc62d](https://github.com/flowglad/flowglad-node/commit/3efc62d568c6bd7d4acf0bd7f8340ffe36848351))
* **api:** manual updates ([#20](https://github.com/flowglad/flowglad-node/issues/20)) ([b249e61](https://github.com/flowglad/flowglad-node/commit/b249e6128e58279eb762ac76262c27708c228311))
* **api:** manual updates ([#21](https://github.com/flowglad/flowglad-node/issues/21)) ([6ec9521](https://github.com/flowglad/flowglad-node/commit/6ec95217b2729a72b0c30af6ca17f3c1cfe4d489))
* **api:** manual updates ([#22](https://github.com/flowglad/flowglad-node/issues/22)) ([3f416e7](https://github.com/flowglad/flowglad-node/commit/3f416e7bc65f1a2848c1342c022fc273c5cfa2a6))
* **api:** manual updates ([#23](https://github.com/flowglad/flowglad-node/issues/23)) ([f095ec1](https://github.com/flowglad/flowglad-node/commit/f095ec1d3729035f06ba8fea1f3f9cec7dc9f0b7))
* **api:** manual updates ([#25](https://github.com/flowglad/flowglad-node/issues/25)) ([4473988](https://github.com/flowglad/flowglad-node/commit/4473988f0e1ccd8ec0f0a76c5b568788eaf73a27))
* **api:** manual updates ([#26](https://github.com/flowglad/flowglad-node/issues/26)) ([8af9281](https://github.com/flowglad/flowglad-node/commit/8af9281b29852288f2dff4bbb240575a47b05909))
* **api:** manual updates ([#27](https://github.com/flowglad/flowglad-node/issues/27)) ([1c67bba](https://github.com/flowglad/flowglad-node/commit/1c67bba77bf55a2855835d495e32798f5970190f))
* **api:** manual updates ([#28](https://github.com/flowglad/flowglad-node/issues/28)) ([b7daa1f](https://github.com/flowglad/flowglad-node/commit/b7daa1f725764509732dcfbd2e47081cc0ca4052))
* **api:** move to v2 for better esm generations ([#75](https://github.com/flowglad/flowglad-node/issues/75)) ([2786497](https://github.com/flowglad/flowglad-node/commit/2786497adfc124b826e8a287adf5a0d55bc5c7ec))
* **api:** pluralize all resource calls ([#38](https://github.com/flowglad/flowglad-node/issues/38)) ([0afdff4](https://github.com/flowglad/flowglad-node/commit/0afdff48dce6338c6fa797559dad7bce344e4445))
* **api:** pluralize customer profile billing ([#40](https://github.com/flowglad/flowglad-node/issues/40)) ([85be3a2](https://github.com/flowglad/flowglad-node/commit/85be3a2fccdba789b97d60bb99d2b91921b2839b))
* **api:** pluralize subscriptions ([#41](https://github.com/flowglad/flowglad-node/issues/41)) ([d17de86](https://github.com/flowglad/flowglad-node/commit/d17de869165d0022393fc9fb0d5ce5289ecba123))
* **api:** purchase session to checkout session, variant to price ([#78](https://github.com/flowglad/flowglad-node/issues/78)) ([b50474f](https://github.com/flowglad/flowglad-node/commit/b50474f32a6330b515348843298eff3dea2cc4a2))
* **api:** purchase session to checkout session, variant to price ([#81](https://github.com/flowglad/flowglad-node/issues/81)) ([cbc6b02](https://github.com/flowglad/flowglad-node/commit/cbc6b0286cf9aeac5d08b5b8b8f16d69502a4d58))
* **api:** rename customer profiles to customers in config ([#86](https://github.com/flowglad/flowglad-node/issues/86)) ([e4eab9d](https://github.com/flowglad/flowglad-node/commit/e4eab9d24cf01c0f0b6b7318c7525f5dda707837))
* **api:** rename customer profiles to customers in config ([#86](https://github.com/flowglad/flowglad-node/issues/86)) ([b9e5925](https://github.com/flowglad/flowglad-node/commit/b9e59259b14d5788a416ef1f9625741583c4000d))
* **api:** rename customer profiles to customers in config ([#88](https://github.com/flowglad/flowglad-node/issues/88)) ([042a09a](https://github.com/flowglad/flowglad-node/commit/042a09a7866a648209ec3fd808341191b72d39d9))
* **api:** rename customer profiles to customers in config ([#88](https://github.com/flowglad/flowglad-node/issues/88)) ([567a279](https://github.com/flowglad/flowglad-node/commit/567a2791cc1a6612d27be09a8b4201d26a789724))
* **api:** rename customer profiles to customers in config ([#90](https://github.com/flowglad/flowglad-node/issues/90)) ([f0433d7](https://github.com/flowglad/flowglad-node/commit/f0433d79b5ef47132858b264de531c9319c658fb))
* **api:** rename customer profiles to customers in config ([#90](https://github.com/flowglad/flowglad-node/issues/90)) ([7a9a41d](https://github.com/flowglad/flowglad-node/commit/7a9a41dbcfebf32c5ca94293e572fafb2e1eec26))
* **api:** rename customer profiles to customers in config ([#92](https://github.com/flowglad/flowglad-node/issues/92)) ([822cbf9](https://github.com/flowglad/flowglad-node/commit/822cbf947d4995d50f8c86359a609a1dc8e33bd2))
* **api:** retrieve billing ([#35](https://github.com/flowglad/flowglad-node/issues/35)) ([42fc320](https://github.com/flowglad/flowglad-node/commit/42fc320ff335bfc609d8b0696aefba9aa3cbff9c))
* **api:** rich subscriptions ([#31](https://github.com/flowglad/flowglad-node/issues/31)) ([c0bce44](https://github.com/flowglad/flowglad-node/commit/c0bce441725419bfb2a9612401741b5f58d6e3ac))
* **api:** rich subscriptions only have subscription variants ([#33](https://github.com/flowglad/flowglad-node/issues/33)) ([5d203f8](https://github.com/flowglad/flowglad-node/commit/5d203f8a07b3fce718a1c2436eb3a50d2c62f142))
* **api:** update environments  ([#4](https://github.com/flowglad/flowglad-node/issues/4)) ([89660fa](https://github.com/flowglad/flowglad-node/commit/89660fa46a132f14db52872c02c8af1bd6db4d41))
* **api:** update README ([#3](https://github.com/flowglad/flowglad-node/issues/3)) ([f85399a](https://github.com/flowglad/flowglad-node/commit/f85399ac9f8fcc029b94a4e5d4bef93fd9c142f8))
* **api:** update via SDK Studio ([ad440b3](https://github.com/flowglad/flowglad-node/commit/ad440b3c874102554e9b49c46e50a527adf3d39d))
* **api:** update via SDK Studio ([eed05a8](https://github.com/flowglad/flowglad-node/commit/eed05a8f65579e7ec6fe6057531c4eb05c6d4633))
* **api:** update via SDK Studio ([25bf945](https://github.com/flowglad/flowglad-node/commit/25bf9459857098b79f15d735cfd7b4684793f2db))
* **api:** update via SDK Studio ([5101375](https://github.com/flowglad/flowglad-node/commit/51013751991b0104e25992e58e7b7c5acc6e9e11))
* **client:** accept RFC6838 JSON content types ([#67](https://github.com/flowglad/flowglad-node/issues/67)) ([e5edaf1](https://github.com/flowglad/flowglad-node/commit/e5edaf1863b10afbadcd1faf7194b9b787b81514))
* **client:** send `X-Stainless-Timeout` header ([#10](https://github.com/flowglad/flowglad-node/issues/10)) ([012d02c](https://github.com/flowglad/flowglad-node/commit/012d02c2061af443bbecae7cd793e9cfaf5f52a6))
* fix union member generations ([0af702b](https://github.com/flowglad/flowglad-node/commit/0af702b0a9faf15ddffc0b9f9224efa1fb483311))
* patch ([dd21299](https://github.com/flowglad/flowglad-node/commit/dd212994021facc168e5aca3c802484882a52b27))


### Bug Fixes

* **api:** get customer profile return type  ([#62](https://github.com/flowglad/flowglad-node/issues/62)) ([488457d](https://github.com/flowglad/flowglad-node/commit/488457d3c2641bad5617e9fab45c6db21578c736))
* **client:** correct type to enum ([#91](https://github.com/flowglad/flowglad-node/issues/91)) ([892f6d7](https://github.com/flowglad/flowglad-node/commit/892f6d76406ac89d75c1fa9ad8448107c11d8f2b))
* **client:** fix export map for index exports ([#12](https://github.com/flowglad/flowglad-node/issues/12)) ([fafa815](https://github.com/flowglad/flowglad-node/commit/fafa8158e5e1cfe82ec03d9674a60c75c9dc2935))


### Chores

* go live ([#1](https://github.com/flowglad/flowglad-node/issues/1)) ([b235c12](https://github.com/flowglad/flowglad-node/commit/b235c12823b0ae452a85a45094f42fe6f527fc9e))
* go live ([#17](https://github.com/flowglad/flowglad-node/issues/17)) ([269268a](https://github.com/flowglad/flowglad-node/commit/269268aa16595edded2d1b8bf6fcfb613b8ed5d7))
* go live ([#2](https://github.com/flowglad/flowglad-node/issues/2)) ([0724d46](https://github.com/flowglad/flowglad-node/commit/0724d469b1711f6ff2e26d0d7073cd2d1d9d1e81))
* **internal:** add test ([#6](https://github.com/flowglad/flowglad-node/issues/6)) ([b479989](https://github.com/flowglad/flowglad-node/commit/b479989a2de24caeee2d590d9304fcf6c53a59aa))
* **internal:** fix devcontainers setup ([#48](https://github.com/flowglad/flowglad-node/issues/48)) ([7fc1d20](https://github.com/flowglad/flowglad-node/commit/7fc1d20e0b56e97092b821577e7c5538bce258db))
* **internal:** minor client file refactoring ([#85](https://github.com/flowglad/flowglad-node/issues/85)) ([da121e7](https://github.com/flowglad/flowglad-node/commit/da121e70969f107ee34c31a44daf2d4f3c6d9742))
* **internal:** remove extra empty newlines ([#70](https://github.com/flowglad/flowglad-node/issues/70)) ([c1992ec](https://github.com/flowglad/flowglad-node/commit/c1992ec3e9e0e25100bca1eccb039c0d367eff1e))
* **internal:** type updates ([#50](https://github.com/flowglad/flowglad-node/issues/50)) ([f9f786e](https://github.com/flowglad/flowglad-node/commit/f9f786e9f3c401b5ad04c553d72edcfc8ab26e19))
* update SDK settings ([#19](https://github.com/flowglad/flowglad-node/issues/19)) ([ed9818c](https://github.com/flowglad/flowglad-node/commit/ed9818cd54c064e1b9d513e4f25e0a6038984c84))


### Documentation

* update URLs from stainlessapi.com to stainless.com ([#51](https://github.com/flowglad/flowglad-node/issues/51)) ([b8483ef](https://github.com/flowglad/flowglad-node/commit/b8483efdef4373368f913ffdae8813040c717bfe))

## 0.9.1 (2025-03-19)

Full Changelog: [v0.9.0...v0.9.1](https://github.com/flowglad/flowglad-node/compare/v0.9.0...v0.9.1)

### Bug Fixes
* Fix the UnionMember generated type names on various types

## 0.9.0 (2025-03-19)

Full Changelog: [v0.8.1...v0.9.0](https://github.com/flowglad/flowglad-node/compare/v0.8.1...v0.9.0)

### Features

* **api:** rename customer profiles to customers in config ([#86](https://github.com/flowglad/flowglad-node/issues/86)) ([e4eab9d](https://github.com/flowglad/flowglad-node/commit/e4eab9d24cf01c0f0b6b7318c7525f5dda707837))
* **api:** rename customer profiles to customers in config ([#88](https://github.com/flowglad/flowglad-node/issues/88)) ([042a09a](https://github.com/flowglad/flowglad-node/commit/042a09a7866a648209ec3fd808341191b72d39d9))
* **api:** rename customer profiles to customers in config ([#90](https://github.com/flowglad/flowglad-node/issues/90)) ([f0433d7](https://github.com/flowglad/flowglad-node/commit/f0433d79b5ef47132858b264de531c9319c658fb))
* **api:** rename customer profiles to customers in config ([#92](https://github.com/flowglad/flowglad-node/issues/92)) ([822cbf9](https://github.com/flowglad/flowglad-node/commit/822cbf947d4995d50f8c86359a609a1dc8e33bd2))


### Bug Fixes

* **client:** correct type to enum ([#91](https://github.com/flowglad/flowglad-node/issues/91)) ([892f6d7](https://github.com/flowglad/flowglad-node/commit/892f6d76406ac89d75c1fa9ad8448107c11d8f2b))

## 0.8.1 (2025-03-19)

Full Changelog: [v0.8.0...v0.8.1](https://github.com/flowglad/flowglad-node/compare/v0.8.0...v0.8.1)

### Chores

* **internal:** minor client file refactoring ([#85](https://github.com/flowglad/flowglad-node/issues/85)) ([da121e7](https://github.com/flowglad/flowglad-node/commit/da121e70969f107ee34c31a44daf2d4f3c6d9742))

## 0.8.0 (2025-03-18)

Full Changelog: [v0.7.0...v0.8.0](https://github.com/flowglad/flowglad-node/compare/v0.7.0...v0.8.0)

### Features

* **api:** fix final price ([#82](https://github.com/flowglad/flowglad-node/issues/82)) ([3e281ab](https://github.com/flowglad/flowglad-node/commit/3e281abe1dc5a383719cbbeafa7b589d26576597))
* **api:** purchase session to checkout session, variant to price ([#78](https://github.com/flowglad/flowglad-node/issues/78)) ([b50474f](https://github.com/flowglad/flowglad-node/commit/b50474f32a6330b515348843298eff3dea2cc4a2))
* **api:** purchase session to checkout session, variant to price ([#81](https://github.com/flowglad/flowglad-node/issues/81)) ([cbc6b02](https://github.com/flowglad/flowglad-node/commit/cbc6b0286cf9aeac5d08b5b8b8f16d69502a4d58))


### Documentation

* update URLs from stainlessapi.com to stainless.com ([#51](https://github.com/flowglad/flowglad-node/issues/51)) ([b8483ef](https://github.com/flowglad/flowglad-node/commit/b8483efdef4373368f913ffdae8813040c717bfe))

## 0.7.0 (2025-03-17)

Full Changelog: [v0.6.0...v0.7.0](https://github.com/flowglad/flowglad-node/compare/v0.6.0...v0.7.0)

### Features

* **api:** move to v2 for better esm generations ([#75](https://github.com/flowglad/flowglad-node/issues/75)) ([2786497](https://github.com/flowglad/flowglad-node/commit/2786497adfc124b826e8a287adf5a0d55bc5c7ec))

## 0.6.0 (2025-03-14)

Full Changelog: [v0.5.0...v0.6.0](https://github.com/flowglad/flowglad-node/compare/v0.5.0...v0.6.0)

### Features

* **api:** invoice with line items in customer ([#72](https://github.com/flowglad/flowglad-node/issues/72)) ([79ebcdb](https://github.com/flowglad/flowglad-node/commit/79ebcdbe79d027ea0586877bc9e0e780a510f3eb))


### Chores

* **internal:** remove extra empty newlines ([#70](https://github.com/flowglad/flowglad-node/issues/70)) ([c1992ec](https://github.com/flowglad/flowglad-node/commit/c1992ec3e9e0e25100bca1eccb039c0d367eff1e))

## 0.5.0 (2025-03-13)

Full Changelog: [v0.4.1...v0.5.0](https://github.com/flowglad/flowglad-node/compare/v0.4.1...v0.5.0)

### Features

* add SKIP_BREW env var to ./scripts/bootstrap ([#65](https://github.com/flowglad/flowglad-node/issues/65)) ([028f384](https://github.com/flowglad/flowglad-node/commit/028f384d60118ee13bd5e3ae339608d12f7d2280))
* **api:** all camel case everything ([#68](https://github.com/flowglad/flowglad-node/issues/68)) ([489ed56](https://github.com/flowglad/flowglad-node/commit/489ed56d680f911ee4359d5f9b864beb8170bf40))
* **client:** accept RFC6838 JSON content types ([#67](https://github.com/flowglad/flowglad-node/issues/67)) ([e5edaf1](https://github.com/flowglad/flowglad-node/commit/e5edaf1863b10afbadcd1faf7194b9b787b81514))

## 0.4.1 (2025-03-04)

Full Changelog: [v0.4.0...v0.4.1](https://github.com/flowglad/flowglad-node/compare/v0.4.0...v0.4.1)

### Bug Fixes

* **api:** get customer profile return type  ([#62](https://github.com/flowglad/flowglad-node/issues/62)) ([488457d](https://github.com/flowglad/flowglad-node/commit/488457d3c2641bad5617e9fab45c6db21578c736))

## 0.4.0 (2025-03-04)

Full Changelog: [v0.3.0...v0.4.0](https://github.com/flowglad/flowglad-node/compare/v0.3.0...v0.4.0)

### Features

* **api:** fix payment method return type ([#59](https://github.com/flowglad/flowglad-node/issues/59)) ([1ba2778](https://github.com/flowglad/flowglad-node/commit/1ba2778717cce15d741bae18f14daf91234f4518))

## 0.3.0 (2025-03-04)

Full Changelog: [v0.2.0...v0.3.0](https://github.com/flowglad/flowglad-node/compare/v0.2.0...v0.3.0)

### Features

* **api:** add payment methods to openapi spec ([#56](https://github.com/flowglad/flowglad-node/issues/56)) ([9e61941](https://github.com/flowglad/flowglad-node/commit/9e61941a218efa0c2aa485e0f5b288af9af5fec6))

## 0.2.0 (2025-03-04)

Full Changelog: [v0.1.1...v0.2.0](https://github.com/flowglad/flowglad-node/compare/v0.1.1...v0.2.0)

### Features

* **api:** add payment methods ([#53](https://github.com/flowglad/flowglad-node/issues/53)) ([d2868ba](https://github.com/flowglad/flowglad-node/commit/d2868babb3ca4cb112837ef5ece758e420be6faf))

## 0.1.1 (2025-02-27)

Full Changelog: [v0.1.0...v0.1.1](https://github.com/flowglad/flowglad-node/compare/v0.1.0...v0.1.1)

### Chores

* **internal:** fix devcontainers setup ([#48](https://github.com/flowglad/flowglad-node/issues/48)) ([7fc1d20](https://github.com/flowglad/flowglad-node/commit/7fc1d20e0b56e97092b821577e7c5538bce258db))
* **internal:** type updates ([#50](https://github.com/flowglad/flowglad-node/issues/50)) ([f9f786e](https://github.com/flowglad/flowglad-node/commit/f9f786e9f3c401b5ad04c553d72edcfc8ab26e19))

## 0.1.0 (2025-02-21)

Full Changelog: [v0.1.0-alpha.5...v0.1.0](https://github.com/flowglad/flowglad-node/compare/v0.1.0-alpha.5...v0.1.0)

### Features

* **api:** add url to open api purchase session response schema ([#45](https://github.com/flowglad/flowglad-node/issues/45)) ([58e5eaf](https://github.com/flowglad/flowglad-node/commit/58e5eafa85656de933d9dce9e6c57263b5fa51a3))

## 0.1.0-alpha.5 (2025-02-21)

Full Changelog: [v0.1.0-alpha.4...v0.1.0-alpha.5](https://github.com/flowglad/flowglad-node/compare/v0.1.0-alpha.4...v0.1.0-alpha.5)

### Features

* **api:** pluralize all resource calls ([#38](https://github.com/flowglad/flowglad-node/issues/38)) ([0afdff4](https://github.com/flowglad/flowglad-node/commit/0afdff48dce6338c6fa797559dad7bce344e4445))
* **api:** pluralize customer profile billing ([#40](https://github.com/flowglad/flowglad-node/issues/40)) ([85be3a2](https://github.com/flowglad/flowglad-node/commit/85be3a2fccdba789b97d60bb99d2b91921b2839b))
* **api:** pluralize subscriptions ([#41](https://github.com/flowglad/flowglad-node/issues/41)) ([d17de86](https://github.com/flowglad/flowglad-node/commit/d17de869165d0022393fc9fb0d5ce5289ecba123))

## 0.1.0-alpha.4 (2025-02-21)

Full Changelog: [v0.1.0-alpha.3...v0.1.0-alpha.4](https://github.com/flowglad/flowglad-node/compare/v0.1.0-alpha.3...v0.1.0-alpha.4)

### Features

* **api:** retrieve billing ([#35](https://github.com/flowglad/flowglad-node/issues/35)) ([42fc320](https://github.com/flowglad/flowglad-node/commit/42fc320ff335bfc609d8b0696aefba9aa3cbff9c))

## 0.1.0-alpha.3 (2025-02-20)

Full Changelog: [v0.1.0-alpha.2...v0.1.0-alpha.3](https://github.com/flowglad/flowglad-node/compare/v0.1.0-alpha.2...v0.1.0-alpha.3)

### Features

* **api:** rich subscriptions ([#31](https://github.com/flowglad/flowglad-node/issues/31)) ([c0bce44](https://github.com/flowglad/flowglad-node/commit/c0bce441725419bfb2a9612401741b5f58d6e3ac))
* **api:** rich subscriptions only have subscription variants ([#33](https://github.com/flowglad/flowglad-node/issues/33)) ([5d203f8](https://github.com/flowglad/flowglad-node/commit/5d203f8a07b3fce718a1c2436eb3a50d2c62f142))

## 0.1.0-alpha.2 (2025-02-18)

Full Changelog: [v0.1.0-alpha.1...v0.1.0-alpha.2](https://github.com/flowglad/flowglad-node/compare/v0.1.0-alpha.1...v0.1.0-alpha.2)

### Features

* **api:** manual updates ([#13](https://github.com/flowglad/flowglad-node/issues/13)) ([37db566](https://github.com/flowglad/flowglad-node/commit/37db5661f576ac5c87825e9cfac27bc703627bde))
* **api:** manual updates ([#14](https://github.com/flowglad/flowglad-node/issues/14)) ([a27b272](https://github.com/flowglad/flowglad-node/commit/a27b2727b1015840ae0856696c25acb6a97399d7))
* **api:** manual updates ([#15](https://github.com/flowglad/flowglad-node/issues/15)) ([fb3698c](https://github.com/flowglad/flowglad-node/commit/fb3698cecdd1e0768ed96c8af34ee4be775ffb50))
* **api:** manual updates ([#16](https://github.com/flowglad/flowglad-node/issues/16)) ([3efc62d](https://github.com/flowglad/flowglad-node/commit/3efc62d568c6bd7d4acf0bd7f8340ffe36848351))
* **api:** manual updates ([#20](https://github.com/flowglad/flowglad-node/issues/20)) ([b249e61](https://github.com/flowglad/flowglad-node/commit/b249e6128e58279eb762ac76262c27708c228311))
* **api:** manual updates ([#21](https://github.com/flowglad/flowglad-node/issues/21)) ([6ec9521](https://github.com/flowglad/flowglad-node/commit/6ec95217b2729a72b0c30af6ca17f3c1cfe4d489))
* **api:** manual updates ([#22](https://github.com/flowglad/flowglad-node/issues/22)) ([3f416e7](https://github.com/flowglad/flowglad-node/commit/3f416e7bc65f1a2848c1342c022fc273c5cfa2a6))
* **api:** manual updates ([#23](https://github.com/flowglad/flowglad-node/issues/23)) ([f095ec1](https://github.com/flowglad/flowglad-node/commit/f095ec1d3729035f06ba8fea1f3f9cec7dc9f0b7))
* **api:** manual updates ([#25](https://github.com/flowglad/flowglad-node/issues/25)) ([4473988](https://github.com/flowglad/flowglad-node/commit/4473988f0e1ccd8ec0f0a76c5b568788eaf73a27))
* **api:** manual updates ([#26](https://github.com/flowglad/flowglad-node/issues/26)) ([8af9281](https://github.com/flowglad/flowglad-node/commit/8af9281b29852288f2dff4bbb240575a47b05909))
* **api:** manual updates ([#27](https://github.com/flowglad/flowglad-node/issues/27)) ([1c67bba](https://github.com/flowglad/flowglad-node/commit/1c67bba77bf55a2855835d495e32798f5970190f))
* **api:** manual updates ([#28](https://github.com/flowglad/flowglad-node/issues/28)) ([b7daa1f](https://github.com/flowglad/flowglad-node/commit/b7daa1f725764509732dcfbd2e47081cc0ca4052))
* **client:** send `X-Stainless-Timeout` header ([#10](https://github.com/flowglad/flowglad-node/issues/10)) ([012d02c](https://github.com/flowglad/flowglad-node/commit/012d02c2061af443bbecae7cd793e9cfaf5f52a6))


### Bug Fixes

* **client:** fix export map for index exports ([#12](https://github.com/flowglad/flowglad-node/issues/12)) ([fafa815](https://github.com/flowglad/flowglad-node/commit/fafa8158e5e1cfe82ec03d9674a60c75c9dc2935))


### Chores

* go live ([#17](https://github.com/flowglad/flowglad-node/issues/17)) ([269268a](https://github.com/flowglad/flowglad-node/commit/269268aa16595edded2d1b8bf6fcfb613b8ed5d7))
* update SDK settings ([#19](https://github.com/flowglad/flowglad-node/issues/19)) ([ed9818c](https://github.com/flowglad/flowglad-node/commit/ed9818cd54c064e1b9d513e4f25e0a6038984c84))

## 0.1.0-alpha.1 (2025-01-24)

Full Changelog: [v0.0.1-alpha.0...v0.1.0-alpha.1](https://github.com/flowglad/flowglad-node/compare/v0.0.1-alpha.0...v0.1.0-alpha.1)

### Features

* **api:** clean up ambiguous types, rm installment amounts ([#7](https://github.com/flowglad/flowglad-node/issues/7)) ([4d683db](https://github.com/flowglad/flowglad-node/commit/4d683db6df39ea87f265a1c2b75cce56d50dc674))
* **api:** Fix flowglad API key ([#5](https://github.com/flowglad/flowglad-node/issues/5)) ([8664078](https://github.com/flowglad/flowglad-node/commit/8664078e6a187fd41107c92ad218d6e4ea0c618d))
* **api:** update environments  ([#4](https://github.com/flowglad/flowglad-node/issues/4)) ([89660fa](https://github.com/flowglad/flowglad-node/commit/89660fa46a132f14db52872c02c8af1bd6db4d41))
* **api:** update README ([#3](https://github.com/flowglad/flowglad-node/issues/3)) ([f85399a](https://github.com/flowglad/flowglad-node/commit/f85399ac9f8fcc029b94a4e5d4bef93fd9c142f8))
* **api:** update via SDK Studio ([ad440b3](https://github.com/flowglad/flowglad-node/commit/ad440b3c874102554e9b49c46e50a527adf3d39d))
* **api:** update via SDK Studio ([eed05a8](https://github.com/flowglad/flowglad-node/commit/eed05a8f65579e7ec6fe6057531c4eb05c6d4633))
* **api:** update via SDK Studio ([25bf945](https://github.com/flowglad/flowglad-node/commit/25bf9459857098b79f15d735cfd7b4684793f2db))
* **api:** update via SDK Studio ([5101375](https://github.com/flowglad/flowglad-node/commit/51013751991b0104e25992e58e7b7c5acc6e9e11))


### Chores

* go live ([#1](https://github.com/flowglad/flowglad-node/issues/1)) ([b235c12](https://github.com/flowglad/flowglad-node/commit/b235c12823b0ae452a85a45094f42fe6f527fc9e))
* go live ([#2](https://github.com/flowglad/flowglad-node/issues/2)) ([0724d46](https://github.com/flowglad/flowglad-node/commit/0724d469b1711f6ff2e26d0d7073cd2d1d9d1e81))
* **internal:** add test ([#6](https://github.com/flowglad/flowglad-node/issues/6)) ([b479989](https://github.com/flowglad/flowglad-node/commit/b479989a2de24caeee2d590d9304fcf6c53a59aa))
