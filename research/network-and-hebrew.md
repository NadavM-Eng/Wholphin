# Wholphin networking and Hebrew fidelity

Network compatibility and Hebrew compatibility are separate deliverables. Wholphin's Android network policy and text stack do not transfer automatically into a browser, even if screens and settings look identical. Preserve configured addresses, authentication, subtitle rules, and text behavior while making target restrictions explicit.

## Existing network connections

| Connection | Direction and ports | Source and porting consequence |
| --- | --- | --- |
| Jellyfin API, images, media and diagnostic uploads | Client to configured server URL; SDK candidates include HTTP TCP 8096 and HTTPS TCP 8920; reverse proxies may use 80/443 or another configured port | Keep URL path prefixes and explicit ports. [SDK address constants](https://github.com/jellyfin/jellyfin-sdk-kotlin/blob/32d9840bf2d9f36c43e2d254efdbb696877e1867/jellyfin-core/src/jvmCommonMain/kotlin/org/jellyfin/sdk/discovery/AddressCandidateHelper.kt) |
| Jellyfin session/event connection | Outgoing WebSocket over the configured server origin; not a separate hardcoded Wholphin listener | Keep session reporting, general commands, playback commands, user updates and reconnect behavior. [Client construction](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/java/com/github/damontecres/wholphin/services/hilt/AppModule.kt) |
| Local server discovery | UDP broadcast to destination 7359; SDK opens a temporary socket on an OS-assigned local port for replies | It does not require Wholphin to listen permanently on TCP/UDP 7359. Ordinary browser pages need a discovery relay or an installed privileged app. [Pinned discovery implementation](https://github.com/jellyfin/jellyfin-sdk-kotlin/blob/32d9840bf2d9f36c43e2d254efdbb696877e1867/jellyfin-core/src/jvmCommonMain/kotlin/org/jellyfin/sdk/discovery/LocalServerDiscovery.kt) |
| Seerr APIs and authentication | Outgoing HTTP/HTTPS to the configured Seerr origin and deployment port | Session-cookie and API-key paths need browser-aware transport. [Seerr client](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/java/com/github/damontecres/wholphin/api/seerr/SeerrApiClient.kt) |
| Discovery imagery | HTTPS to the configured image source; source includes `image.tmdb.org` as an image base | A working local Seerr API alone does not guarantee every image is available offline. [Image configuration](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/java/com/github/damontecres/wholphin/services/SeerrService.kt) |
| Application updates | Default release metadata at `api.github.com` over HTTPS; asset downloads use returned URLs; update URL is configurable | Preserve custom update intent, but use appropriate web/desktop distribution instead of treating APK installation as browser behavior. [Update checker](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/java/com/github/damontecres/wholphin/services/UpdateChecker.kt) |
| External media and trailers | Selected stream URLs, redirects or external player destinations can add hosts/ports | Record actual destinations during playback; do not infer every media connection from the initial server URL |

A source search found no explicit permanent application TCP listener or configured MPV JSON IPC listener in Wholphin's main source. MPV is controlled through native bindings. This is a source finding, not a runtime packet trace; discovery and dependencies can still create sockets. Server-side tuner, downloader and media-management ports are not automatically client-side requirements.

Wholphin permits cleartext traffic and trusts both system and user-installed certificate anchors in its Android [network configuration](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/res/xml/network_security_config.xml). A browser uses its own certificate/trust and transport rules. A successful Android login therefore does not prove a hosted web client can reach the same URL.

## Browser constraints and current exceptions

Cross-origin API reads require a compatible CORS policy or a deliberate relay. JSON/API calls, `<video>` requests, subtitle/font downloads, images, and WebSockets have different request and authentication behavior. A video element does not provide the same arbitrary-header interceptor as OkHttp. Preserve Jellyfin's supported authenticated-media URL or credential mechanism, HTTP Range requests, seek behavior and path prefixes. [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy).

Seerr's client uses a cookie jar and can add `X-Api-Key`. A browser cannot reproduce a JVM cookie jar by manually reading every `Set-Cookie` response. Cross-site cookies, credentials mode, CORS, and server cookie attributes matter. A scoped same-origin relay or desktop transport may be necessary for equivalent authentication. Keep cookies and tokens attached to the correct service and active profile.

HTTPS-to-HTTP requests can encounter mixed-content rules, but a blanket statement that every HTTP LAN server is unreachable from HTTPS is outdated. Chrome's Local Network Access documentation describes permission-gated exceptions for recognized local destinations, including private-IP literals and `.local` names, and an address-space annotation path. This differs from public hostnames and from other browsers. Test the actual API, media, WebSocket and worker flows on the supported versions. [Chrome Local Network Access](https://developer.chrome.com/blog/local-network-access), [mixed content](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Mixed_content).

Ordinary web pages cannot reproduce arbitrary raw UDP discovery or TCP socket behavior. Chrome Direct Sockets is an installed Isolated Web App capability. Fetch also blocks certain unsafe ports. CORS success does not remove those restrictions. [Direct Sockets](https://developer.chrome.com/docs/iwa/direct-sockets), [Fetch port blocking](https://fetch.spec.whatwg.org/#port-blocking).

Android container networking adds its own boundary. A guest can reach a server by address while its broadcast discovery fails across NAT or a container network. Test direct connection and discovery separately; a remote Android host discovers its own network, not necessarily the browser user's home LAN.

## Additional ports from proposed architectures

| Proposed component | Documented example or design choice | Exposure policy |
| --- | --- | --- |
| Google emulator container ADB | TCP 5555 example mapping | Debugging interface; keep internal to the host or controlled development network |
| Emulator gRPC control | TCP 8554 example mapping; actual local emulator discovery can specify another port and token | Internal control plane, not a browser-facing media URL |
| Google signaling gateway | TCP 8080 in the demo | For a product, authenticate sessions and place behind the chosen local or HTTPS access layer |
| React development frontend | TCP 5173 in the demo | Development server; replace with deliberate production serving |
| WebRTC media and traversal | ICE-selected paths; STUN/TURN depends on deployment | Determine actual candidate/relay needs; no fixed UDP range has been selected |
| Local native MPV companion | No port selected; a loopback HTTP/WebSocket bridge or platform IPC is a proposed design | Bind only to intended interfaces and authenticate control sessions |

The ADB/gRPC mappings are from [Google's container README](https://github.com/google/android-emulator-container-scripts/blob/0aa7b0dc0556a8fa1827bf5c8a2f2a04e5301fb6/README.md); frontend/gateway examples are in [the gateway demo](https://github.com/google/android-emulator-container-scripts/blob/0aa7b0dc0556a8fa1827bf5c8a2f2a04e5301fb6/gateway/DEMO.md). These services are not running in this workspace. They are infrastructure introduced by a chosen route, not ports Wholphin already opens.

## Existing Hebrew behavior

The manifest declares RTL support, and [`values-iw/strings.xml`](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/res/values-iw/strings.xml) contains Hebrew translations. A lexical comparison, checked independently against parsed XML, finds 647 base string elements and 628 Hebrew string elements, with 19 base keys absent from that file. Six missing keys are non-translatable; the remaining keys use Android's fallback where no translation is present. This excludes plurals/arrays and other resource files and is not a count of broken translations. [Exact key comparison](generated/localization-string-keys.json).

Wholphin deliberately forces left-to-right layout in portions of its playback controls and timeline, then restores the user's direction for relevant text. Preserve that behavior rather than globally mirroring transport controls when the UI language is Hebrew. [Playback controls](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/java/com/github/damontecres/wholphin/ui/playback/overlay/PlaybackControls.kt#L292).

UI layout, input, and subtitles require separate tests. A browser can support RTL CSS while still mishandling mixed metadata strings or receiving only ASCII input through a remote bridge. A video stream can display Hebrew perfectly while search typing fails. The pinned ws-scrcpy README explicitly identifies ASCII-only text injection. [Bridge documentation](https://github.com/NetrisTV/ws-scrcpy/blob/cd6cea6ebde17af6685c2b325183fc24bef9d52b/README.md).

## Subtitle rendering requirements

MPV's native build includes libass with FriBidi, HarfBuzz, FreeType and line-breaking dependencies. This is useful infrastructure for bidi text and font shaping, but actual glyph fallback and rendered output still need testing. ExoPlayer also has distinct plain-text and Android libass paths. [Pinned native dependency tree](https://github.com/damontecres/wholphin-extensions/blob/cbb4af14c8e61845440ef2281096fc05e8976027/wholphin-mpv/src/native/include/depinfo.sh), [player construction](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/java/com/github/damontecres/wholphin/services/PlayerFactory.kt).

Keep plain SRT/WebVTT, SSA/ASS, and image subtitles as distinct rendering paths. ASS includes font attachments, positioning, effects, timing, and styling that ordinary browser text tracks do not reproduce automatically. JASSUB provides a browser libass renderer and supports a fallback when threading isolation is unavailable. It is an implementation candidate, not a completed Wholphin subtitle port. [JASSUB documentation](https://github.com/ThaUnknown/jassub).

Package and verify the necessary glyph fonts and their licenses. Test Hebrew letters, combining niqqud marks, punctuation, quotes, URLs, digits, English fragments and multi-line wrapping. Do not reverse character strings to simulate RTL. Direction and isolation should be applied at the appropriate text boundary; metadata and embedded URLs may have different directions. [W3C bidi guidance](https://www.w3.org/International/articles/inline-bidi-markup/).

Use the playback presentation clock for subtitle timing. Preserve delay units, sign and scope and test positive/negative delay after seeking, pausing, resuming and switching tracks. MPV, ExoPlayer, streamed output and browser subtitle rendering each need their own timing measurements. Native image subtitles are already rasterized; their opacity, scaling and HDR interaction must still match the reference.

The synthetic [SRT](fixtures/hebrew-mixed.srt) and [ASS](fixtures/hebrew-mixed.ass) fixtures are original test data for the next stage. They include mixed Hebrew/English, numbers, punctuation, combining marks and ASS positioning. They have not yet been rendered through Wholphin or a candidate port. Attached-font and PGS samples still need to be added to the media test set.
