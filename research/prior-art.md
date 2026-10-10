# Existing projects and previous Wholphin attempts

Existing projects support several of the proposed architectures. None of the inspected projects is evidence that Wholphin can already run with every feature unchanged in a browser. Their most useful contribution is a proven boundary between UI, server state, native playback, and streaming.

## Source inspected comparisons

| Project | Inspected revision | Relevant pattern | What it does not establish |
| --- | --- | --- | --- |
| [Wholphin extensions](https://github.com/damontecres/wholphin-extensions/tree/cbb4af14c8e61845440ef2281096fc05e8976027) | `cbb4af14`, tag `v0.2.4` | Separate Android native decoders and MPV; x86-64 build path; Media3 player adapter | Desktop or Wasm compatibility of the Android wrapper |
| [Fladder](https://github.com/DonutWare/Fladder/tree/91992fcd48cd83baaac1a979345e386e43beddc0) | `91992fcd` | Responsive Flutter Jellyfin UI, web/desktop targets and platform player adapters | Wholphin policy/settings parity or uniform playback engines |
| [Jellyfin Desktop](https://github.com/jellyfin/jellyfin-desktop/tree/2cb4a4456fd29b5b62d825ef0e5df93ed6913328) | `2cb4a445` | WebEngine UI controlling native MPV, player events, per-OS display code | Native browser-tab MPV or reuse of Wholphin's Compose UI |
| [Jellyfin MPV Shim](https://github.com/jellyfin/jellyfin-mpv-shim/tree/437ac000aaec27e3b43042b31ad2f3d4cad2cd47) | `437ac000` | Desktop/background MPV client with Jellyfin session and remote-control integration | A direct Wholphin frontend replacement |
| [Google Android emulator container scripts](https://github.com/google/android-emulator-container-scripts/tree/0aa7b0dc0556a8fa1827bf5c8a2f2a04e5301fb6) | `0aa7b0dc` | Browser streaming and input via gateway and emulator RTC service | Windows Docker KVM support or Wholphin media output parity |
| [ws-scrcpy](https://github.com/NetrisTV/ws-scrcpy/tree/cd6cea6ebde17af6685c2b325183fc24bef9d52b) | `cd6cea6e` | Browser decoder and Android input/ADB bridge | Full current scrcpy audio integration or Hebrew text injection |
| [Jellyfin Kotlin SDK](https://github.com/jellyfin/jellyfin-sdk-kotlin/tree/32d9840bf2d9f36c43e2d254efdbb696877e1867) | `32d9840b`, tag `v1.7.1` | Existing JVM/Android API implementation; source for discovery and URL rules | A drop-in Wasm or JavaScript transport |

These comparison repositories were fetched for read-only source inspection under the excluded `.research-cache/` directory. Their code was not added to the application or executed as a replacement client.

## Fladder lessons

The source separates player choices in [`media_control_wrapper.dart`](https://github.com/DonutWare/Fladder/blob/91992fcd48cd83baaac1a979345e386e43beddc0/lib/wrappers/media_control_wrapper.dart). Its media-kit configuration includes `libass: !kIsWeb && settings.useLibass`, while a separate [web device profile](https://github.com/DonutWare/Fladder/blob/91992fcd48cd83baaac1a979345e386e43beddc0/lib/profiles/web_profile.dart) describes browser playback. Desktop support and a nice shared UI do not make native player features work in the web build.

Concrete reports worth turning into acceptance tests are [web subtitle background opacity, issue 744](https://github.com/DonutWare/Fladder/issues/744), [Bengali subtitle rendering, issue 436](https://github.com/DonutWare/Fladder/issues/436), and [choppy playback with hardware acceleration, issue 1023](https://github.com/DonutWare/Fladder/issues/1023). These are user reports about particular configurations, not reproduced failures in this workspace or proof that every current release is affected. They identify distinct test concerns: style application, text shaping/fonts, and frame pacing.

The scoped Hebrew issue search returned no matches. That does not establish either good or bad Hebrew support. No verified general Hebrew defect or audio/video drift defect is asserted here. Fladder's use of “sync” also covers downloading/offline media; it must not be mistaken for audio/video timing or SyncPlay.

If Fladder becomes the implementation base, the team must compare its settings, server requests and queue behavior against Wholphin and resolve license compatibility before copying code. Using it as layout and adapter inspiration is lower commitment than adopting another client's product behavior wholesale.

## Native playback lessons

Jellyfin Desktop's [`mpvVideoPlayer.js`](https://github.com/jellyfin/jellyfin-desktop/blob/2cb4a4456fd29b5b62d825ef0e5df93ed6913328/native/mpvVideoPlayer.js) sends requests to a native player API and subscribes to position, pause, buffering, end and error signals. Its [display implementation](https://github.com/jellyfin/jellyfin-desktop/tree/2cb4a4456fd29b5b62d825ef0e5df93ed6913328/src/display) has Windows, macOS, X11 and other platform code. These are useful implementation patterns for reliable UI/player synchronization and display mode restoration.

MPV Shim demonstrates another way to keep native playback separate from Jellyfin control. Its existing remote session behavior is relevant to a companion prototype, but its UI and settings are not Wholphin's. Neither project's playback capability claims replace validation on the user's GPU, receiver, operating system, and files.

## Browser streaming lessons

The Google gateway and React example provide a stronger starting point than building a screen transport from scratch. Inspect its [gateway demo](https://github.com/google/android-emulator-container-scripts/blob/0aa7b0dc0556a8fa1827bf5c8a2f2a04e5301fb6/gateway/DEMO.md) and [frontend emulator component](https://github.com/google/android-emulator-container-scripts/blob/0aa7b0dc0556a8fa1827bf5c8a2f2a04e5301fb6/js/src/components/emulator/emulator.tsx). App surfaces, audio and input still need Wholphin-specific testing.

ws-scrcpy's pinned documentation identifies ASCII-only injection and an openly powerful debugging interface. [Tango](https://github.com/yume-chan/ya-webadb) is another TypeScript ADB/browser ecosystem worth evaluating for a narrower viewer, including its current audio and clipboard paths. A device bridge can preserve the original APK but remains dependent on an Android host.

[JASSUB](https://github.com/ThaUnknown/jassub) is relevant for ASS subtitles in a browser-native port. [redroid](https://github.com/remote-android/redroid-doc), [Waydroid](https://docs.waydro.id/), [Anbox Cloud](https://documentation.ubuntu.com/anbox-cloud/explanation/anbox-cloud/), and [v86](https://github.com/copy/v86) were also reviewed through their primary documentation. They represent different deployment models, not interchangeable APK-to-web converters.

## Public search for an existing Wholphin port

[Saved public search results](generated/prior-art-search.json) record the date, query, HTTP status, total results and the first ten hits. The searches included upstream issues for `desktop`, `browser`, and `web`, repository name/description searches with forks included, and targeted Fladder issues.

The Wholphin desktop issue search returned nine hits. [Issue 318](https://github.com/damontecres/Wholphin/issues/318) is directly relevant: it describes running the APK on Linux/Waydroid and reports mouse input problems in an older version. The remaining hits largely compare playback or UI with other clients. The browser and web queries are broad and include casting and unrelated server/client comparisons.

The repository search for a Wholphin desktop description returned zero hits. The web query returned five hits, including unrelated deduplication plugins, an unrelated [`yunfie-twitter/Wholphin`](https://github.com/yunfie-twitter/Wholphin) web-search application, and the [`jaysolack-web/Wholphin`](https://github.com/jaysolack-web/Wholphin) Android fork. The latter's visible default branch did not establish a browser port; “web” in an owner's name is not platform evidence.

**No verified complete Wholphin browser/desktop port was found in these searches.** This is a scoped search finding. It does not rule out private work, unindexed branches, differently named projects, or partial experiments. The evidence does support attempting Android runtime reuse, and it provides concrete examples for native player bridges and browser streaming.

## Licensing and upstream collaboration

Preserve Wholphin's `LICENSE` and existing copyright/attribution files, including native dependency and font notices. Review each reused component's exact license and distribution requirements before packaging binaries; a GitHub license badge alone is insufficient for an integration decision.

The upstream [contribution policy](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/CONTRIBUTING.md) permits AI-assisted work under conditions, including disclosure and a human-authored PR description. This assessment stays in the user's fork and does not submit an upstream issue or PR. Any later upstream contribution must follow that policy.
