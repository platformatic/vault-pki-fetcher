# vault-pki-fetcher
Issue TLS certificates from a Vault cluster

# Usage

```javascript
import getCertificate from 'vault-pki-fetcher'

const options = {
  roleId: 'xxxx',
  secretId: 'yyyy',
  vaultAddress: 'https://localhost:8200',
  vaultNamespace: 'admin',
  commonName: 'example.com',
  ttl: '365d',
  CAName: 'your_ca',
  PKIRole: 'ca_role'
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