import { assert } from 'chai';
import micro from 'micro';
import listen from 'test-listen';
import got from 'got';
import { verifySecret } from '../../src/index';

suite('verify', function () {
  test('return "false" when "x-hub-signature" header is missing', async function () {
    const server = micro(async (req) => {
      const valid = await verifySecret(req, 'my-secret');
      assert.isFalse(valid);
      return '';
    });
    const url = await listen(server);
    await got(url, {
      method: 'POST',
      json: true,
      body: {},
    });
    server.close();
  });

  test('return "false" when secret is wrong', async function () {
    const server = micro(async (req) => {
      const valid = await verifySecret(req, 'wrong-secret');
      assert.isFalse(valid);
      return '';
    });
    const url = await listen(server);
    await got(url, {
      method: 'POST',
      headers: {
        'X-Hub-Signature': 'sha1=30a233839fe2ddd9233c49fd593e8f1aec68f553',
      },
      json: true,
      body: {
        foo: 'bar',
      },
    });
    server.close();
  });

  test('return "true" when secret is correct', async function () {
    const server = micro(async (req) => {
      const valid = await verifySecret(req, 'my-secret');
      assert.isTrue(valid);
      return '';
    });
    const url = await listen(server);
    await got(url, {
      method: 'POST',
      headers: {
        'X-Hub-Signature': 'sha1=30a233839fe2ddd9233c49fd593e8f1aec68f553',
      },
      json: true,
      body: {
        foo: 'bar',
      },
    });
    server.close();
  });

  test('should not hang when verify is called more than once', async function () {
    const server = micro(async (req) => {
      const valid = await verifySecret(req, 'my-secret');
      await verifySecret(req, 'my-secret');
      assert.isTrue(valid);
      return '';
    });
    const url = await listen(server);
    await got(url, {
      method: 'POST',
      headers: {
        'X-Hub-Signature': 'sha1=30a233839fe2ddd9233c49fd593e8f1aec68f553',
      },
      json: true,
      body: {
        foo: 'bar',
      },
    });
    server.close();
  });
});
