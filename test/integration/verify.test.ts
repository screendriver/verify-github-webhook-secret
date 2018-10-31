import micro from 'micro';
import listen from 'test-listen';
import got from 'got';
import test from 'tape';
import verify = require('../../src/index');

test('return false when "x-hub-signature" header is missing', async t => {
  t.plan(1);
  const server = micro(async req => {
    const valid = await verify(req, 'my-secret');
    t.false(valid);
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

test('return false when secret is wrong', async t => {
  t.plan(1);
  const server = micro(async req => {
    const valid = await verify(req, 'wrong-secret');
    t.false(valid);
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

test('return true when secret is correct', async t => {
  t.plan(1);
  const server = micro(async req => {
    const valid = await verify(req, 'my-secret');
    t.true(valid);
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
