# Wholphin for Browser and Desktop

Read this file before doing any work in this workspace.

## Purpose

Investigate and ultimately deliver a browser-accessible and/or desktop version of the real upstream Wholphin Android TV Jellyfin client. The user's target is feature-for-feature fidelity: preserve Wholphin's existing settings, navigation, server integrations, playback behavior, ExoPlayer and MPV capabilities, subtitles (especially Hebrew and mixed right-to-left text), networking, and remote-control behavior while adding usable mouse and keyboard input.

The upstream application is the behavioral reference. Preserve its logic and assets wherever practical. Do not replace working features with simplified substitutes and call that parity. Separate a local native companion, an Android runtime, remote video streaming, and a genuinely browser-native application when discussing feasibility.

## Current phase: native baseline and local browser prototype working

The completed assessment is in [research/README.md](research/README.md). The original APK now runs in an official Android TV emulator with real ExoPlayer and MPV, and a local WebRTC viewer streams its screen/audio into a browser. Read [runtime results and launch instructions](research/runtime-results.md) before continuing. This is a streamed Android prototype; application source is unchanged and complete TV/browser parity has not been established. The source was fetched with full upstream history, and the existing user-owned fork was reused.

- Upstream: `https://github.com/damontecres/Wholphin`
- User fork: `https://github.com/NadavM-Eng/Wholphin`
- Source baseline: `d6523ce856f7066c35bc9df8b514a8d6b876f06c` (`v1.0.8-17-gd6523ce8`)
- Assessment branch: `research/browser-desktop-assessment`
- Runtime experiment branch: `experiment/android-browser-runtime`
- Playback reference: upstream stable v1.0.8 x86_64 APK, release commit `7af7bc0aa70229fda6222f2d17d1b1ddbc2373c5`; distinct from the newer source baseline above.
- Research date: 11 October 2026
- Completed first experiment: original APK, native playback, Hebrew SRT/ASS smoke tests, separate accessibility input adapter, and local browser streaming. Start the installed lab with `tools/runtime/start-lab.ps1`; open `http://127.0.0.1:18765/` and Connect.
- Next work: pointer seek/drag/focus fidelity, measured synchronization, representative TV media and hardware outputs, performance and packaging. Use the acceptance gates in the runtime report; do not treat the prototype as a completed port.
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
- [Runtime experiment, evidence and launch instructions](research/runtime-results.md)
- [Pinned source provenance](research/provenance.json)

Rebuild source inventories with `node tools/research/source-inventory.mjs`. The pinned inventories contain 112 protobuf fields and 68 Room columns, but neither number represents a count of user-facing settings. Include home JSON, server display preferences, key-value settings, MPV configuration and runtime controls when judging completeness.

Android SDK and the accelerated API 36 TV AVD are now installed in the excluded runtime cache. Gradle 9.6.1/JDK 21 source APK assembly passed with real FFmpeg/AV1/MPV AARs from the matching official extension CI artifact. The upstream unit run had 378 passes and 4 DataStore temporary-file rename failures out of 382 tests; an isolated ServerRepositoryTest retry reproduced all four. Playback used the separate original stable APK. Hebrew letters/combining marks, ASS positioning, captured PCM and actual browser media were observed. Pointer seeking, measured lip-sync, HDR and audio passthrough are not passed acceptance checks.

Keep emulator capture authenticated and local: use `-grpc-use-token`, read the short-lived discovery credential without logging it, and verify unauthenticated capture is rejected. The final gRPC, viewer HTTP, ADB input forward and lab Jellyfin listeners were on loopback. Do not revert to the initial explicit `-grpc` launch without authentication, which bound to the wildcard address. Never reuse the disposable lab helper to operate unrelated Android apps or services.

`.research-cache/` is excluded by the repository ignore rules. It contains read-only comparison checkouts, build logs and an isolated browser profile. Never commit these caches or any credentials. The upstream `docs/` ignore rule remains, so maintain project documentation under `research/`.

Do not submit an upstream PR automatically. If later contributing upstream, read `CONTRIBUTING.md`, including the AI disclosure and human-authored PR-description policy. This file is the continuing project brief for future AI contributors, not a declaration that the port already works.
