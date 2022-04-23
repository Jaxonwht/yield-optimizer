from datetime import datetime, timezone
from typing import Iterable, List, Tuple

import numpy as np
import pandas as pd


def resample(pools_yields: Iterable[Tuple[str, List[datetime], List[float]]], resampling_interval: str) -> Iterable[Tuple[str, np.ndarray]]:
    """
    Resample and truncate yields of different pools to the same time interval, start time, and end
    time.
    """
    max_start_time = datetime.min.replace(tzinfo=timezone.utc)
    min_end_time = datetime.max.replace(tzinfo=timezone.utc)
    interpolated_dataframes = []
    for pool_name, timestamps, yields in pools_yields:
        df = pd.DataFrame({"timestamps": timestamps, "yields": yields})
        df = df.drop_duplicates(subset="timestamps")
        df = df.set_index("timestamps")
        df = df.resample(resampling_interval).fillna(method="nearest")
        first_timestamp, last_timestamp = df.index[0], df.index[-1]
        max_start_time, min_end_time = max(max_start_time, first_timestamp), min(min_end_time, last_timestamp)
        interpolated_dataframes.append((pool_name, df))

    for pool_name, df in interpolated_dataframes:
        yield pool_name, df[max_start_time:min_end_time]["yields"].values
