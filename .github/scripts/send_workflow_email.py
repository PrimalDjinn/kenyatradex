import os
import smtplib
import ssl
from email.message import EmailMessage
from pathlib import Path


MAX_FAILURE_LOG_CHARS = 12000


def _split_recipients(value):
    recipients = []
    for part in (value or "").replace(";", ",").replace(" ", ",").split(","):
        recipient = part.strip()
        if recipient and "@" in recipient:
            recipients.append(recipient)
    return recipients


def _dedupe(values):
    seen = set()
    result = []
    for value in values:
        key = value.lower()
        if key not in seen:
            seen.add(key)
            result.append(value)
    return result


def _humanize_log_name(path):
    return path.stem.replace("-", " ").replace("_", " ").title()


def _tail_text(value, limit):
    if len(value) <= limit:
        return value
    return f"[truncated to last {limit:,} characters]\n{value[-limit:]}"


def _failure_output():
    raw_log_dir = os.environ.get("FAILURE_LOG_DIR", "").strip()
    if not raw_log_dir:
        return ""

    log_dir = Path(raw_log_dir)
    if not log_dir.is_dir():
        return ""

    sections = []
    for log_path in sorted(log_dir.glob("*.log")):
        try:
            content = log_path.read_text(encoding="utf-8", errors="replace").strip()
        except OSError as exc:
            content = f"Could not read {log_path.name}: {exc}"

        if not content:
            continue

        sections.append(
            "\n".join(
                [
                    f"--- {_humanize_log_name(log_path)} ---",
                    _tail_text(content, MAX_FAILURE_LOG_CHARS),
                ]
            )
        )

    if not sections:
        return ""

    return "\n\nFailure output:\n" + "\n\n".join(sections)


smtp_host = os.environ.get("SMTP_HOST", "").strip()
if not smtp_host:
    print("SMTP_HOST is not set; skipping email notification.")
    raise SystemExit(0)

smtp_port = int(os.environ.get("SMTP_PORT") or "587")
smtp_username = os.environ.get("SMTP_USERNAME", "")
smtp_password = os.environ.get("SMTP_PASSWORD", "")
smtp_from = os.environ.get("SMTP_FROM") or smtp_username
smtp_use_ssl = (os.environ.get("SMTP_USE_SSL", "") or "").lower() in {"1", "true", "yes"}

author_email = os.environ.get("AUTHOR_EMAIL", "")
extra_recipients = os.environ.get("NOTIFY_EMAILS", "")
recipients = _dedupe(_split_recipients(author_email) + _split_recipients(extra_recipients))
if not recipients:
    print("No email recipients found; skipping email notification.")
    raise SystemExit(0)

workflow = os.environ.get("WORKFLOW_NAME", "GitHub Actions")
status = os.environ.get("WORKFLOW_STATUS", "unknown")
repo = os.environ.get("GITHUB_REPOSITORY", "")
branch = os.environ.get("BRANCH_NAME", "")
sha = os.environ.get("COMMIT_SHA", "")
commit_message = os.environ.get("COMMIT_MESSAGE", "")
run_url = os.environ.get("RUN_URL", "")
actor = os.environ.get("GITHUB_ACTOR", "")
environment = os.environ.get("DEPLOY_ENVIRONMENT", "")
site_url = os.environ.get("SITE_URL", "")
failure_output = _failure_output() if status.lower() in {"failure", "cancelled"} else ""

subject_status = status.upper()
subject = f"[{subject_status}] {workflow} - {repo}"
status_line = (
    f"{workflow} has started."
    if status.lower() == "started"
    else f"{workflow} finished with status: {status}."
)

body = f"""{status_line}

Project: Kenya Tradex Nuxt
Repository: {repo}
Branch: {branch}
Commit: {sha}
Author: {os.environ.get('AUTHOR_NAME', '')} <{author_email}>
Triggered by: {actor}
Environment: {environment or 'n/a'}
Site URL: {site_url or 'n/a'}

Commit message:
{commit_message}

Run details:
{run_url}
{failure_output}
"""

message = EmailMessage()
message["From"] = smtp_from
message["To"] = ", ".join(recipients)
message["Subject"] = subject
message.set_content(body)

context = ssl.create_default_context()
if smtp_use_ssl or smtp_port == 465:
    with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context, timeout=30) as smtp:
        if smtp_username or smtp_password:
            smtp.login(smtp_username, smtp_password)
        smtp.send_message(message)
else:
    with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as smtp:
        smtp.ehlo()
        smtp.starttls(context=context)
        smtp.ehlo()
        if smtp_username or smtp_password:
            smtp.login(smtp_username, smtp_password)
        smtp.send_message(message)

print(f"Sent {workflow} notification to {', '.join(recipients)}")
