"""Business exceptions raised by ``services/`` and converted to HTTP in ``main``.

``services/`` never raises ``HTTPException``: the layer that decides *what went
wrong* is not the layer that decides *which status code says so*. The codes here
are the same lower snake_case as the front end's ``ServiceErrorCode``, so one
vocabulary crosses the wire.
"""


class ServiceError(Exception):
    """Base class for every failure a service is allowed to raise."""

    code: str = "unknown_error"
    status_code: int = 500

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class NotFoundError(ServiceError):
    code = "not_found"
    status_code = 404


class UnauthorizedError(ServiceError):
    code = "unauthorized"
    status_code = 401


class ValidationFailedError(ServiceError):
    code = "validation_failed"
    status_code = 422


class ConflictError(ServiceError):
    code = "conflict"
    status_code = 409
