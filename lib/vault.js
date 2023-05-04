'use strict'
import { request } from 'undici'
export async function approleLogin (options) {
  const {
    vaultNamespace,
    vaultAddress,
    roleId,
    secretId
  } = options
  // Get the vault token from the role id and secret id provided
  const loginUrl = `${vaultAddress}/v1/auth/approle/login`
  const tokenResponse = await request(loginUrl, {
    method: 'POST',
    headers: {
      'X-Vault-Namespace': vaultNamespace,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      role_id: roleId,
      secret_id: secretId
    })
  })
  const res = await tokenResponse.body.json()
  if (res.errors) {
    return handleVaultErrors(res.errors)
  }
  const vaultToken = res.auth.client_token
  return vaultToken
}

export async function issueCertificate (options) {
  const {
    vaultNamespace,
    vaultAddress,
    CAName,
    PKIRole,
    vaultToken,
    commonName,
    ttl,
    altNames,
    ipSans
  } = options
  const url = `${vaultAddress}/v1/${CAName}/issue/${PKIRole}`
  const certResponse = await request(url, {
    method: 'POST',
    headers: {
      'X-Vault-Token': vaultToken,
      'X-Vault-Namespace': vaultNamespace,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      common_name: commonName,
      ttl,
      alt_names: altNames,
      ip_sans: ipSans
    })
  })

  const res = await certResponse.body.json()
  if (res.errors) {
    return handleVaultErrors(res.errors)
  }
  const key = res.data.private_key
  const ca = res.data.ca_chain
  const cert = res.data.certificate
  return {
    key,
    cert,
    ca
  }
}

function handleVaultErrors (errors) {
  throw new Error(errors[0])
}
