# Wholphin for Browser and Desktop

Read this file before doing any work in this workspace.

## Purpose

Investigate and ultimately deliver a browser-accessible and/or desktop version of the real upstream Wholphin Android TV Jellyfin client. The user's target is feature-for-feature fidelity: preserve Wholphin's existing settings, navigation, server integrations, playback behavior, ExoPlayer and MPV capabilities, subtitles (especially Hebrew and mixed right-to-left text), networking, and remote-control behavior while adding usable mouse and keyboard input.

The upstream application is the behavioral reference. Preserve its logic and assets wherever practical. Do not replace working features with simplified substitutes and call that parity. Separate a local native companion, an Android runtime, remote video streaming, and a genuinely browser-native application when discussing feasibility.

## Current phase: assessment complete and runtime experiments pending

The completed assessment is in [research/README.md](research/README.md). No browser or desktop port has been implemented. The source was fetched into this workspace with full upstream history, and the existing user-owned fork was reused.

- Upstream: `https://github.com/damontecres/Wholphin`
- User fork: `https://github.com/NadavM-Eng/Wholphin`
- Source baseline: `d6523ce856f7066c35bc9df8b514a8d6b876f06c` (`v1.0.8-17-gd6523ce8`)
- Assessment branch: `research/browser-desktop-assessment`
- Research date: 11 October 2026
- Best first experiment: the original APK with real extensions in an official Android runtime on a computer; add browser streaming after local playback succeeds.
- Native fallback: a Kotlin JVM/Compose desktop target with a new desktop MPV adapter, while preserving original policy.
- Constraint: ordinary browser-only tabs cannot preserve all Android player, networking, external-intent, and display/audio capabilities unchanged. Do not reclassify a streamed Android app or installed native companion as a browser-native implementation.

The following sequence describes the completed assessment workflow and remains the standard for updating it:

1. Verify the official GitHub repository and establish a fork/checkout with a recorded upstream commit.
2. Read the build files, source, manifests, preferences, player integrations, networking, and upstream development guidance.
3. Produce source-linked architecture documentation, an annotated directory tree, a retain/adapt/replace inventory, a complete settings and feature inventory, and an evidence-based browser/desktop feasibility assessment.
4. Compare Android runtime/container/streaming approaches, Kotlin/Compose reuse, a browser-native port, native desktop playback, and relevant existing Jellyfin clients.
5. Clearly distinguish facts from hypotheses and untested assumptions. Do not promise perfect parity where browser or operating-system restrictions prevent it.
6. Make the next implementation stage concrete with experiments, acceptance criteria, costs, and a recommendation. Do not start a broad rewrite during this assessment.

## Working rules

- Communicate with the user and write all documentation in English.
- Manage the investigation autonomously. Ask only for information essential to proceed; the user expects completed research and a reasoned recommendation.
- Keep original upstream code intact during assessment. Put research, source inventories, and small reversible analysis tools outside the application source.
- Read applicable upstream `AGENTS.md`, `CONTRIBUTING.md`, and development instructions. Preserve license notices and document redistribution obligations.
- Pin evidence to exact repository commits and record the research date. Cite primary documentation for external platform claims.
- Inventory all preferences and player-specific options; do not infer completeness from the upstream README alone.
- Trace network connections and listen sockets separately. Record required destinations/ports without inventing local services.
- Treat codec support, audio passthrough, HDR, refresh-rate changes, subtitle rendering, seeking, audio/subtitle synchronization, login, and resume reporting as separate acceptance criteria.
- Never claim build, playback, Hebrew, browser, or hardware validation without actually running the relevant check. Record missing prerequisites and the practical next test.
- Keep credentials, session tokens, private server addresses, build products, and downloaded research dependencies out of commits.
- Do not publish unsolicited upstream issues, comments, or pull requests.

## Orientation

- [Architecture and annotated source tree](research/architecture.md)
- [Settings and feature parity](research/settings-and-parity.md)
- [Platform options](research/platform-options.md)
- [Existing projects and prior attempts](research/prior-art.md)
- [Network connections and Hebrew fidelity](research/network-and-hebrew.md)
- [Completed checks and implementation roadmap](research/validation-and-roadmap.md)
- [Pinned source provenance](research/provenance.json)

Rebuild source inventories with `node tools/research/source-inventory.mjs`. The pinned inventories contain 112 protobuf fields and 68 Room columns, but neither number represents a count of user-facing settings. Include home JSON, server display preferences, key-value settings, MPV configuration and runtime controls when judging completeness.

Gradle 9.6.1 configuration passed with JDK 21. APK assembly failed because the Android SDK location is missing. Native FFmpeg/AV1/MPV artifacts are absent; the build currently resolves MPV to a throwing stub. No playback, Hebrew subtitle rendering, HDR, or audio passthrough has been verified. The local Chrome probe only checked advertised codec/API support.

`.research-cache/` is excluded by the repository ignore rules. It contains read-only comparison checkouts, build logs and an isolated browser profile. Never commit these caches or any credentials. The upstream `docs/` ignore rule remains, so maintain project documentation under `research/`.

Do not submit an upstream PR automatically. If later contributing upstream, read `CONTRIBUTING.md`, including the AI disclosure and human-authored PR-description policy. This file is the continuing project brief for future AI contributors, not a declaration that the port already works.
