import cvxpy
import numpy

from typing import Dict, NamedTuple, Tuple


class OptimizerResult(NamedTuple):
    """
    Data class for all the data and metadata of the solver results.
    """

    allocation_ratios: Dict[str, float]
    solver_status: str
    optimal_value: float


def optimize(stats: Dict[str, Tuple[float, float]], k) -> OptimizerResult:
    # sum of x_i = 1
    # x_i >= 0
    # sum of x_i^2 var_i <= k * min(var_i)
    # || x_i sqrt(var_i) ||_2 <= sqrt(k * min(var_i))
    # maximize sum of x_i mean_i
    # Similar to the second-order cone problem here https://www.cvxpy.org/examples/basic/socp.html
    means = []
    variances = []
    pool_names = []
    for pool_name, pool_stats in stats.items():
        mean, variance = pool_stats
        means.append(mean)
        variances.append(variance)
        pool_names.append(pool_name)
    length = len(stats)
    mean_arr = numpy.array(means)
    variance_arr = numpy.array(variances)
    x = cvxpy.Variable(length)
    soc_constraint = cvxpy.SOC(
        numpy.sqrt(k * min(variance_arr)), numpy.diag(numpy.sqrt(variance_arr)) @ x
    )
    prob = cvxpy.Problem(
        cvxpy.Maximize(mean_arr @ x), [soc_constraint, cvxpy.sum(x) == 1, x >= 0]
    )
    prob.solve()

    return OptimizerResult(
        {pool_names[i]: x.value[i] for i in range(length)}, prob.status, prob.value
    )
