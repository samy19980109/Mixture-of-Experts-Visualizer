"""Tests for MoE model."""

import pytest
from app.models.moe_model import MoEModel, ExpertTracker


def test_expert_tracker():
    tracker = ExpertTracker()
    assert tracker.activation_history == []

    tracker.clear()
    assert tracker.activation_history == []


def test_moe_model_init():
    model = MoEModel()
    assert model.model_path == "mlx-community/OLMoE-1B-7B-0125-Instruct-4bit"
    assert model.model is None
    assert model.tokenizer is None
    assert not model._loaded


def test_model_info():
    model = MoEModel()
    info = model.get_model_info()

    assert info["name"] == "OLMoE-1B-7B-0125-Instruct-4bit"
    assert info["total_params"] == "7B"
    assert info["active_params"] == "1B"
    assert info["num_experts"] == 64
    assert info["experts_per_token"] == 8
