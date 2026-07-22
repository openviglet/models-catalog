"""Derived at-a-glance classification — the same logic the browsable page uses.

Purely derived from fields already published (no schema or contract change): a set of
use-case ``tags`` (from ``kind`` + ``capabilities`` + ``modalities``) and a price-bucketed
``tier`` (a market proxy for capability, **not** a benchmark or quality verdict). Optional
helper — consumers that want the page's categorization get it without re-implementing it.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import List, Optional

from .models import ModelEntry

#: Tier bands, highest first — the price-bucketed capability proxy :func:`classify` derives.
TIERS = ("Frontier", "High", "Mid", "Light")

_CODING_RE = re.compile(r"cod(e|er|ing)")


@dataclass
class Classification:
    """The derived classification :func:`classify` returns."""

    #: Use-case tags from kind + capabilities + modalities (+ ``"Open weights"``).
    tags: List[str]
    #: Price band, or ``None`` when the model carries no indicative price.
    tier: Optional[str]


def classify(entry: ModelEntry) -> Classification:
    """Derive use-case ``tags`` + a price ``tier`` for a model entry (see module docstring)."""
    caps = entry.capabilities or []
    in_mod = (entry.modalities or {}).get("input") or []
    hay = ("%s %s" % (entry.id or "", entry.label or "")).lower()
    tags: List[str] = []
    kind = entry.kind
    if kind == "EMBEDDING":
        tags.append("Embeddings")
    elif kind == "RERANK":
        tags.append("Reranking")
    elif kind == "IMAGE":
        tags.append("Image gen")
    elif kind == "SPEECH":
        tags.append("Speech")
    elif kind == "TRANSCRIPTION":
        tags.append("Transcription")
    elif kind == "VIDEO":
        tags.append("Video")
    elif kind == "MODERATION":
        tags.append("Moderation")
    else:  # CHAT / UNKNOWN
        if "reasoning" in caps:
            tags.append("Reasoning")
        if _CODING_RE.search(hay):
            tags.append("Coding")
        if "image" in in_mod or "vision" in caps:
            tags.append("Multimodal")
        if not tags:
            tags.append("Chat")
    # Open weights (a factual, discovery-relevant attribute) is surfaced as a tag too.
    if entry.open_weights is True:
        tags.append("Open weights")
    tier: Optional[str] = None
    inp = (entry.pricing or {}).get("inputPer1M")
    if inp is not None:
        tier = "Frontier" if inp >= 5 else "High" if inp >= 1 else "Mid" if inp >= 0.2 else "Light"
    return Classification(tags=tags, tier=tier)
