const Oid = require('mongodb').ObjectID
const md5 = require('MD5')
const { resError } = require('./errors')
const ethers = require('ethers')

exports.gLst = db => (req, res) => {
  const filters = req.body.filters || {}
  db.collection(req.params.entity)
    .find(filters)
    .toArray((err, doc) =>
      err ? resError(res, 'SERVER_ERROR') : res.json(doc)
    )
}

exports.gGet = db => (req, res) => {
  const { _id } = req.query

  db.collection(req.params.entity)
    .findOne({ _id: Oid(_id) },
      (err, usr) => {
        if (err || !_id) {
          return resError(res, 'BAD_REQUEST', 'No _id to get')
        }
        return res.json(usr)
      }
    )
}

exports.gDel = db => (req, res) => {
  const { _id } = req.query
  if (!_id) {
    return resError(res, 'BAD_REQUEST', 'No _id to delete')
  }

  db.collection(req.params.entity).remove({ _id: Oid(_id) }, (err, doc) =>
    err ? resError(res, 'SERVER_ERROR') : res.json(doc)
  )
}

exports.gPut = db => (req, res) => {
  const data = req.body
  if (!data) {
    return resError(res, 'BAD_REQUEST', 'No data to put')
  }
  db.collection(req.params.entity).insert(data, (err, doc) =>
    err ? resError(res, 'SERVER_ERROR') : res.json(doc)
  )
}

exports.gUpd = db => async (req, res) => {
  const data = req.body
  if (!data || !('_id' in data)) {
    return resError(res, 'BAD_REQUEST', 'No data or _id to update')
  }
  const updData = { ...data }
  delete updData._id

  try {
    const doc = await db
      .collection(req.params.entity)
      .updateOne({ _id: Oid(data._id) }, { $set: updData })
    res.json(doc)
  } catch (err) {
    return resError(res, 'SERVER_ERROR')
  }
}

exports.gUpdPassword = db => async (req, res) => {
  const data = req.body
  if (!data || !('_id' in data)) {
    return resError(res, 'BAD_REQUEST', 'No data or _id to update password')
  }

  const { _id, password } = data

  try {
    const doc = await db.collection(req.params.entity).updateOne(
      { _id: Oid(_id) },
      {
        $set: {
          password: md5(password)
        }
      }
    )
    res.json(doc)
  } catch (err) {
    return resError(res, 'SERVER_ERROR')
  }
}

exports.gCreateWallet = db => async (req, res) => {
  const data = req.body
  if (!data || !('_id' in data)) {
    return resError(res, 'BAD_REQUEST', 'No data or _id to create wallet')
  }

  const { _id } = data

  const wallet = ethers.Wallet.createRandom()

  try {
    const doc = await db.collection(req.params.entity).updateOne(
      { _id: Oid(_id) },
      {
        $set: {
          wallet: wallet
        }
      }
    )
    res.json(doc)
  } catch (err) {
    return resError(res, 'SERVER_ERROR')
  }
}
