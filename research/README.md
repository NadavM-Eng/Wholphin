# Wholphin browser and desktop assessment

**Runtime update:** the original APK now runs with ExoPlayer and MPV on this Windows host and streams video/audio into a local browser, with a separate input adapter. See [the runtime report, screenshots, limits and launch instructions](runtime-results.md). This is a working streamed Android prototype; full browser-native and TV hardware parity remain unproven.

Wholphin can plausibly become usable from a computer and accessible through a browser. **A normal browser tab cannot provide every Android TV feature unchanged.** The closest route to the requested fidelity is to run the original Android application and add a computer input and display layer. A native desktop port is a credible longer-term route, especially for MPV playback, but it requires platform adapters and cannot retain Android ExoPlayer as a native Windows player.

Assessment date: **11 October 2026**. The application source baseline is [`d6523ce856f7066c35bc9df8b514a8d6b876f06c`](https://github.com/damontecres/Wholphin/commit/d6523ce856f7066c35bc9df8b514a8d6b876f06c), from the official [`damontecres/Wholphin`](https://github.com/damontecres/Wholphin) repository. This is an assessment and research checkout; there is no completed browser or desktop port yet.

## Recommended direction

Start with a short experiment running an upstream APK with its real native extensions on an official Android emulator. Use keyboard navigation first, then test mouse input and Hebrew entry. On this Windows workspace, use the native Windows emulator with the supported hypervisor route; Google's Docker emulator examples require Linux and KVM. A successful Android runtime test establishes whether preserving the app is practical before a rewrite consumes months. [Android emulator acceleration](https://developer.android.com/studio/run/emulator-acceleration), [Google container requirements](https://github.com/google/android-emulator-container-scripts/blob/0aa7b0dc0556a8fa1827bf5c8a2f2a04e5301fb6/README.md).

Then add a browser streaming experiment. Google's emulator gateway already demonstrates browser display and input over WebRTC. The original app would continue to handle Jellyfin, settings, subtitles, and player selection. The browser would receive captured video and audio. That preserves application logic, but it introduces latency, a second encoding step, and a different output path. It does not establish HDR, surround bitstream passthrough, or identical hardware decoding. [Google browser streaming architecture](https://github.com/google/android-emulator-container-scripts/blob/0aa7b0dc0556a8fa1827bf5c8a2f2a04e5301fb6/gateway/DEMO.md).

If runtime or streaming playback fails the acceptance criteria, pursue a Kotlin JVM desktop port with native MPV. This keeps more Kotlin service logic than a Dart or TypeScript rewrite. The existing Jellyfin Kotlin SDK supports Android and JVM, while Wholphin's MPV wrapper is tied to Android surfaces and must be adapted. Compose Multiplatform also requires replacement of Android-only APIs and TV components. [Kotlin SDK platforms](https://github.com/jellyfin/jellyfin-sdk-kotlin), [Android-only Compose components](https://kotlinlang.org/docs/multiplatform/compose-android-only-components.html).

Treat a browser-native client as an additional product target with explicitly documented capability differences. It can reproduce navigation, server features, settings, and much playback behavior. It cannot satisfy the literal requirement that the same ExoPlayer, native MPV bindings, Android integrations, and device controls all work unchanged in an ordinary tab.

## What the source establishes

The generated inventory contains **627 upstream tracked files**, **398 main application Kotlin files**, and **90,318 lines of main application Kotlin**. The UI accounts for 275 files and 69,173 lines. These are lexical counts, not an estimate of how much code can be reused.

Settings include **112 protobuf field declarations across 14 messages**, **13 protobuf enums**, and **68 stored database columns across 11 tables**. These counts include internal identifiers, nested preference objects, and deprecated fields; they are not counts of independently visible settings. The preference scanner identifies 97 declarations, including buttons and navigation entries. Home configuration also uses local JSON and Jellyfin display preferences. An inventory of the protobuf alone would miss important customization. See [settings and feature parity](settings-and-parity.md).

The optional MPV implementation lives in a separate [`wholphin-extensions`](https://github.com/damontecres/wholphin-extensions/tree/cbb4af14c8e61845440ef2281096fc05e8976027) repository. The application checkout contains a compile stub. A build can configure successfully while MPV is completely unusable at runtime.

## Evidence from this workspace

| Check | Result | Meaning |
| --- | --- | --- |
| Full upstream Git fetch and source checkout | Passed | Exact source baseline and history are available locally |
| Existing GitHub fork | Verified | Reused [`NadavM-Eng/Wholphin`](https://github.com/NadavM-Eng/Wholphin); assessment work is on `research/browser-desktop-assessment` |
| Source and settings inventories | Generated | Reproducible files with commit-specific source links |
| Gradle wrapper version | Passed | Gradle 9.6.1 runs with the configured JDK 21 |
| Gradle `help` | Passed | Build scripts configure; matching real native extensions were subsequently supplied for source assembly |
| Android debug APK assembly | Passed in the runtime experiment | SDK installed; real MPV/FFmpeg/AV1 extension AARs supplied; application source unchanged |
| Isolated Chrome capability probe | Passed | Advertises H.264, HEVC, VP9, and AV1 support for tested configurations; does not advertise the tested AC-3, E-AC-3, DTS, or TrueHD formats |
| Original Android and browser playback | Passed for the lab sample | Real ExoPlayer and MPV, H.264/AAC SDR, Hebrew SRT/ASS, captured audio and WebRTC viewer exercised |
| Upstream unit tests | 378 passed / 4 failed | 382 tests; Windows DataStore rename failures reproduced in an isolated suite retry |
| HDR, passthrough and complete parity | Pending | Representative media, physical output hardware, synchronization and remaining input checks required |

The Chrome probe queries advertised support. It does not decode a media file, measure synchronization, or validate hardware acceleration. Its Matroska answer also differs between `canPlayType` and Media Source Extensions; a codec capability must not be confused with container or streaming support. Full results: [browser capabilities](generated/browser-capabilities.json).

## Read the assessment

- [Architecture and annotated source tree](architecture.md) explains each source area and the login, browsing, settings, playback, and network flows.
- [Settings and feature parity](settings-and-parity.md) inventories persisted settings, features, and what each platform must preserve.
- [Platform options](platform-options.md) compares Android runtimes, browser streaming, Kotlin desktop and web, native companions, Flutter, and browser emulation.
- [Existing projects and previous attempts](prior-art.md) records reusable patterns and the limits of the public search.
- [Networking and Hebrew](network-and-hebrew.md) separates actual connections from proposed infrastructure and defines text and subtitle fidelity.
- [Validation and delivery roadmap](validation-and-roadmap.md) records the checks performed, the next experiments, acceptance criteria, and conditional planning ranges.
- [Provenance](provenance.json) pins application and comparison repositories.
- [Native/browser runtime results](runtime-results.md) records the implemented prototype and its reproducible test evidence.

## Continuing work

Read [the project brief](../AGENTS.md) first. Preserve upstream behavior and code until an experiment justifies a change. The native baseline and basic browser stream now work. Continue with the remaining input, synchronization, media/hardware and delivery gates in the runtime report; successful smoke tests do not establish every feature's parity.

Rebuild the baseline inventory with `node tools/research/source-inventory.mjs`. Re-run the local browser probe with `node tools/research/run-browser-probe.mjs`. External search results can be refreshed with `node tools/research/prior-art-search.mjs`. Research dependencies are cached locally under `.research-cache/` and are excluded from Git. The upstream ignore rules exclude `docs/`, so this assessment uses the tracked `research/` directory.
