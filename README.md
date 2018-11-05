# verify-github-webhook-secret

[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue.svg)](https://www.typescriptlang.org)
[![Build Status](https://travis-ci.org/screendriver/verify-github-webhook-secret.svg?branch=master)](https://travis-ci.org/screendriver/verify-github-webhook-secret)
[![codecov](https://codecov.io/gh/screendriver/verify-github-webhook-secret/branch/master/graph/badge.svg)](https://codecov.io/gh/screendriver/verify-github-webhook-secret)

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
import micro from 'micro';
import verifySecret from 'verify-github-webhook-secret';

const server = micro(async req => {
  const valid = await verifySecret(req, 'my-secret');
  return valid ? 'Allowed' : 'Not allowed';
});
```
