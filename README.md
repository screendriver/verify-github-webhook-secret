# verify-github-webhook-secret

[![GitHub Actions status](https://github.com/screendriver/verify-github-webhook-secret/workflows/CI/badge.svg)](https://github.com/screendriver/verify-github-webhook-secret/actions)

Verifies the [secret](https://developer.github.com/v3/repos/hooks/#create-hook-config-params) that is sent in [GitHub Webhooks](https://developer.github.com/webhooks/). The `secret` will be used as the key to generate the HMAC hex digest value in the `X-Hub-Signature` header.

## Installation 🏗

```sh
$ npm install --save verify-github-webhook-secret
```

or if you use [Yarn](https://yarnpkg.com) 🐈

```sh
$ yarn add verify-github-webhook-secret
```

## Usage 🔨

The exported function needs a [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) and your personal `secret` string. It returns a Promise that fulfills with a boolean if the received secret is valid or not.

You can use it for example with [micro](https://github.com/zeit/micro) as follows:

```ts
import micro from "micro";
import { verifySecret } from "verify-github-webhook-secret";

const server = micro(async (req) => {
	const valid = await verifySecret(req, "my-secret");
	return valid ? "Allowed" : "Not allowed";
});
```

Another way to call the function is directly with the HTTP body and the `x-hub-signature` HTTP header. This is useful in an scenario where you don't have an `IncomingMessage` like in some [serverless](https://en.wikipedia.org/wiki/Serverless_computing) environments.

```ts
import { verifySecret } from "verify-github-webhook-secret";

async function myFunc() {
	const valid = await verifySecret('{"foo":"bar"}', "my-secret", "sha1=30a233839fe2ddd9233c49fd593e8f1aec68f553");
	return valid ? "Allowed" : "Not allowed";
}
```
