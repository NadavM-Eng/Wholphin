# Wholphin persisted preference schema

Generated from upstream commit `d6523ce856f7066c35bc9df8b514a8d6b876f06c` by `tools/research/source-inventory.mjs`.

These are schema declarations, including nested objects, identifiers and deprecated fields. Runtime defaults come from AppPreferencesSerializer, preference declarations and upgrade logic, not only proto3 defaults.

## MpvOptions

| Field | Type | Tag | Deprecated | Source |
| --- | --- | ---: | --- | --- |
| `enable_hardware_decoding` | `bool` | 1 | No | [Line 41](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L41) |
| `use_gpu_next` | `bool` | 2 | No | [Line 42](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L42) |

## PlaybackOverrides

| Field | Type | Tag | Deprecated | Source |
| --- | --- | ---: | --- | --- |
| `ac3_supported` | `bool` | 1 | No | [Line 52](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L52) |
| `downmix_stereo` | `bool` | 2 | No | [Line 53](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L53) |
| `direct_play_ass` | `bool` | 3 | Yes | [Line 54](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L54) |
| `direct_play_pgs` | `bool` | 4 | No | [Line 55](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L55) |
| `media_extensions_enabled` | `MediaExtensionStatus` | 5 | No | [Line 56](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L56) |
| `direct_play_dolby_vision_e_l` | `bool` | 6 | No | [Line 57](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L57) |
| `decode_av1` | `bool` | 7 | No | [Line 58](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L58) |
| `ass_playback_mode` | `AssPlaybackMode` | 8 | No | [Line 59](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L59) |
| `max_resolution` | `int32` | 9 | No | [Line 60](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L60) |

## PlaybackPreferences

| Field | Type | Tag | Deprecated | Source |
| --- | --- | ---: | --- | --- |
| `skip_forward_ms` | `int64` | 1 | No | [Line 64](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L64) |
| `skip_back_ms` | `int64` | 2 | No | [Line 65](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L65) |
| `controller_timeout_ms` | `int64` | 3 | No | [Line 66](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L66) |
| `seek_bar_steps` | `int32` | 4 | No | [Line 67](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L67) |
| `show_debug_info` | `bool` | 5 | No | [Line 68](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L68) |
| `auto_play_next` | `bool` | 6 | No | [Line 69](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L69) |
| `auto_play_next_delay_seconds` | `int64` | 7 | No | [Line 70](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L70) |
| `skip_back_on_resume_seconds` | `int64` | 8 | No | [Line 71](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L71) |
| `max_bitrate` | `int64` | 9 | No | [Line 72](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L72) |
| `skip_intros` | `SkipSegmentBehavior` | 10 | No | [Line 74](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L74) |
| `skip_outros` | `SkipSegmentBehavior` | 11 | No | [Line 75](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L75) |
| `skip_commercials` | `SkipSegmentBehavior` | 12 | No | [Line 76](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L76) |
| `skip_recaps` | `SkipSegmentBehavior` | 13 | No | [Line 77](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L77) |
| `skip_previews` | `SkipSegmentBehavior` | 14 | No | [Line 78](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L78) |
| `overrides` | `PlaybackOverrides` | 15 | No | [Line 80](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L80) |
| `pass_out_protection_ms` | `int64` | 16 | No | [Line 81](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L81) |
| `global_content_scale` | `PrefContentScale` | 17 | No | [Line 82](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L82) |
| `show_next_up_when` | `ShowNextUpWhen` | 18 | No | [Line 83](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L83) |
| `one_click_pause` | `bool` | 19 | No | [Line 84](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L84) |
| `player_backend` | `PlayerBackend` | 20 | No | [Line 85](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L85) |
| `mpv_options` | `MpvOptions` | 21 | No | [Line 86](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L86) |
| `refresh_rate_switching` | `bool` | 22 | No | [Line 87](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L87) |
| `resolution_switching` | `bool` | 23 | No | [Line 88](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L88) |
| `external_player` | `string` | 24 | No | [Line 89](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L89) |
| `cinema_mode` | `bool` | 25 | No | [Line 90](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L90) |
| `dpad_seek_mode` | `DpadSeekMode` | 26 | No | [Line 91](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L91) |

## HomePagePreferences

| Field | Type | Tag | Deprecated | Source |
| --- | --- | ---: | --- | --- |
| `max_items_per_row` | `int32` | 1 | No | [Line 101](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L101) |
| `enable_rewatching_next_up` | `bool` | 2 | No | [Line 102](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L102) |
| `combine_continue_next` | `bool` | 3 | Yes | [Line 103](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L103) |
| `max_days_next_up` | `int32` | 4 | No | [Line 104](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L104) |
| `click_to_play` | `bool` | 5 | No | [Line 105](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L105) |

## SubtitlePreferences

| Field | Type | Tag | Deprecated | Source |
| --- | --- | ---: | --- | --- |
| `font_size` | `int32` | 1 | No | [Line 141](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L141) |
| `font_color` | `int32` | 2 | No | [Line 142](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L142) |
| `font_opacity` | `int32` | 3 | No | [Line 143](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L143) |
| `edge_color` | `int32` | 4 | No | [Line 144](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L144) |
| `edge_style` | `EdgeStyle` | 5 | No | [Line 145](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L145) |
| `background_color` | `int32` | 6 | No | [Line 146](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L146) |
| `background_opacity` | `int32` | 7 | No | [Line 147](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L147) |
| `background_style` | `BackgroundStyle` | 8 | No | [Line 148](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L148) |
| `font_bold` | `bool` | 9 | No | [Line 149](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L149) |
| `font_italic` | `bool` | 10 | No | [Line 150](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L150) |
| `margin` | `int32` | 11 | No | [Line 151](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L151) |
| `edge_thickness` | `int32` | 12 | No | [Line 152](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L152) |
| `image_subtitle_opacity` | `int32` | 13 | No | [Line 153](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L153) |
| `use_separate_hdr` | `bool` | 14 | No | [Line 154](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L154) |

## LiveTvPreferences

| Field | Type | Tag | Deprecated | Source |
| --- | --- | ---: | --- | --- |
| `show_header` | `bool` | 1 | No | [Line 158](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L158) |
| `favorite_channels_at_beginning` | `bool` | 2 | No | [Line 159](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L159) |
| `sort_by_recently_watched` | `bool` | 3 | No | [Line 160](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L160) |
| `color_code_programs` | `bool` | 4 | No | [Line 161](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L161) |

## ScreensaverPreferences

| Field | Type | Tag | Deprecated | Source |
| --- | --- | ---: | --- | --- |
| `start_delay` | `int64` | 1 | No | [Line 171](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L171) |
| `duration` | `int64` | 2 | No | [Line 172](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L172) |
| `animate` | `bool` | 3 | No | [Line 173](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L173) |
| `max_age_filter` | `int32` | 4 | No | [Line 174](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L174) |
| `enabled` | `bool` | 5 | No | [Line 175](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L175) |
| `item_types` | `repeated string` | 6 | No | [Line 176](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L176) |
| `show_clock` | `bool` | 7 | No | [Line 177](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L177) |
| `dim_enabled` | `bool` | 8 | No | [Line 178](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L178) |
| `dim_percent` | `int32` | 9 | No | [Line 179](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L179) |

## SearchPreferences

| Field | Type | Tag | Deprecated | Source |
| --- | --- | ---: | --- | --- |
| `combined_search_results` | `bool` | 1 | No | [Line 183](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L183) |
| `show_voice_search_button` | `bool` | 2 | No | [Line 184](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L184) |

## InterfacePreferences

| Field | Type | Tag | Deprecated | Source |
| --- | --- | ---: | --- | --- |
| `play_theme_songs` | `ThemeSongVolume` | 1 | No | [Line 194](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L194) |
| `remember_selected_tab` | `bool` | 2 | No | [Line 195](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L195) |
| `remembered_tabs` | `map<string, int32>` | 3 | Yes | [Line 196](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L196) |
| `app_theme_colors` | `AppThemeColors` | 4 | No | [Line 197](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L197) |
| `nav_drawer_switch_on_focus` | `bool` | 5 | No | [Line 198](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L198) |
| `show_clock` | `bool` | 6 | No | [Line 199](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L199) |
| `subtitles_preferences` | `SubtitlePreferences` | 7 | No | [Line 200](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L200) |
| `live_tv_preferences` | `LiveTvPreferences` | 8 | No | [Line 201](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L201) |
| `backdrop_style` | `BackdropStyle` | 9 | No | [Line 202](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L202) |
| `hdr_subtitles_preferences` | `SubtitlePreferences` | 10 | No | [Line 203](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L203) |
| `screensaver_preference` | `ScreensaverPreferences` | 11 | No | [Line 204](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L204) |
| `enable_media_management` | `bool` | 12 | No | [Line 205](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L205) |
| `show_logos` | `bool` | 13 | No | [Line 206](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L206) |
| `search_preferences` | `SearchPreferences` | 14 | No | [Line 207](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L207) |
| `display_toggles` | `repeated DisplayToggle` | 15 | No | [Line 208](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L208) |

## AdvancedPreferences

| Field | Type | Tag | Deprecated | Source |
| --- | --- | ---: | --- | --- |
| `image_disk_cache_size_bytes` | `int64` | 1 | No | [Line 212](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L212) |

## PhotoPreferences

| Field | Type | Tag | Deprecated | Source |
| --- | --- | ---: | --- | --- |
| `slideshow_duration` | `int64` | 1 | No | [Line 216](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L216) |
| `slideshow_play_videos` | `bool` | 2 | No | [Line 217](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L217) |

## MusicPreferences

| Field | Type | Tag | Deprecated | Source |
| --- | --- | ---: | --- | --- |
| `show_lyrics` | `bool` | 1 | No | [Line 221](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L221) |
| `show_visualizer` | `bool` | 2 | No | [Line 222](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L222) |
| `show_album_Art` | `bool` | 3 | No | [Line 223](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L223) |
| `show_backdrop` | `bool` | 4 | No | [Line 224](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L224) |

## ExperimentalPreferences

| Field | Type | Tag | Deprecated | Source |
| --- | --- | ---: | --- | --- |
| `enabled` | `bool` | 1 | No | [Line 228](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L228) |
| `video_tunneling_enabled` | `bool` | 2 | No | [Line 229](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L229) |
| `prefer_ac3_surround` | `bool` | 3 | No | [Line 230](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L230) |
| `disable_audio_offload` | `bool` | 4 | No | [Line 231](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L231) |
| `prefer_dolby_vision_over_hdr10_plus` | `bool` | 5 | No | [Line 232](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L232) |

## AppPreferences

| Field | Type | Tag | Deprecated | Source |
| --- | --- | ---: | --- | --- |
| `current_server_id` | `string` | 1 | No | [Line 237](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L237) |
| `current_user_id` | `string` | 2 | No | [Line 238](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L238) |
| `playback_preferences` | `PlaybackPreferences` | 3 | No | [Line 240](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L240) |
| `home_page_preferences` | `HomePagePreferences` | 4 | No | [Line 241](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L241) |
| `interface_preferences` | `InterfacePreferences` | 5 | No | [Line 242](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L242) |
| `auto_check_for_updates` | `bool` | 6 | No | [Line 244](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L244) |
| `update_url` | `string` | 7 | No | [Line 245](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L245) |
| `send_crash_reports` | `bool` | 8 | No | [Line 246](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L246) |
| `debug_logging` | `bool` | 9 | No | [Line 247](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L247) |
| `advanced_preferences` | `AdvancedPreferences` | 10 | No | [Line 248](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L248) |
| `sign_in_automatically` | `bool` | 11 | No | [Line 249](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L249) |
| `photo_preferences` | `PhotoPreferences` | 12 | No | [Line 250](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L250) |
| `music_preferences` | `MusicPreferences` | 13 | No | [Line 251](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L251) |
| `experimental_preferences` | `ExperimentalPreferences` | 14 | No | [Line 252](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L252) |

## Enumerations

### ShowNextUpWhen

[Definition](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L6).

- `END_OF_PLAYBACK` = 0
- `DURING_CREDITS` = 1
- `NEXT_UP_NEVER` = 2

### SkipSegmentBehavior

[Definition](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L12).

- `IGNORE` = 0
- `AUTO_SKIP` = 1
- `ASK_TO_SKIP` = 2

### PrefContentScale

[Definition](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L18).

- `FIT` = 0
- `NONE` = 1
- `CROP` = 2
- `FILL` = 3
- `Fill_WIDTH` = 4
- `FILL_HEIGHT` = 5

### MediaExtensionStatus

[Definition](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L27).

- `MES_FALLBACK` = 0
- `MES_PREFERRED` = 1
- `MES_DISABLED` = 2

### PlayerBackend

[Definition](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L33).

- `EXO_PLAYER` = 0
- `MPV` = 1
- `PREFER_MPV` = 2
- `EXTERNAL_PLAYER` = 3

### AssPlaybackMode

[Definition](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L45).

- `ASS_LIBASS` = 0
- `ASS_EXO_PLAYER` = 1
- `ASS_TRANSCODE` = 2

### DpadSeekMode

[Definition](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L94).

- `SEEKBAR_MINIMAL` = 0
- `SEEKBAR_TRICKPLAY` = 1
- `SEEKBAR_NONE` = 2

### ThemeSongVolume

[Definition](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L108).

- `DISABLED` = 0
- `LOWEST` = 1
- `LOW` = 2
- `MEDIUM` = 3
- `HIGH` = 4
- `HIGHEST` = 5

### AppThemeColors

[Definition](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L117).

- `PURPLE` = 0
- `BLUE` = 1
- `GREEN` = 2
- `ORANGE` = 3
- `BOLD_BLUE` = 4
- `OLED_BLACK` = 5
- `RED` = 6
- `BROWN` = 7

### EdgeStyle

[Definition](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L128).

- `EDGE_NONE` = 0
- `EDGE_SOLID` = 1
- `EDGE_SHADOW` = 2

### BackgroundStyle

[Definition](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L134).

- `BG_NONE` = 0
- `BG_WRAP` = 1
- `BG_BOXED` = 2

### BackdropStyle

[Definition](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L164).

- `BACKDROP_DYNAMIC_COLOR` = 0
- `BACKDROP_IMAGE_ONLY` = 1
- `BACKDROP_NONE` = 2

### DisplayToggle

[Definition](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/src/main/proto/WholphinDataStore.proto#L187).

- `OFFICIAL_RATING` = 0
- `CRITIC_RATING` = 1
- `COMMUNITY_RATING` = 2
