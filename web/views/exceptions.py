"""Define exceptions that can be thrown by our API routes."""


class APIInvalidRequestException(Exception):
    """
    An API exception that should return a 4xx error (400 by default) to the client
    """

    def __init__(self, message, status_code=400):
        Exception.__init__(self)
