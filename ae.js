const { Universal, Crypto, Node, MemoryAccount, AmountFormatter } = require('@aeternity/aepp-sdk')

const clientInstances = {}

function createKeyPair () {
  return Crypto.generateKeyPair()
}

function getAccount (keypair) {
  return MemoryAccount({ keypair })
}

async function getClient (account) {
  const nodeInstance = await Node({ url: process.env.AE_NODE_URL })
  const client = await Universal({
    accounts: [account],
    compilerUrl: process.env.AE_COMPILER_URL,
    nodes: [{ name: 'test-net', instance: nodeInstance }]
  })
  return client
}

async function setClientFromKeys (keypair) {
  const account = getAccount(keypair)
  let client
  let typeOp
  if (clientInstances[keypair]) {
    typeOp = 'old'
    client = clientInstances[keypair]
  } else {
    typeOp = 'new'
    const client = await getClient(account)
    clientInstances[keypair] = client
  }
  return { client, typeOp }
}

async function getClientFromKeys (keypair) {
  const account = getAccount(keypair)
  let client
  if (clientInstances[keypair]) {
    client = clientInstances[keypair]
  } else {
    client = await getClient(account)
    clientInstances[keypair] = client
  }
  return client
}

async function getBalance (keypair) {
  try {
    const client = await getClientFromKeys(keypair)
    const balance = await client.balance(keypair.publicKey).catch(_ => ({ balance: 0 }))
    return balance
  } catch (e) {
    return { error: e.message }
  }
}

async function spend (keypair, amount, to) {
  try {
    const client = await getClientFromKeys(keypair)
    const tx = await client.spend(amount, to, { denomination: AmountFormatter.AE_AMOUNT_FORMATS.AE })
    return tx
  } catch (e) {
    return { error: e.message }
  }
}

module.exports = {
  createKeyPair,
  getAccount,
  getClient,
  setClientFromKeys,
  getClientFromKeys,
  getBalance,
  spend
}
