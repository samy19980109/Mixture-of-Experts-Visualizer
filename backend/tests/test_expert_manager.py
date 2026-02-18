"""Tests for expert manager."""

import pytest
from app.models.expert_manager import ExpertManager


class MockModel:
    pass


def test_expert_manager_init():
    model = MockModel()
    manager = ExpertManager(model)

    assert manager.model == model
    assert manager.swap_history == []
    assert manager.expert_stats == {}


def test_get_expert_info():
    model = MockModel()
    manager = ExpertManager(model)

    info = manager.get_expert_info(0)
    assert info["expert_id"] == 0
    assert info["activation_count"] == 0
    assert info["status"] == "active"


def test_get_all_experts():
    model = MockModel()
    manager = ExpertManager(model)

    experts = manager.get_all_experts()
    assert len(experts) == 64

    for i, expert in enumerate(experts):
        assert expert["expert_id"] == i
