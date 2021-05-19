const errors = {
  BAD_REQUEST: {
    error: {
      code: 400,
      domain: 'global',
      reason: 'badRequest',
      message: 'Bad Request'
    }
  },
  INVALID_CREDENTIALS: {
    error: {
      code: 401,
      domain: 'global',
      reason: 'authError',
      message: 'Invalid Credentials',
      locationType: 'header',
      location: 'Authorization'
    }
  },
  NOT_AUTHORIZED: {

    error: {
      code: 403,
      domain: 'global',
      reason: 'appNotAuthorizedToFile',
      message: 'The user has not granted access to the file.'
    }
  },
  NOT_FOUND: {
    error: {
      code: 404,
      domain: 'global',
      reason: 'notFound',
      message: 'File not found'
    }
  },
  UNPROCESSABLE_ENTITY: {
    error: {
      code: 422,
      domain: 'global',
      reason: 'unprocessableEntity',
      message: 'Unprocessable Entity for validations'
    }
  },
  SERVER_ERROR: {
    error: {
      code: 500,
      domain: 'global',
      reason: 'backendError',
      message: 'Backend Error'
    }
  }
}

const resError = (res, type, message) => {
  const { error } = errors[type]
  if (message) error.message = message
  return res.status(error.code).json(error)
}

module.exports = { errors, resError }

