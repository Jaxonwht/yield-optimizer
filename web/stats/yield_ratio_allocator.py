"""Compute the best allocation strategy."""
import cvxpy
import numpy

from typing import Iterable, List, Tuple
from stats.quadratic_program import solve_quadratic_program
from stats.result import OptimizerResult
from stats.soc_program import solve_soc_problem


def optimize_ratios(stats: Iterable[Tuple[str, List[float]]], k: float, minimum_apy_count: int) -> OptimizerResult:
    """
    Calculate the optimal pool allocation ratios in two steps. First this optimizer tries
    to calculate the allocation strategy that produces the minimum variance. Then, the optimizer
    imposes a variance restriction of at most k * the calculated minimum variance. With that constraint,
    the optimizer chooses the allocation strategy that maximizes expected value.
    """
    pool_names: List[str] = []
    apys: List[List[float]] = []
    shortest_apy_length = None
    for pool_name, apys_for_pool in stats:
        if len(apys_for_pool) < minimum_apy_count:
            continue
        pool_names.append(pool_name)
        apys.append(apys_for_pool[:shortest_apy_length])
        if shortest_apy_length is None:
            shortest_apy_length = apys_for_pool
        else:
            shortest_apy_length = min(shortest_apy_length, len(apys_for_pool))

    # Trim extra elements
    apy_arr: numpy.ndarray = numpy.array([apys_for_pool[:shortest_apy_length] for apys_for_pool in apys])
    covariance_matrix: numpy.ndarray = numpy.cov(apy_arr)
    quadratic_problem_result = solve_quadratic_program(covariance_matrix)
    if quadratic_problem_result.solver_status != cvxpy.OPTIMAL:
        print("Failed to compute a minimum possible variance")
        return OptimizerResult(quadratic_problem_result.solver_status, 0.0, {})

    soc_problem_result = solve_soc_problem(apy_arr, covariance_matrix, quadratic_problem_result.minimum_value, k)
    return OptimizerResult(
        soc_problem_result.solver_status,
        soc_problem_result.maximum_value,
        allocation_ratios=tuple(zip(pool_names, soc_problem_result.solution)),
    )
