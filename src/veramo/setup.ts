// Core interfaces
import {
    createAgent,
    IDIDManager,
    IResolver,
    IDataStore,
    IDataStoreORM,
    IKeyManager,
    ICredentialPlugin,
  } from '@veramo/core'
  
  // Core identity manager plugin
  import { DIDManager } from '@veramo/did-manager'
  
  // Ethr did identity provider
  import { EthrDIDProvider } from '@veramo/did-provider-ethr'
  
  // Core key manager plugin
  import { KeyManager } from '@veramo/key-manager'
  
  // Custom key management system for RN
  import { KeyManagementSystem, SecretBox } from '@veramo/kms-local'
  
  // W3C Verifiable Credential plugin
  import { CredentialPlugin } from '@veramo/credential-w3c'
  
  // Custom resolvers
  import { DIDResolverPlugin } from '@veramo/did-resolver'
  import { Resolver } from 'did-resolver'
  import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
  import { getResolver as webDidResolver } from 'web-did-resolver'
  
  // Storage plugin using TypeOrm
  import { Entities, KeyStore, DIDStore, PrivateKeyStore, migrations } from '@veramo/data-store'
  
  // TypeORM is installed with `@veramo/data-store`
  import { DataSource } from 'typeorm'

  // This will be the name for the local sqlite database for demo purposes
const DATABASE_FILE = 'database.sqlite'

// You will need to get a project ID from infura https://www.infura.io
const INFURA_PROJECT_ID = '3586660d179141e3801c3895de1c2eba'

// This will be the secret key for the KMS (replace this with your secret key)
const KMS_SECRET_KEY =
  'a5b666e3c4751fc699e060a6f53ad4289f7934b621022908bb299572c167836e'


  const dbConnection = new DataSource({
    type: 'sqlite',
    database: DATABASE_FILE,
    synchronize: false,
    migrations,
    migrationsRun: true,
    logging: ['error', 'info', 'warn'],
    entities: Entities,
  }).initialize()

  export const agent = createAgent<
  IDIDManager & IKeyManager & IDataStore & IDataStoreORM & IResolver & ICredentialPlugin
>({
  plugins: [
    new KeyManager({
      store: new KeyStore(dbConnection),
      kms: {
        local: new KeyManagementSystem(new PrivateKeyStore(dbConnection, new SecretBox(KMS_SECRET_KEY))),
      },
    }),
    new DIDManager({
      store: new DIDStore(dbConnection),
      defaultProvider: 'did:ethr:sepolia',
      providers: {
        'did:ethr:sepolia': new EthrDIDProvider({
          defaultKms: 'local',
          network: 'sepolia',
          rpcUrl: 'https://sepolia.infura.io/v3/' + INFURA_PROJECT_ID,
        }),
        'did:ethr:morph-holesky': new EthrDIDProvider({
            defaultKms: 'local',
            network: 'morph-holesky',
            rpcUrl: 'https://rpc-holesky.morphl2.io',
            registry: '0x72AA789b6Ad3Fd9764E3179A6cC7fBC1eCcbec3C',
      }),
      'did:ethr:morph': new EthrDIDProvider({
            defaultKms: 'local',
            network: 'morph',
            rpcUrl: 'https://rpc.morphl2.io',
      })
    },}),
    new DIDResolverPlugin({
      resolver: new Resolver({
        //...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
        ...ethrDidResolver({ networks: [
            { 
                name: 'morph-holesky', 
                registry: '0x72AA789b6Ad3Fd9764E3179A6cC7fBC1eCcbec3C', 
                rpcUrl: 'https://rpc-holesky.morphl2.io'},
            {
                name: 'morph', 
                rpcUrl: 'https://rpc.morphl2.io' 
            }
            ] }),
        ...webDidResolver(),
      }),
    }),
    new CredentialPlugin(),
  ],
})