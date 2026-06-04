# Celular And Automation

The phone is a remote control. Codex still runs on the host that has the repo, plugins, permissions, and preview context.

Allowed automation:

- search for recent AI signals;
- use approved sources;
- dry-run persistence when credentials are missing;
- summarize inserted, updated, duplicated, rejected, and pending signals;
- leave editorial decisions pending when evidence is incomplete.

Not allowed:

- invent sources;
- approve final editorial status without evidence;
- expose secrets;
- commit generated daily searches;
- deploy silently without reporting the preview URL and smoke result.

If an automation is created outside the repo, record only its policy and expected evidence here. Do not commit platform-specific runtime state.
