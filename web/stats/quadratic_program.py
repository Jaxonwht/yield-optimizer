"""Quadratic problem solver."""
import cvxpy
import numpy

from stats.result import QuadraticProgramResult


_SALT_STANDARD_DEVIATION = 1e-5


def solve_quadratic_program(covariance_matrix: numpy.ndarray) -> QuadraticProgramResult:
    """
    Solve the following problem.

    Minimize x^T covariance_matrix x
    Subject to
        1^T x = 1
        x >= 0

    Here, covariance_matrix is the covariance matrix of the rows of series_data. Each row of series_data represents
    a series sampling a random variable. For more information, see https://www.cvxpy.org/examples/basic/quadratic_program.html.
    """
    length = len(covariance_matrix)
    ratios = cvxpy.Variable(length)
    if numpy.linalg.matrix_rank(covariance_matrix) != length:
        # Singular matrices will return zero minimum x^T covariance_matrix x, not desired.
        # Add salt to the matrix.
        salt_matrix = numpy.random.normal(0, _SALT_STANDARD_DEVIATION, (length, length))
        salt_psd_matrix = salt_matrix @ salt_matrix.T
        covariance_matrix += salt_psd_matrix
    minimize_expression = cvxpy.Minimize(cvxpy.quad_form(ratios, covariance_matrix))
    constraints = [cvxpy.sum(ratios) == 1, ratios >= 0]
    prob = cvxpy.Problem(minimize_expression, constraints)
    prob.solve()

    return QuadraticProgramResult(prob.status, prob.value)
