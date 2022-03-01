"""Periodic job to fetch beefy yields"""
import json
import queue
import threading
from typing import List

import requests
from flask import Flask
from init import db
from models.series_data import ApySeriesData, PoolInfo
from utils.config import APPLICATION_CONFIG

_fifo_queue: queue.SimpleQueue = queue.SimpleQueue()
_wait_event_obj: threading.Event = threading.Event()


def fetch_beefy_yield() -> None:
    """Fetch beefy api every second and put into queue."""
    while True:
        response = requests.get(APPLICATION_CONFIG.yield_endpoint.beefy)
        if response.status_code == requests.codes.OK:  # pylint: disable=no-member
            _fifo_queue.put(response.content)
        _wait_event_obj.wait(APPLICATION_CONFIG.apy_api_worker.fetch_interval_seconds)


def insert_yields(app: Flask) -> None:
    """Insert beefy api into database."""
    while True:
        rough_size = _fifo_queue.qsize()
        raw_contents: List[bytes] = []
        for _ in range(rough_size):
            try:
                raw_contents.append(_fifo_queue.get_nowait())
            except queue.Empty:
                break
        with app.app_context():
            for raw_content in raw_contents:
                content_dict = json.loads(raw_content)
                for pool_name, apy in content_dict.items():
                    if apy is None or pool_name is None:
                        continue
                    corresponding_pool_info = db.session.get(PoolInfo, pool_name)
                    if corresponding_pool_info is None:
                        corresponding_pool_info = PoolInfo(pool_name=pool_name)
                    db.session.add(
                        ApySeriesData(
                            pool_info=corresponding_pool_info,
                            pool_yield=apy,
                        )
                    )
            db.session.commit()
        _wait_event_obj.wait(APPLICATION_CONFIG.apy_api_worker.insert_interval_seconds)


def start_beefy_apy_workers(app: Flask) -> None:
    """Start fetch threads and insert threads."""
    fetch_thread = threading.Thread(target=fetch_beefy_yield, daemon=True)
    insert_thread = threading.Thread(target=insert_yields, args=(app,), daemon=True)
    fetch_thread.start()
    insert_thread.start()
