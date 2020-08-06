const Oid = require("mongodb").ObjectID

exports.gLst = db => (req, res, next) => {
  const filters = req.body.filters || {}
  db.collection(req.params.entity)
    .find(filters).toArray(
      (err, doc) => err ? next({error: 'SERVER_ERROR'}) : res.json(doc)
    )
}

exports.gGet = db => (req, res, next) => {
  const { _id } = req.query
  if(!_id) {
    return next({error: 'BAD_REQUEST', message: 'No _id to get'})
  }

  db.collection(req.params.entity).findById(
    _id, {},
    (err, doc) => err ? next({error: 'SERVER_ERROR'}) : res.json(doc)
  )
}

exports.gDel = db => (req, res, next) => {
  const { _id } = req.query
  if(!_id) {
    return next({error: 'BAD_REQUEST', message: 'No _id to delete'})
  }

  db.collection(req.params.entity).remove(
    {_id: Oid(_id)},
    (err, doc) => err ? next({error: 'SERVER_ERROR'}) : res.json(doc)
  )
}


exports.gPut = db => (req, res, next) => {
  const data = req.body
  if (!data) {
    return next({error: 'BAD_REQUEST', message: 'No data to put'})
  }
  db.collection(req.params.entity).insert(
    data,
    (err, doc) => err ? next({error: 'SERVER_ERROR'}): res.json(doc)
  )
}

exports.gUpd = db => async (req, res, next) => {
  const data = req.body
  if (!data || !('_id' in data)) {
    return next({error: 'BAD_REQUEST', message: 'No data or _id to update'})
  }
  const updData = JSON.parse(JSON.stringify(data))
  delete updData._id

  try {
    const doc = await db.collection(req.params.entity).updateOne(
      {'_id': Oid(data._id)},
      {$set: updData}
    )
    res.json(doc)
  } catch (err) {
    return next({error: 'SERVER_ERROR'}) 
  }
}
