"""Module for loading yaml configs"""
import os
from types import SimpleNamespace
from typing import Dict

import yaml
from utils.constants import ENCODING

try:
    from yaml import CLoader as Loader
except ImportError:
    from yaml import Loader  # type: ignore


class ConfigInitializeException(Exception):
    """Exceptions that occur when a config is initialized."""


class Config(SimpleNamespace):  # pylint: disable=too-few-public-methods
    """Actual class that reflects dictionaries into object attributes."""

    def __init__(self, data: Dict) -> None:
        for key, value in data.items():
            if isinstance(value, (list, tuple, frozenset)):
                setattr(self, key, tuple(Config(value_entry) for value_entry in value))
            elif isinstance(value, dict):
                setattr(self, key, Config(value))
            else:
                setattr(self, key, value)


def get_config() -> Config:
    """Get the config object from environment variable."""
    config_env = os.environ.get("CONFIG_ENV")
    if config_env is None:
        print("`CONFIG_ENV` is not defined, using `dev.yml` instead")
        config_env = "dev.yml"
    yaml_data = None
    with open(f"config/{config_env}", "r", encoding=ENCODING) as config_file:
        yaml_data = yaml.load(config_file, Loader=Loader)
    if yaml_data is None:
        raise ConfigInitializeException(f"config/{config_env} does not contain valid data")
    return Config(yaml_data)
