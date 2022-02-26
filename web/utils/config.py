"""Module for loading yaml configs"""
import os
from types import SimpleNamespace
from typing import Dict

import yaml
from utils.constants import ENCODING
from utils.dict_merge import merge_dicts_recursively

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
            if isinstance(value, (list, tuple)):
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
    with open("config/base.yml", "r", encoding=ENCODING) as base_config_file:
        base_data = yaml.load(base_config_file, Loader=Loader)
    with open(f"config/{config_env}", "r", encoding=ENCODING) as config_file:
        extra_data = yaml.load(config_file, Loader=Loader)
    yaml_data = merge_dicts_recursively(False, base_data, extra_data)
    if yaml_data is None:
        raise ConfigInitializeException(f"config/{config_env} does not contain valid data")
    return Config(yaml_data)
