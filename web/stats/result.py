"""Data classes for various statistics results."""
import numpy
from typing import Iterable, NamedTuple, Tuple


class OptimizerResult(NamedTuple):
    """
    Data class for all the data and metadata of the solver results.
    """

    solver_status: str
    maximum_yield: float
    allocation_ratios: Iterable[Tuple[str, float]]
    estimated_standard_deviation: float


class QuadraticProgramResult(NamedTuple):
    """
    Data class for the quadratic program problem that determines the minimum variance
    of a weighted sum of several normally distributed variables.
    """

    solver_status: str
    minimum_value: float


class SecondOrderConeProgramResult(NamedTuple):
    """
    Data class for the second-order cone programming result that determines the maximum
    affine value with a quadratic constraint.
    """

    solver_status: str
    maximum_value: float
    solution: numpy.ndarray
