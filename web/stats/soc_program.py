"""Solve the second-order cone program to calculate the maximum yield."""
import cvxpy
import numpy

from stats.result import SecondOrderConeProgramResult


def solve_soc_problem(
    series_data: numpy.ndarray, covariance_matrix: numpy.ndarray, minimum_constraint_value: float, k: float
) -> SecondOrderConeProgramResult:
    """
    Solve the following problem.

    Maximize mean(x^T series_data)
    Subject to
        sum(x) = 1
        x >= 0
        x^T covariance_matrix x <= k * minimum_variance

    In the problem, covariance_matrix is the covariance matrix of series_data. For more information,
    see https://www.cvxpy.org/examples/basic/socp.html.

    This quadratic constraint needs to be converted to second-order cone. Fortunately,
    it's easy because P is positive semi-definite. We can decompose P to LL^T.
    Then x^T P x = x^T L L^T x = || L^T x ||_2^2.
    || L^T x||_2 <= sqrt(k * minimum_variance) is a second-order cone constraint.
    """
    length = len(series_data)
    points_per_variable = len(series_data[0])
    ratios = cvxpy.Variable(length)
    lower_triangle = numpy.linalg.cholesky(covariance_matrix)
    maximize_expression = cvxpy.sum(ratios.T @ series_data) / points_per_variable
    soc_constraint = cvxpy.SOC(numpy.sqrt(k * minimum_constraint_value), lower_triangle.T @ ratios)
    prob = cvxpy.Problem(maximize_expression, [soc_constraint, cvxpy.sum(ratios) == 1, ratios >= 0])
    prob.solve()
    return SecondOrderConeProgramResult(
        solver_status=prob.status,
        maximum_value=prob.value,
        solution=ratios.value,
    )
