const Oid = require("mongodb").ObjectID
const { res_error } = require("./errors")

exports.gLst = db => (req, res) => {
  const filters = req.body.filters || {}
  db.collection(req.params.entity)
    .find(filters).toArray(
      (err, doc) => err ? res_error(res, 'SERVER_ERROR') : res.json(doc)
    )
}

exports.gGet = db => (req, res) => {
  const { _id } = req.query
  if(!_id) {
    return res_error(res, 'BAD_REQUEST', 'No _id to get')
  }

  db.collection(req.params.entity).findById(
    _id, {},
    (err, doc) => err ? res_error(res, 'SERVER_ERROR') : res.json(doc)
  )
}

exports.gDel = db => (req, res) => {
  const { _id } = req.query
  if(!_id) {
    return res_error(res, 'BAD_REQUEST', 'No _id to delete')
  }

  db.collection(req.params.entity).remove(
    {_id: Oid(_id)},
    (err, doc) => err ? res_error(res, 'SERVER_ERROR') : res.json(doc)
  )
}


exports.gPut = db => (req, res) => {
  const data = req.body
  if (!data) {
    return res_error(res, 'BAD_REQUEST', 'No data to put')
  }
  db.collection(req.params.entity).insert(
    data,
    (err, doc) => err ? res_error(res, 'SERVER_ERROR'): res.json(doc)
  )
}

exports.gUpd = db => async (req, res) => {
  const data = req.body
  if (!data || !('_id' in data)) {
    return res_error(res, 'BAD_REQUEST', 'No data or _id to update')
  }
  const updData = {...data}
  delete updData._id

  try {
    const doc = await db.collection(req.params.entity).updateOne(
      {'_id': Oid(data._id)},
      {$set: updData}
    )
    res.json(doc)
  } catch (err) {
    return res_error(res, 'SERVER_ERROR') 
  }
}
