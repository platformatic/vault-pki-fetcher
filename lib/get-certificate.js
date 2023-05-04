'use strict'
const { approleLogin, issueCertificate } = require('./vault')

module.exports = async function getCertificate (options) {
  const {
    CAName,
    vaultAddress,
    vaultNamespace,
    roleId,
    secretId,
    commonName,
    ttl,
    PKIRole,
    altNames,
    ipSans
  } = options
  // Login to Vault token
  const vaultToken = await approleLogin({
    roleId,
    secretId,
    vaultAddress,
    vaultNamespace
  })
  // Issue the new certificate
  const certResponse = await issueCertificate({
    vaultNamespace,
    vaultAddress,
    CAName,
    PKIRole,
    vaultToken,
    commonName,
    ttl,
    altNames,
    ipSans
  })
  return certResponse
}
