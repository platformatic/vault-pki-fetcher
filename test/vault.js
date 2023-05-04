'use strict'

const { test } = require('node:test')
const assert = require('node:assert')
const { MockAgent, getGlobalDispatcher, setGlobalDispatcher } = require('undici')
const { approleLogin, issueCertificate } = require('../lib/vault')
test('should login to vault cluster with AppRole method', async (t) => {
  const _agent = getGlobalDispatcher()
  t.after(() => {
    setGlobalDispatcher(_agent)
  })
  const mockAgent = new MockAgent()
  mockAgent
    .get('http://vault.cluster')

    .intercept({
      method: 'POST',
      path: '/v1/auth/approle/login'
    })
    .reply((options) => {
      const body = JSON.parse(options.body)
      const headers = options.headers
      assert.strictEqual(body.role_id, 'fake-role-id')
      assert.strictEqual(body.secret_id, 'fake-secret-id')
      assert.strictEqual(headers['X-Vault-Namespace'], 'admin')
      assert.strictEqual(headers['Content-Type'], 'application/json')
      return {
        statusCode: 200,
        data: {
          auth: {
            client_token: 'a-sample-token'
          }
        }
      }
    })
  setGlobalDispatcher(mockAgent)
  const res = await approleLogin({
    vaultNamespace: 'admin',
    vaultAddress: 'http://vault.cluster',
    roleId: 'fake-role-id',
    secretId: 'fake-secret-id'
  })

  assert.strictEqual(res, 'a-sample-token')
})

test('should issue a certificate', async (t) => {
  const _agent = getGlobalDispatcher()
  t.after(() => {
    setGlobalDispatcher(_agent)
  })
  const mockAgent = new MockAgent()
  mockAgent
    .get('http://vault.cluster')

    .intercept({
      method: 'POST',
      path: '/v1/your_ca/issue/ca_role'
    })
    .reply((options) => {
      const body = JSON.parse(options.body)
      const headers = options.headers
      assert.strictEqual(body.common_name, 'example.com')
      assert.strictEqual(body.ttl, '365d')
      assert.strictEqual(headers['X-Vault-Namespace'], 'admin')
      assert.strictEqual(headers['X-Vault-Token'], 'a-sample-token')
      assert.strictEqual(headers['Content-Type'], 'application/json')
      return {
        statusCode: 200,
        data: {
          data: {
            private_key: 'privateKey',
            ca_chain: 'caChain',
            certificate: 'theCertificate'
          }
        }
      }
    })
  setGlobalDispatcher(mockAgent)
  const res = await issueCertificate({
    vaultNamespace: 'admin',
    vaultAddress: 'http://vault.cluster',
    CAName: 'your_ca',
    PKIRole: 'ca_role',
    vaultToken: 'a-sample-token',
    commonName: 'example.com',
    ttl: '365d'
  })

  assert.deepEqual(res, {
    key: 'privateKey',
    ca: 'caChain',
    cert: 'theCertificate'
  })
})
