"""Periodic job to fetch beefy yields"""
import datetime
import json
import queue
import threading
from typing import List, Tuple

import requests
from flask import Flask
from init import db
from models.series_data import ApySeriesData, PoolInfo
from utils.config import APPLICATION_CONFIG


def fetch_beefy_yield(fifo_queue: queue.SimpleQueue, wait_event_obj: threading.Event) -> None:
    """Fetch beefy api every second and put into queue."""
    while True:
        try:
            response = requests.get(APPLICATION_CONFIG.yield_endpoint.beefy)
            if response.status_code == requests.codes.OK:  # pylint: disable=no-member
                fifo_queue.put((response.content, datetime.datetime.now(datetime.timezone.utc)))
        except Exception as e:
            print(e)
        wait_event_obj.wait(APPLICATION_CONFIG.apy_api_worker.fetch_interval_seconds)


def insert_yields(app: Flask, fifo_queue: queue.SimpleQueue, wait_event_obj: threading.Event) -> None:
    """Insert beefy api into database."""
    while True:
        try:
            rough_size = fifo_queue.qsize()
            raw_contents: List[Tuple[bytes, datetime.datetime]] = []
            for _ in range(rough_size):
                try:
                    raw_contents.append(fifo_queue.get_nowait())
                except queue.Empty:
                    break
            with app.app_context():
                for raw_content, fetch_timestamp in raw_contents:
                    content_dict = json.loads(raw_content)
                    with db.session.no_autoflush:
                        for pool_name, apy in content_dict.items():
                            if apy is None or pool_name is None:
                                continue
                            corresponding_pool_info = db.session.get(PoolInfo, pool_name)
                            if corresponding_pool_info is None:
                                corresponding_pool_info = PoolInfo(pool_name=pool_name)
                            db.session.add(
                                ApySeriesData(
                                    created_at=fetch_timestamp,
                                    pool_info=corresponding_pool_info,
                                    pool_yield=apy,
                                )
                            )
                            db.session.flush()
                db.session.commit()
        except Exception as e:
            print(e)
        wait_event_obj.wait(APPLICATION_CONFIG.apy_api_worker.insert_interval_seconds)


def start_beefy_apy_workers(app: Flask) -> None:
    """Start fetch threads and insert threads."""
    fifo_queue: queue.SimpleQueue = queue.SimpleQueue()
    fetch_wait_event_obj: threading.Event = threading.Event()
    insert_wait_event_obj: threading.Event = threading.Event()

    fetch_thread = threading.Thread(target=fetch_beefy_yield, args=(fifo_queue, fetch_wait_event_obj), daemon=True)
    insert_thread = threading.Thread(target=insert_yields, args=(app, fifo_queue, insert_wait_event_obj), daemon=True)
    fetch_thread.start()
    insert_thread.start()
