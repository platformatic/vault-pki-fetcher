# vault-pki-fetcher
Issue TLS certificates from a Vault cluster. The return value can be set in a [`setSecureContext(...)`](https://nodejs.org/api/tls.html#serversetsecurecontextoptions) method call for a https server.

# Usage
For logging into Vault, you need a valid `roleId` and `secretId` with a policy able to read/write into your pki engine/role.

```javascript
import getCertificate from 'vault-pki-fetcher'

const options = {
  roleId: 'xxxx',
  secretId: 'yyyy',
  vaultAddress: 'https://localhost:8200',
  vaultNamespace: 'admin',
  commonName: 'example.com', // The common name the certificate will be valid for
  altNames: 'example2.com', // The Subject Alternative Names the certificate will be valid for
  ttl: '365d',
  CAName: 'your_ca', // the PKI engine name
  PKIRole: 'ca_role' // the PKI engine role name
}
const res = await getCertificate(options)
console.log(res)

/**
{
  key: '-----BEGIN RSA PRIVATE KEY-----\n' +
    ...
    '-----END RSA PRIVATE KEY-----',
  cert: '-----BEGIN CERTIFICATE-----\n' +
    ...
    '-----END CERTIFICATE-----',
  ca: [
    '-----BEGIN CERTIFICATE-----\n' +
      ...
    '-----END CERTIFICATE-----',
    '-----BEGIN CERTIFICATE-----\n' +
    ...
    '-----END CERTIFICATE-----'
  ]
}
*/ 
```