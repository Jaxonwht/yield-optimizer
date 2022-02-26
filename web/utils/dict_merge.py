"""Module for merging dictionaries recursively"""
from copy import deepcopy
from typing import Dict, Optional


def merge_dicts_recursively(concatenate_list_value: bool, *dicts: Optional[Dict]) -> Optional[Dict]:
    """
    Merge an iterable of dicts together recursively. Dictionaries that come later
    will take precedence just like javascript. This function returns None if no dictionary
    is passed in. Dictionaries that are None will be ignored.

    When concatenate_list_value is True, list and tuple values will be concatenated rather than replaced.
    """
    result_dict: Dict = {}
    for dict_to_merge in dicts:
        if dict_to_merge is None:
            continue
        if result_dict is None:
            result_dict = deepcopy(dict_to_merge)
        else:
            for key, value in dict_to_merge.items():
                if isinstance(value, (tuple, list)):
                    if concatenate_list_value:
                        result_dict[key] = result_dict[key] + deepcopy(value)
                    else:
                        result_dict[key] = deepcopy(value)
                elif isinstance(value, dict):
                    if key not in result_dict:
                        result_dict[key] = deepcopy(value)
                    else:
                        result_dict[key] = merge_dicts_recursively(concatenate_list_value, result_dict[key], value)
                else:
                    result_dict[key] = value
    return result_dict
