class ApiError extends Error {
  message: string
  status: number
  constructor(status: number, message: string) {
    super()
    this.status = status
    this.message = message
  }

  static badRequest(message: string) {
    return new ApiError(404, message)
  }

  static internal(message: string) {
    return new ApiError(500, message)
  }

  static forbidden(message: string) {
    return new ApiError(403, message)
  }

  static unAuthorizedError() {
    return new ApiError(401, 'User is not authorized')
  }
}

export default ApiError
