# Wholphin settings and feature parity

Preserving Wholphin means preserving what its settings do, where they apply, how they are saved, and how playback responds to them. A copied settings screen with inactive controls would not satisfy the project. Browser and desktop adapters must expose capabilities honestly and retain unsupported values for migration without pretending those values affect playback.

The reference is the upstream source at [`d6523ce`](https://github.com/damontecres/Wholphin/tree/d6523ce856f7066c35bc9df8b514a8d6b876f06c). The user's installed APK version and flavor still need to be captured before runtime comparison; this source assessment does not infer them.

## Persisted settings inventory

The complete protobuf declarations and enum values are in the readable [preference schema](generated/settings-schema.md) and [CSV](generated/settings-schema.csv). Database persistence is listed in the [database schema](generated/room-schema.md) and [CSV](generated/room-schema.csv). The [preference control inventory](generated/settings-controls.csv) records 97 scanned declarations with source locations and default expressions. It includes actions and settings destinations; subtitle editors and dynamic controls also use the underlying schema directly.

| Preference object | Fields | Meaning and portability |
| --- | ---: | --- |
| `AppPreferences` | 14 | Active session identifiers; nested preference objects; update policy and URL; logging; crash reports; automatic sign-in |
| `PlaybackPreferences` | 26 | Skip steps, seek presentation, controls timeout, debug display, next-up and pass-out protection, resume skip-back, bitrate, segment behavior, scaling, one-click pause, engine selection, external player, refresh/resolution switching and cinema mode |
| `PlaybackOverrides` | 9 | AC-3 support, stereo downmix, PGS, Dolby Vision enhancement-layer direct play, extension selection, AV1 decoding, ASS mode and maximum resolution; includes one deprecated ASS flag |
| `MpvOptions` | 2 | Hardware decoding and `gpu-next`; retain their meaning while translating native platform options |
| `HomePagePreferences` | 5 | Row item limit, rewatch next-up behavior, next-up age, click-to-play; includes the deprecated combined-row flag |
| `InterfacePreferences` | 15 | Theme music, tab memory, app colors, drawer interaction, clock, subtitle/HDR style objects, live TV, backdrop, screensaver, media-management control, logos, search and ratings; includes the deprecated tab map |
| `SubtitlePreferences` | 14 | Size, color, opacity, edge style/color/thickness, background style/color/opacity, bold/italic, margin, image opacity, and separate HDR styling; used for both ordinary and HDR preferences |
| `LiveTvPreferences` | 4 | Header, favorite ordering, recent-watch ordering and program coloring |
| `ScreensaverPreferences` | 9 | Delay, image duration, animation, age/type filtering, enable state, clock and dimming |
| `SearchPreferences` | 2 | Combined results and voice-search button visibility |
| `AdvancedPreferences` | 1 | Image disk cache size |
| `PhotoPreferences` | 2 | Slideshow duration and inclusion of video |
| `MusicPreferences` | 4 | Lyrics, visualizer, album art and backdrop visibility |
| `ExperimentalPreferences` | 5 | Enable gate, video tunneling, preferred AC-3 surround, audio-offload disabling, and preference for Dolby Vision over HDR10+ |

The total is 112 field declarations, including three deprecated fields and nested preference containers. There are 13 enums covering engine selection, ASS rendering, extension priority, next-up timing, segment behavior, scaling, D-pad seeking, colors, subtitle styling, music volume, backdrop, and rating visibility. Preserve numeric values as well as labels.

Defaults are defined by [`AppPreferencesSerializer.kt`](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/java/com/github/damontecres/wholphin/preferences/AppPreferencesSerializer.kt), [`AppPreference.kt`](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/java/com/github/damontecres/wholphin/preferences/AppPreference.kt), `ScreensaverPreference`, and upgrade logic. Proto3's zero/false defaults alone are insufficient. Keep source unit conversions and migrations until differential tests establish the intended behavior; do not silently normalize a questionable conversion during a port.

## Settings beyond protobuf

| Store | Data that must survive |
| --- | --- |
| Room `servers` and `users` | Multiple servers and users, active credentials, profile PIN/require-login behavior, recent use, UI language, local audio/subtitle language and subtitle-mode overrides |
| Room `ItemPlayback` | Chosen media source and per-item audio/subtitle track indexes, including disabled and forced-only sentinel behavior |
| Room `PlaybackLanguageChoice` | Remembered per-series audio/subtitle language choices and subtitle-disabled state |
| Room `ItemTrackModification` | Per-user, per-item, per-track delay in milliseconds |
| Room `LibraryDisplayInfo` | Sort, direction, serialized filters and serialized view options |
| Room `NavDrawerPinnedItem` | User navigation pins and ordering |
| Room `playback_effects` | Per-item video filter data: rotation, brightness, contrast, saturation, hue, RGB and blur |
| Room `seerr_servers` and `seerr_users` | Server association and authentication metadata for Seerr |
| Room `RememberedTab` | Last chosen tab for its user and item context |
| Key-value DataStore | Collection display options, excluded searchable types and whether search includes discovery |
| Local home JSON | User home configuration with versioned row data and visual options |
| Jellyfin display preferences | Saved home customization and the `removeNextUp` list, under the existing client namespace |
| Local MPV configuration | `mpv.conf` editing, persistence and which options can actually work on the target |
| Android SharedPreferences | Upgrade bookkeeping and related local app settings used outside the protobuf store |
| Jellyfin user configuration | Server audio/subtitle policy and other user configuration consulted alongside local overrides |

The 11 Room tables contain 68 columns. JSON columns and embedded model properties mean that column counts are not complete counts of user-facing choices. The supplemental [model property scan](generated/persisted-model-properties.csv) points to Kotlin declarations, including runtime/computed candidates that require interpretation.

[`HomeRowConfig.kt`](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/java/com/github/damontecres/wholphin/data/model/HomeRowConfig.kt) defines these row variants: Continue Watching, Next Up, combined Continue Watching/Next Up, Recently Added, Recently Released, Genres, Studios, Favorite, Recordings, TV Programs, TV Channels, Suggestions, By Parent, and Get Items. Each row can carry height, spacing, scaling, aspect ratio, image type, title visibility, series behavior, and episode-specific visual options. Preserve the full configuration shape and ordering.

Home configuration can be saved locally or through `HomeSettingsService` into Jellyfin display preferences using `home_settings`. Release and debug clients use different display-preference namespaces (`Wholphin` and `Wholphin (Debug)`). A port must deliberately select a compatible namespace and avoid accidentally overwriting another client's customization. [Storage contract](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/java/com/github/damontecres/wholphin/services/DisplayPreferencesService.kt).

## Feature parity assessment

This table is an engineering assessment, not a record of successful playback. **Rebuild** means the behavior is implementable with new platform code. **Host dependent** means preserving application code does not establish equivalent hardware or output. **Different contract** means the target cannot execute the same Android integration.

| Feature family | Browser only | Original APK with browser streaming | Native desktop with MPV |
| --- | --- | --- | --- |
| Multiple servers, users, PIN protection, Quick Connect | Rebuild; preserve identity and policy | Original behavior in Android | Adapt storage and platform identity |
| Home rows, drawer pins, library layouts and filters | Rebuild UI and storage; preserve configuration | Original behavior; test input and scaling | Adapt Compose TV controls; retain Kotlin policy |
| Details, episodes, collections, extras, trailers, favorites, watched state | Rebuild presentation around matching requests | Original behavior | Retain request and state policy |
| Search and Seerr discovery/requests | Rebuild; transport and cookie constraints | Original behavior and configured flavor | JVM networking reuse with desktop presentation |
| Live TV, guide, DVR and recordings | Rebuild; negotiated browser playback | Original logic; stream/output tests required | Retain service policy; adapt native playback |
| Music, lyrics, visualizer and theme songs | Rebuild; audio and autoplay constraints | Original behavior; verify audio capture | Adapt audio lifecycle and rendering |
| Photos, videos in slideshows and in-app screensaver | Rebuild | Original behavior | Adapt window and idle behavior |
| Queue, chapters, next episode and pass-out protection | Rebuild using original policy | Original policy; browser input must reset idle state | Retain policy with native engine events |
| Media segments and cinema mode | Rebuild matching segment and queue rules | Original behavior and server plugins | Retain policy and server calls |
| D-pad seek, acceleration, trickplay and focus restoration | Adapt keys, pointer interaction and browser focus | Inject keys; test press/release/repeat and pointers | Adapt desktop events; retain seeking policy |
| Resume, play-state reports and server remote control | Rebuild matching ticks, session IDs and events | Original reports; measure stream latency separately | Native events must feed matching session reports |
| Actual Android ExoPlayer and decoder extensions | Requires an Android runtime outside normal tab APIs | Runs inside Android; hardware is host dependent | Does not run as a native Windows engine |
| Actual Android MPV wrapper | Requires Android surfaces and native libraries | Runs inside Android; capture/output differs | Replace bindings and video surface with desktop libmpv |
| `PREFER_MPV` fallback to ExoPlayer | Cannot reproduce the same two engines natively | Preserve original selection rule | Cannot preserve the ExoPlayer fallback without Android |
| External Android players and return-position callbacks | Different contract; no arbitrary Android activity launch | Requires compatible players in that Android runtime | New launcher/callback adapters; not Android intent parity |
| Text subtitles, delay, language modes and downloaded subtitles | Rebuild; WebVTT or dedicated rendering and correct fonts | Original renderer; test Hebrew entry and output | MPV/libass route is promising; test fonts and stored delay |
| Full SSA/ASS styling and embedded fonts | Additional renderer such as JASSUB; extraction and fonts required | Original libass path, captured into stream | Native libass with font attachments and fallback |
| PGS and image subtitle opacity | Additional decoding/rendering or server burn-in | Original player support; verify capture | Native engine support and style mapping required |
| Direct-play codecs, remuxing, bitrate and downmix policy | Probe browser; transcode/remux when required | Android capability profile; not physical-TV profile | Probe actual desktop MPV and output capabilities |
| Surround decoding and HDMI passthrough | No general native bitstream passthrough API | Captured audio is not the original HDMI bitstream | Feasible on supported devices; requires hardware validation |
| HDR, Dolby Vision, HDR10+ and related overrides | Browser, OS, codec, display and metadata dependent | Capture/encode path must independently preserve them | OS/GPU/output dependent; do not promise all Dolby Vision profiles |
| Automatic refresh-rate and resolution switching | No equivalent ordinary-tab display-mode control | Changes guest display; does not establish host monitor switching | Per-OS native display adapter needed |
| Video effects, crop/scale, hue, rotation and blur | Rebuild renderer; verify results, especially with HDR | Preserve available original engine behavior | Map effects to the chosen desktop engine |
| Audio offload, video tunneling and Android codec defect workarounds | Android-specific controls have no equivalent effect | Apply within Android; runtime device differs | Translate only meaningful native options; cannot claim identical effect |
| LAN automatic server discovery | Needs installed privileged app or native/service relay | Guest discovery depends on network topology | JVM UDP discovery possible on the host LAN |
| Android launcher recommendations and OS DreamService | Different contract | Exist inside the guest OS | Desktop integrations require new contracts |
| Voice search | Browser recognition support and permissions vary | Android recognizer and microphone forwarding required | Native or service recognizer integration required |
| APK updater, Android diagnostics and crash/log reporting | Web/app distribution and diagnostics adapters needed | APK workflow remains inside guest | Desktop installer/updater and diagnostics adapters needed |

Source anchors for the table are in the [architecture map](architecture.md), preference inventories, [`PlaybackViewModel`](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/java/com/github/damontecres/wholphin/ui/playback/PlaybackViewModel.kt), [`PlayExternalPage`](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/java/com/github/damontecres/wholphin/ui/playback/PlayExternalPage.kt), and the [manifest](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/AndroidManifest.xml). Platform constraints and alternatives are explained with primary documentation in [platform options](platform-options.md).

## Fidelity rules for implementation

Preserve existing request and selection policy before changing rendering. A device profile must reflect what the target can decode and output; copying Android codec claims into a browser profile causes avoidable playback failures. A transcode may produce watchable video while still losing the original subtitle rendering, HDR, or audio behavior.

Keep settings import/export versioned and scoped. Test a full round trip that includes nested protobuf preferences, database JSON, home rows, language selections, delays, effects, and MPV configuration. Preserve values with no platform equivalent and label their availability; never silently discard them.

Compare against the same upstream engine and media, rather than against an idealized feature description. SyncPlay is an upstream feature request ([issue 203](https://github.com/damontecres/Wholphin/issues/203)); it should not be described as an existing Wholphin feature. Distinguish SyncPlay, offline file synchronization, Jellyfin resume synchronization, and audio/video synchronization in tests and status reports.
