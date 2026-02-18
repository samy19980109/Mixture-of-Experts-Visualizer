"""Memory tracking utilities."""

import psutil


def get_memory_usage() -> dict:
    """Get current memory usage statistics."""
    process = psutil.Process()
    memory_info = process.memory_info()
    system_memory = psutil.virtual_memory()

    return {
        "process_rss_mb": memory_info.rss / 1024 / 1024,
        "process_vms_mb": memory_info.vms / 1024 / 1024,
        "system_total_mb": system_memory.total / 1024 / 1024,
        "system_available_mb": system_memory.available / 1024 / 1024,
        "system_percent": system_memory.percent,
    }
