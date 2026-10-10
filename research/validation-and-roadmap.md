# Wholphin validation and delivery roadmap

The assessment supports a staged delivery plan: prove the original APK on a computer, then prove browser streaming, then choose a native port only if the measured results require it. The first product experiment should answer playback and input questions before substantial UI work starts.

## Checks performed

| Check | Outcome on 11 October 2026 |
| --- | --- |
| Upstream source and Git history | Fetched all upstream branches and tags; checked out `d6523ce856f7066c35bc9df8b514a8d6b876f06c` |
| Source description | `v1.0.8-17-gd6523ce8`; this is a source description, not the user's installed version |
| Fork relationship | Existing `NadavM-Eng/Wholphin` verified as a fork of `damontecres/Wholphin` |
| Gradle launcher | `gradlew.bat --version` passed; Gradle 9.6.1, configured JDK 21.0.10, Windows 11 amd64 |
| Build configuration | `gradlew.bat help --no-daemon --console=plain` passed |
| Native extension resolution | Configuration reported FFmpeg and AV1 absent, and MPV replaced by the stub |
| APK assembly | `:app:assembleDefaultDebug` failed at dependency determination because the Android SDK location is missing |
| Baseline inventory | Reproducible counts: 627 tracked files, 398 main Kotlin files, 112 protobuf fields, 13 enums, 11 database tables and 68 columns |
| Comparison source inspection | Pinned extension, SDK, Fladder, Jellyfin Desktop, MPV Shim, Google emulator streaming, and ws-scrcpy source examined |
| Browser probe | Isolated headless Chrome 155 returned advertised API/codec support; no media was played |
| Research artifact checks | JavaScript syntax and JSON parsing passed; 270 local/pinned-source links resolved; generated source outputs rebuilt deterministically |
| Hebrew resource inventory | Independently checked against parsed XML: 647 base string elements, 628 Hebrew string elements, 19 missing keys, including 6 non-translatable keys |
| Upstream application changes | None in this assessment |

The configure check is not an Android build or player test. No APK, emulator session, test-server login, native MPV session, subtitle render, or receiver/display validation was completed. Existing Android unit and instrumentation tests were not run because the SDK prerequisite is missing. Raw local Gradle logs are retained in excluded `.research-cache/`; the table records their relevant outcomes.

The SDK source fetch hit Git's clone protection for an active checkout hook after the files were checked out. The source objects at the pinned tag were readable and the working tree was clean; no protection was disabled and the hook was not run. No SDK build was attempted. This did not affect the Wholphin source checkout.

## Stage 1 establish a faithful Android runtime baseline

Use an official Android x86-64 virtual device first. For Windows, use the documented hypervisor route. Prefer an upstream release APK with verified native libraries for initial playback, or build the pinned source after installing/configuring the matching SDK and providing the extension AARs. The two choices must have separately recorded version/commit metadata.

The local source uses compile/target SDK 37, minimum SDK 23, AGP 9.2.1, Kotlin plugin 2.4.20 with language version 2.3, Media3 1.11.1, Jellyfin SDK 1.7.1, and extensions 0.2.4. These are the checked-out version catalog/build values, not an instruction to downgrade or upgrade them. [Version catalog](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/gradle/libs.versions.toml), [application build](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/build.gradle.kts).

Once prerequisites exist, the relevant Android baseline command is:

```powershell
.\gradlew.bat :app:assembleDefaultDebug :app:testDefaultDebugUnitTest --no-daemon --console=plain
```

Passing it without native artifacts still does not validate MPV. Prebuilt extensions need the upstream registry's documented access, or they can be built from source. Do not commit credentials or binaries. [Extension build and artifact instructions](https://github.com/damontecres/wholphin-extensions/blob/cbb4af14c8e61845440ef2281096fc05e8976027/README.md).

Capture a physical-TV reference for the user's actual APK flavor, settings and selected media. The runtime experiment then compares the same cases in ExoPlayer and MPV, including `PREFER_MPV`. Record whether each result is direct play, direct stream/remux, or transcode. First verify keyboard/remote behavior, then click, hover, wheel, focus and Unicode input. If pointer support is missing, make a narrowly scoped compatibility change after recording the failing case.

**Exit condition:** both real engines launch, the baseline media set is watchable with usable input, settings persist, and playback state reaches Jellyfin correctly. **Stop condition:** either engine is a stub, video surfaces are missing, audio fails, or the runtime is unsuitable for the target media. Do not start a broad UI port to conceal a failed playback baseline.

## Stage 2 prove browser display and control

Use the Google gateway/RTC example on a documented host, or a current scrcpy/Tango-based bridge with verified audio support. Keep the app and its server communication inside Android. Begin on a local network and record source playback and final stream properties separately.

Test both ExoPlayer and MPV surfaces, continuous sound, subtitle composition, Unicode entry, key repeats, timeline interaction, fullscreen, reconnect and browser focus changes. Measure end-to-end input latency and synchronization across capture, encoding, transport and browser output. Compare repeated seeks and an extended session; a short demo can hide slow drift.

**Exit condition:** reliable picture/audio, correct controls, no growing drift, acceptable measured latency, and preserved application settings/reports. **Output-quality decision:** source HDR metadata and surround passthrough are separate requirements. If they do not survive the stream path, this route cannot be described as full parity even when its UI and internal engines match.

## Stage 3 choose the product architecture from measured results

If the runtime and stream satisfy the actual use case, package a managed runtime/viewer with persistent state and predictable updates. If streaming fails on output quality but local Android playback is satisfactory, deliver a desktop runtime window first. If Android virtualization itself fails, start a Kotlin JVM/native MPV vertical slice.

That native slice should cover login, one real library screen, one settings group, one playable item, subtitle/track selection, and Jellyfin playback reporting. It must use original service/selection policy as far as practical. Prove rendering and event synchronization before extracting the rest of the UI. Follow with preferences migration, home customization, remaining content types, Seerr and OS integration.

If a browser-native target is then pursued, use a distinct capability contract and differential tests for policy. Browser media negotiation and platform integrations must be implemented explicitly. There is no valid “perfect ordinary-browser parity” milestone for the entire current Android feature set.

## Acceptance criteria

The numerical thresholds below are proposed initial test targets, not measured results or universal media standards. Revise them using the physical-TV reference and the intended computer hardware.

| Area | Initial acceptance test |
| --- | --- |
| Configuration | All preference declarations, database objects, home JSON, language choices, track delays and MPV config round-trip with their scope/version preserved |
| Server sessions | Password and Quick Connect work; multiple-user/PIN behavior matches; pause/progress/stop events appear once with the correct session, item and media source |
| Resume | Stop and resume land within 2 seconds of the reported reference position, accounting for the configured skip-back policy |
| Seeking | Twenty repeated seeks and track switches recover without stuck playback; no accumulating timestamp offset |
| Audio/video timing | Target absolute skew under 80 ms in the SDR test set; no increase beyond 40 ms across a 60-minute session, measured with timestamped audio/video events |
| Subtitle timing | Cues and stored positive/negative delay match the source engine within one display frame where the source format and output permit it |
| Hebrew | Manual visual comparison passes mixed-direction punctuation, numbers, English fragments, combining marks, line wrapping, fonts and UI text entry |
| Input | D-pad, repeated arrows, enter, back/escape, media keys, mouse clicks, wheel and focus restoration work without double actions or trapped focus |
| Browser stream | Proposed LAN target below 150 ms for typical control feedback; report median/p95 plus bitrate, resolution and capture settings |
| Playback negotiation | Capability profile accurately predicts direct play/remux/transcode; unsupported media receives a functional negotiated path or clear error |
| HDR and surround | Validate actual display/receiver output and metadata; a player overlay or browser capability query alone is insufficient |
| Lifecycle | Fullscreen, minimize, browser blur, sleep/wake, reconnect and app exit leave consistent playback and server state |
| Content and integrations | Movies, series, music, photos, live TV/DVR, media management, Seerr, segments, pre-rolls and custom rows match the corresponding reference scenarios |
| Display modes | If implemented, switch to the measured target mode and restore it on stop, error and exit; do not confuse guest display changes with host monitor changes |

Preserve the upstream distinction between engine capability and exposed controls. If the reference engine itself fails a file or ignores a setting, record that result separately from a regression introduced by the port.

## Media and language test set

| Sample | Purpose |
| --- | --- |
| H.264/AAC MP4, 1080p SDR | Basic direct playback, seeking, resume and synchronization |
| H.264 or HEVC MKV with multiple audio/subtitle tracks | Container, embedded track discovery, source switching and attachments |
| HEVC 10-bit 4K HDR10 | Hardware decoding, output color and sustained throughput |
| Actual Dolby Vision and HDR10+ files used by the user | Profile-specific negotiation and actual output; do not substitute a generic HEVC clip |
| AV1 at the intended resolution | Software/hardware path and decoder extension behavior |
| AC-3, E-AC-3, DTS and TrueHD/surround samples | Decode, downmix, audio transcoding and real receiver passthrough |
| Synthetic mixed-Hebrew SRT and ASS fixtures | Bidi, styling, fonts, line wrapping and delays |
| ASS with embedded Hebrew-capable font and positioned effects | Attachment extraction, shaping and style fidelity |
| PGS sample | Image subtitle composition, opacity and scaling |
| Live TV channel and a DVR recording | Stream IDs, startup, switching, error recovery and recording actions |
| Music album with lyrics, images and mixed-language names | Music session behavior and background/UI state |
| Series with chapters, trickplay and segment metadata | Seeking, queue progression, skips and next-up behavior |
| HTTP LAN server, HTTPS server and a server under a URL path prefix | Authentication, media URLs, WebSockets, discovery and browser constraints |
| Seerr sessions using the authentication methods actually configured | Cookies, API keys, user switch, discovery and requests |

Use original or appropriately licensed media. The supplied subtitle fixtures contain original synthetic text and have not been rendered. No user library or credentials were accessed during the assessment.

## Conditional planning ranges

These are engineering judgment for one experienced developer with relevant hardware/server access, not delivery commitments. They exclude delays obtaining devices or changing system virtualization settings.

| Work | Exploratory slice | Reliable delivery |
| --- | --- | --- |
| Original APK in a computer window | 2–5 working days | Roughly 2–4 weeks for startup, input, persistence and packaging if media passes |
| Browser streaming of original APK | 3–7 working days after runtime works | Roughly 4–8 additional weeks for sessions, audio/input reliability, reconnect and deployment |
| Kotlin JVM/native MPV port | 2–4 weeks for a vertical slice | Roughly 4–9 months for broad Wholphin coverage and validation on an initial desktop OS |
| Web UI/native MPV shell | 2–4 weeks for a player bridge slice | Roughly 4–9 months if Wholphin's UI and policy must also be ported |
| Browser-native or Flutter rewrite | 3–6 weeks for representative browsing/playback/settings | Roughly 6–12+ months for broad coverage; full unchanged Android parity remains unavailable |

Multiple desktop operating systems, exotic media and output hardware expand the validation workload. Revise the ranges after Stage 1 and Stage 2; do not commit to a large port before the highest-risk player/output decisions are measured.

## Reproducing this assessment

```powershell
node tools/research/source-inventory.mjs
node tools/research/run-browser-probe.mjs
node tools/research/prior-art-search.mjs
```

The first command inspects immutable Git objects at the recorded baseline. The browser probe launches a separate headless Chromium profile and does not modify an existing user browser profile. The search command refreshes public, read-only results and can change counts/statuses as upstream projects evolve. Keep those outputs dated and refresh narrative findings deliberately.
