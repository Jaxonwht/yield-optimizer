"""Compute the best allocation strategy."""
from typing import Iterable, Tuple

import cvxpy
import numpy
from application import app
from stats.quadratic_program import solve_quadratic_program
from stats.result import OptimizerResult
from stats.soc_program import solve_soc_problem


def optimize_ratios(stats: Iterable[Tuple[str, numpy.ndarray]], k: float) -> OptimizerResult:
    """
    Calculate the optimal pool allocation ratios in two steps. First this optimizer tries
    to calculate the allocation strategy that produces the minimum variance. Then, the optimizer
    imposes a variance restriction of at most k * the calculated minimum variance. With that constraint,
    the optimizer chooses the allocation strategy that maximizes expected value.
    """
    pool_names, apys = zip(*stats)
    apy_arr = numpy.array(apys)

    if len(apy_arr) == 1:
        return OptimizerResult(
            solver_status="trivial",
            maximum_yield=numpy.mean(apys),
            allocation_ratios=[(pool_names[0], 1)],
            estimated_standard_deviation=numpy.sqrt(numpy.var(apys, ddof=1)),
        )

    covariance_matrix: numpy.ndarray = numpy.cov(apy_arr)
    quadratic_problem_result = solve_quadratic_program(covariance_matrix)
    if quadratic_problem_result.solver_status != cvxpy.OPTIMAL:
        app.logger.warn("Failed to compute a minimum possible variance")
        return OptimizerResult(quadratic_problem_result.solver_status, 0.0, {}, 0.0)

    soc_problem_result = solve_soc_problem(apy_arr, covariance_matrix, quadratic_problem_result.minimum_value, k)

    solution_allocation = soc_problem_result.solution
    estimated_standard_deviation = numpy.sqrt(solution_allocation.T @ covariance_matrix @ solution_allocation)
    return OptimizerResult(
        soc_problem_result.solver_status,
        soc_problem_result.maximum_value,
        allocation_ratios=tuple(sorted(zip(pool_names, solution_allocation), key=lambda pair: pair[1], reverse=True)),
        estimated_standard_deviation=estimated_standard_deviation,
    )
