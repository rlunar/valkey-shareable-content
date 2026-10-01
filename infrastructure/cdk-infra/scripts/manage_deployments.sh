#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CDK_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$CDK_DIR/../.." && pwd)"
CONFIG_FILE="$REPO_ROOT/sessions/slidecks.yaml"
STACK_NAME="SlideDecksStack"
VENV_DIR="$CDK_DIR/.venv"
PYTHON_BIN="$VENV_DIR/bin/python"

AWS_PROFILE_NAME=""
ACCOUNT_ID=""
CALLER_ARN=""
AWS_REGION_NAME=""
TARGET_CLASS=""
CDK_RUNNER=""

plain_error() {
    printf 'error: %s\n' "$*" >&2
}

require_gum() {
    if ! command -v gum >/dev/null 2>&1; then
        plain_error "gum is required. On macOS, install it with: brew install gum"
        exit 1
    fi
}

show_error() {
    gum style --foreground 196 --bold "Error: $*" >&2
}

show_info() {
    gum style --foreground 39 "$*"
}

show_warning() {
    gum style --foreground 214 --bold "$*"
}

show_success() {
    gum style --foreground 42 --bold "$*"
}

require_command() {
    local command_name="$1"
    local install_hint="$2"

    if ! command -v "$command_name" >/dev/null 2>&1; then
        show_error "$command_name is required. $install_hint"
        return 1
    fi
}

on_error() {
    local exit_code=$?
    plain_error "deployment manager stopped after a command failed (exit $exit_code)"
    exit "$exit_code"
}

trap on_error ERR

pause_for_menu() {
    printf '\n'
    gum input --prompt "Press Enter to return to the menu " >/dev/null
}

show_header() {
    clear
    gum style \
        --border rounded \
        --border-foreground 212 \
        --foreground 212 \
        --bold \
        --padding "1 3" \
        "Valkey slide decks" "CDK deployment manager"

    if [[ -n "$ACCOUNT_ID" ]]; then
        gum style --foreground 245 \
            "Target: ${AWS_PROFILE_NAME:-default credentials} | $ACCOUNT_ID | $AWS_REGION_NAME | $TARGET_CLASS"
    else
        gum style --foreground 245 "Target: not selected"
    fi
    printf '\n'
}

aws_cli() {
    if [[ -n "$AWS_PROFILE_NAME" ]]; then
        aws "$@" --profile "$AWS_PROFILE_NAME"
    else
        aws "$@"
    fi
}

classify_target() {
    local target_text
    target_text="$(printf '%s' "$AWS_PROFILE_NAME $CALLER_ARN" | tr '[:upper:]' '[:lower:]')"

    if [[ "$target_text" =~ (dev|test|beta|alpha|staging|sandbox) ]]; then
        TARGET_CLASS="NON-PRODUCTION"
    else
        TARGET_CLASS="PRODUCTION OR UNKNOWN"
    fi
}

read_identity() {
    local identity
    if ! identity="$(aws_cli sts get-caller-identity --query '[Account,Arn]' --output text)"; then
        show_error "Unable to read the AWS caller identity. Check your credentials and profile."
        return 1
    fi

    read -r ACCOUNT_ID CALLER_ARN <<<"$identity"
    if [[ -z "$ACCOUNT_ID" || "$ACCOUNT_ID" == "None" || -z "$CALLER_ARN" || "$CALLER_ARN" == "None" ]]; then
        show_error "AWS returned an incomplete caller identity."
        return 1
    fi
}

resolve_region() {
    local configured_region=""

    if [[ -n "$AWS_PROFILE_NAME" ]]; then
        configured_region="$(aws configure get region --profile "$AWS_PROFILE_NAME" 2>/dev/null || true)"
    else
        configured_region="$(aws configure get region 2>/dev/null || true)"
    fi

    AWS_REGION_NAME="${AWS_REGION:-${AWS_DEFAULT_REGION:-$configured_region}}"
    if [[ -z "$AWS_REGION_NAME" ]]; then
        AWS_REGION_NAME="$(gum input --header "AWS region" --placeholder "for example, us-east-1")"
    fi

    if [[ -z "$AWS_REGION_NAME" ]]; then
        show_error "An AWS region is required."
        return 1
    fi
}

show_target() {
    local color=42
    if [[ "$TARGET_CLASS" == "PRODUCTION OR UNKNOWN" ]]; then
        color=214
    fi

    gum style --border rounded --border-foreground "$color" --padding "0 2" \
        "AWS target" \
        "Profile: ${AWS_PROFILE_NAME:-default credential chain}" \
        "Account: $ACCOUNT_ID" \
        "Region:  $AWS_REGION_NAME" \
        "Caller:  $CALLER_ARN" \
        "Class:   $TARGET_CLASS"
}

select_target() {
    local default_label="Use the default AWS credential chain"
    local selected_profile
    local profiles=()

    require_command aws "Install and configure the AWS CLI." || return 1

    profiles+=("$default_label")
    while IFS= read -r profile; do
        if [[ -n "$profile" ]]; then
            profiles+=("$profile")
        fi
    done < <(aws configure list-profiles 2>/dev/null || true)

    selected_profile="$(printf '%s\n' "${profiles[@]}" | gum choose --header "Select an AWS credential source")"
    if [[ "$selected_profile" == "$default_label" ]]; then
        AWS_PROFILE_NAME=""
    else
        AWS_PROFILE_NAME="$selected_profile"
    fi

    ACCOUNT_ID=""
    CALLER_ARN=""
    AWS_REGION_NAME=""

    read_identity || return 1
    resolve_region || return 1
    classify_target
    show_target
}

verify_target() {
    local expected_account="$ACCOUNT_ID"
    local expected_arn="$CALLER_ARN"

    if [[ -z "$ACCOUNT_ID" ]]; then
        select_target || return 1
        return 0
    fi

    read_identity || return 1
    if [[ "$ACCOUNT_ID" != "$expected_account" || "$CALLER_ARN" != "$expected_arn" ]]; then
        show_error "AWS identity changed after target selection. Select the target again."
        ACCOUNT_ID=""
        CALLER_ARN=""
        AWS_REGION_NAME=""
        TARGET_CLASS=""
        return 1
    fi

    classify_target
}

resolve_cdk_runner() {
    if [[ -n "$CDK_RUNNER" ]]; then
        return 0
    fi

    if command -v cdk >/dev/null 2>&1; then
        CDK_RUNNER="cdk"
        return 0
    fi

    if command -v npx >/dev/null 2>&1; then
        show_warning "The CDK CLI is not installed globally."
        if gum confirm "Use npx aws-cdk for this session?"; then
            CDK_RUNNER="npx"
            return 0
        fi
    fi

    show_error "AWS CDK CLI is required. Install it with: npm install -g aws-cdk"
    return 1
}

invoke_cdk() {
    local action="$1"
    shift

    resolve_cdk_runner || return 1
    show_info "Running CDK $action in $CDK_DIR"

    (
        cd "$CDK_DIR"
        export PATH="$VENV_DIR/bin:$PATH"
        export VIRTUAL_ENV="$VENV_DIR"
        export CDK_DEFAULT_ACCOUNT="$ACCOUNT_ID"
        export CDK_DEFAULT_REGION="$AWS_REGION_NAME"
        export AWS_REGION="$AWS_REGION_NAME"
        export AWS_DEFAULT_REGION="$AWS_REGION_NAME"

        if [[ "$CDK_RUNNER" == "npx" ]]; then
            if [[ -n "$AWS_PROFILE_NAME" ]]; then
                npx aws-cdk "$action" "$@" --profile "$AWS_PROFILE_NAME"
            else
                npx aws-cdk "$action" "$@"
            fi
        elif [[ -n "$AWS_PROFILE_NAME" ]]; then
            cdk "$action" "$@" --profile "$AWS_PROFILE_NAME"
        else
            cdk "$action" "$@"
        fi
    )
}

check_node_version() {
    require_command node "Install Node.js 20.19 or newer." || return 1
    if ! node -e 'const [major, minor] = process.versions.node.split(".").map(Number); process.exit(major > 20 || (major === 20 && minor >= 19) ? 0 : 1)'; then
        show_error "Node.js 20.19 or newer is required; found $(node --version)."
        return 1
    fi
}

setup_environment() {
    local method

    show_header
    method="$(gum choose --header "Set up the Python environment" \
        "uv sync (pyproject.toml + uv.lock)" \
        "venv + pip (requirements.txt)")"

    case "$method" in
        "uv sync (pyproject.toml + uv.lock)")
            require_command uv "Install it on macOS with: brew install uv" || return 1
            show_info "Synchronizing the locked Python environment..."
            (cd "$CDK_DIR" && uv sync)
            ;;
        "venv + pip (requirements.txt)")
            require_command python3 "Install Python 3.11 or newer." || return 1
            if ! python3 -c 'import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)'; then
                show_error "Python 3.11 or newer is required; found $(python3 --version)."
                return 1
            fi
            show_info "Creating the virtual environment and installing requirements..."
            python3 -m venv "$VENV_DIR"
            "$PYTHON_BIN" -m pip install -r "$CDK_DIR/requirements.txt"
            ;;
    esac

    if ! "$PYTHON_BIN" -c 'import aws_cdk, yaml' >/dev/null 2>&1; then
        show_error "The virtual environment is missing required CDK dependencies."
        return 1
    fi

    show_success "Python environment is ready."
}

ensure_python_environment() {
    if [[ -x "$PYTHON_BIN" ]] && "$PYTHON_BIN" -c 'import aws_cdk, yaml' >/dev/null 2>&1; then
        return 0
    fi

    show_warning "The CDK Python environment is not ready."
    if gum confirm "Set it up now?"; then
        setup_environment
        return $?
    fi

    return 1
}

read_deck_names() {
    "$PYTHON_BIN" - "$CONFIG_FILE" <<'PY'
import sys
from pathlib import Path

import yaml

config = yaml.safe_load(Path(sys.argv[1]).read_text())
for deck in config.get("decks", []):
    print(deck["name"])
PY
}

run_deck_build() {
    local selection_mode="$1"
    local skip_install="false"
    local selection=""
    local deck
    local deck_names=()
    local selected_decks=()
    local command=("$PYTHON_BIN" "scripts/build_decks.py")

    ensure_python_environment || return 1
    check_node_version || return 1
    require_command pnpm "Install pnpm, then retry." || return 1

    if [[ "$selection_mode" == "choose" ]]; then
        while IFS= read -r deck; do
            if [[ -n "$deck" ]]; then
                deck_names+=("$deck")
            fi
        done < <(read_deck_names)

        selection="$(printf '%s\n' "${deck_names[@]}" | gum choose --no-limit --header "Select decks (space toggles, enter confirms)")"
        while IFS= read -r deck; do
            if [[ -n "$deck" ]]; then
                selected_decks+=("$deck")
            fi
        done <<<"$selection"

        if [[ ${#selected_decks[@]} -eq 0 ]]; then
            show_warning "No decks selected; build cancelled."
            return 0
        fi
        command+=("${selected_decks[@]}")
    fi

    if gum confirm "Skip pnpm install and reuse existing node_modules?"; then
        skip_install="true"
        command+=("--skip-install")
    fi

    if [[ "$selection_mode" == "all" ]]; then
        show_info "Building every deck from slidecks.yaml (skip install: $skip_install)..."
    else
        show_info "Building ${#selected_decks[@]} selected deck(s) (skip install: $skip_install)..."
    fi

    (cd "$CDK_DIR" && "${command[@]}")
    show_success "Deck build completed."
}

build_menu() {
    local mode

    show_header
    mode="$(gum choose --header "Build decks" \
        "Build every deck (recommended before deployment)" \
        "Select one or more decks")"

    if [[ "$mode" == "Build every deck (recommended before deployment)" ]]; then
        run_deck_build all
    else
        run_deck_build choose
    fi
}

synth_stack() {
    show_header
    ensure_python_environment || return 1
    verify_target || return 1
    show_target
    invoke_cdk synth "$STACK_NAME"
    show_success "Synthesis completed."
}

diff_stack() {
    show_header
    ensure_python_environment || return 1
    verify_target || return 1
    show_target
    invoke_cdk diff "$STACK_NAME"
}

confirm_deployment() {
    local typed_account

    show_warning "Deployment updates the stack and uploads every configured deck."
    gum style --foreground 245 \
        "The CloudFront site is publicly reachable by URL." \
        "Stale files inside configured deck prefixes are pruned." \
        "The deployment invalidates the entire distribution (/*)." \
        "CDK's own security-change approval prompt remains enabled."
    show_target

    if [[ "$TARGET_CLASS" == "PRODUCTION OR UNKNOWN" ]]; then
        typed_account="$(gum input --header "Type AWS account $ACCOUNT_ID to authorize this deployment")"
        if [[ "$typed_account" != "$ACCOUNT_ID" ]]; then
            show_warning "Account did not match; deployment cancelled."
            return 1
        fi
    elif ! gum confirm "Deploy $STACK_NAME to account $ACCOUNT_ID?"; then
        show_warning "Deployment cancelled."
        return 1
    fi
}

deploy_stack() {
    show_header
    ensure_python_environment || return 1
    check_node_version || return 1
    require_command pnpm "Install pnpm, then retry." || return 1
    verify_target || return 1
    show_target

    gum style --foreground 245 \
        "Guided deployment:" \
        "1. Build every deck" \
        "2. Synthesize $STACK_NAME" \
        "3. Show the CDK diff" \
        "4. Confirm the target" \
        "5. Deploy"
    printf '\n'

    run_deck_build all
    verify_target || return 1
    invoke_cdk synth "$STACK_NAME"
    verify_target || return 1
    invoke_cdk diff "$STACK_NAME"

    if ! confirm_deployment; then
        return 0
    fi

    verify_target || return 1
    invoke_cdk deploy "$STACK_NAME"
    show_success "Deployment completed. CDK outputs above contain the site and deck URLs."
}

bootstrap_environment() {
    local typed_account

    show_header
    verify_target || return 1
    show_target
    show_warning "Bootstrap creates or updates CDK support resources and IAM roles in this account and region."
    typed_account="$(gum input --header "Type AWS account $ACCOUNT_ID to authorize bootstrap")"
    if [[ "$typed_account" != "$ACCOUNT_ID" ]]; then
        show_warning "Account did not match; bootstrap cancelled."
        return 0
    fi

    verify_target || return 1
    invoke_cdk bootstrap "aws://$ACCOUNT_ID/$AWS_REGION_NAME"
    show_success "CDK environment bootstrap completed."
}

destroy_stack() {
    local expected_confirmation
    local typed_confirmation

    show_header
    ensure_python_environment || return 1
    verify_target || return 1
    show_target

    expected_confirmation="$STACK_NAME@$ACCOUNT_ID"
    gum style --border double --border-foreground 196 --foreground 196 --bold --padding "1 2" \
        "DESTRUCTIVE ACTION" \
        "Destroying this stack removes the public CloudFront site." \
        "The deployment bucket is unversioned and will be emptied and deleted." \
        "Deployed content cannot be recovered from AWS. Local Git sources remain."

    typed_confirmation="$(gum input --header "Type $expected_confirmation to continue")"
    if [[ "$typed_confirmation" != "$expected_confirmation" ]]; then
        show_warning "Confirmation did not match; destroy cancelled."
        return 0
    fi

    if ! gum confirm "Permanently destroy $STACK_NAME now?"; then
        show_warning "Destroy cancelled."
        return 0
    fi

    verify_target || return 1
    invoke_cdk destroy "$STACK_NAME"
    show_success "Stack destruction command completed."
}

main_menu() {
    local choice

    while true; do
        show_header
        choice="$(gum choose --cursor.foreground 212 --header "Choose an action" \
            "Set up Python environment" \
            "Build decks" \
            "Synthesize stack" \
            "Show deployment diff" \
            "Deploy (build all, synth, diff, confirm)" \
            "Bootstrap AWS environment" \
            "Change AWS target" \
            "Destroy stack" \
            "Exit")"

        case "$choice" in
            "Set up Python environment")
                setup_environment
                pause_for_menu
                ;;
            "Build decks")
                build_menu
                pause_for_menu
                ;;
            "Synthesize stack")
                synth_stack
                pause_for_menu
                ;;
            "Show deployment diff")
                diff_stack
                pause_for_menu
                ;;
            "Deploy (build all, synth, diff, confirm)")
                deploy_stack
                pause_for_menu
                ;;
            "Bootstrap AWS environment")
                bootstrap_environment
                pause_for_menu
                ;;
            "Change AWS target")
                show_header
                select_target
                pause_for_menu
                ;;
            "Destroy stack")
                destroy_stack
                pause_for_menu
                ;;
            "Exit")
                show_success "No changes were made by exiting the manager."
                return 0
                ;;
        esac
    done
}

require_gum
main_menu
