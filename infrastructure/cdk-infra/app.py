#!/usr/bin/env python3
"""CDK app entry point: publish the Slidev decks listed in sessions/slidecks.yaml."""

import os
from pathlib import Path

import aws_cdk as cdk

from slide_decks.config import load_config
from slide_decks.site_stack import SlideDecksStack

# This file lives at <repo_root>/infrastructure/cdk-infra/app.py.
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
SESSIONS_DIR = REPO_ROOT / "sessions"

app = cdk.App()

config_path = Path(app.node.try_get_context("slidecksFile") or SESSIONS_DIR / "slidecks.yaml")
config = load_config(config_path, decks_root=SESSIONS_DIR)

SlideDecksStack(
    app,
    "SlideDecksStack",
    config=config,
    description="Private S3 bucket behind CloudFront serving the Slidev decks from slidecks.yaml",
    env=cdk.Environment(
        account=os.environ.get("CDK_DEFAULT_ACCOUNT"),
        region=os.environ.get("CDK_DEFAULT_REGION"),
    ),
)

app.synth()
