# Wholphin database schema

Generated from upstream commit `d6523ce856f7066c35bc9df8b514a8d6b876f06c`, Room schema version 35.

Columns include identifiers and authentication metadata. The schema also stores serialized JSON objects whose inner fields are defined in Kotlin. Never put real stored credentials into a research fixture.

## servers

| Property | Column | SQLite type | Nullable | Primary key |
| --- | --- | --- | --- | --- |
| `id` | `id` | TEXT | No | Yes |
| `name` | `name` | TEXT | Yes | No |
| `url` | `url` | TEXT | No | No |
| `version` | `version` | TEXT | Yes | No |
| `lastUsed` | `lastUsed` | TEXT | Yes | No |

## users

| Property | Column | SQLite type | Nullable | Primary key |
| --- | --- | --- | --- | --- |
| `rowId` | `rowId` | INTEGER | No | Yes |
| `id` | `id` | TEXT | No | No |
| `name` | `name` | TEXT | Yes | No |
| `serverId` | `serverId` | TEXT | No | No |
| `accessToken` | `accessToken` | TEXT | Yes | No |
| `pin` | `pin` | TEXT | Yes | No |
| `requireLogin` | `requireLogin` | INTEGER | No | No |
| `lastUsed` | `lastUsed` | TEXT | Yes | No |
| `uiLanguage` | `uiLanguage` | TEXT | Yes | No |
| `appPreferences.preferredAudioLanguage` | `preferredAudioLanguage` | TEXT | No | No |
| `appPreferences.preferredSubtitleLanguage` | `preferredSubtitleLanguage` | TEXT | No | No |
| `appPreferences.subtitleMode` | `subtitleMode` | TEXT | No | No |

## ItemPlayback

| Property | Column | SQLite type | Nullable | Primary key |
| --- | --- | --- | --- | --- |
| `rowId` | `rowId` | INTEGER | No | Yes |
| `userId` | `userId` | INTEGER | No | No |
| `itemId` | `itemId` | TEXT | No | No |
| `sourceId` | `sourceId` | TEXT | Yes | No |
| `audioIndex` | `audioIndex` | INTEGER | No | No |
| `subtitleIndex` | `subtitleIndex` | INTEGER | No | No |

## NavDrawerPinnedItem

| Property | Column | SQLite type | Nullable | Primary key |
| --- | --- | --- | --- | --- |
| `userId` | `userId` | INTEGER | No | Yes |
| `itemId` | `itemId` | TEXT | No | Yes |
| `type` | `type` | TEXT | No | No |
| `order` | `order` | INTEGER | No | No |

## LibraryDisplayInfo

| Property | Column | SQLite type | Nullable | Primary key |
| --- | --- | --- | --- | --- |
| `userId` | `userId` | INTEGER | No | Yes |
| `itemId` | `itemId` | TEXT | No | Yes |
| `sort` | `sort` | TEXT | No | No |
| `direction` | `direction` | TEXT | No | No |
| `filter` | `filter` | TEXT | No | No |
| `viewOptions` | `viewOptions` | TEXT | Yes | No |

## playback_effects

| Property | Column | SQLite type | Nullable | Primary key |
| --- | --- | --- | --- | --- |
| `jellyfinUserRowId` | `jellyfinUserRowId` | INTEGER | No | Yes |
| `itemId` | `itemId` | TEXT | No | Yes |
| `type` | `type` | TEXT | No | Yes |
| `videoFilter.rotation` | `rotation` | INTEGER | No | No |
| `videoFilter.brightness` | `brightness` | INTEGER | No | No |
| `videoFilter.contrast` | `contrast` | INTEGER | No | No |
| `videoFilter.saturation` | `saturation` | INTEGER | No | No |
| `videoFilter.hue` | `hue` | INTEGER | No | No |
| `videoFilter.red` | `red` | INTEGER | No | No |
| `videoFilter.green` | `green` | INTEGER | No | No |
| `videoFilter.blue` | `blue` | INTEGER | No | No |
| `videoFilter.blur` | `blur` | INTEGER | No | No |

## PlaybackLanguageChoice

| Property | Column | SQLite type | Nullable | Primary key |
| --- | --- | --- | --- | --- |
| `userId` | `userId` | INTEGER | No | Yes |
| `seriesId` | `seriesId` | TEXT | No | Yes |
| `itemId` | `itemId` | TEXT | Yes | No |
| `audioLanguage` | `audioLanguage` | TEXT | Yes | No |
| `subtitleLanguage` | `subtitleLanguage` | TEXT | Yes | No |
| `subtitlesDisabled` | `subtitlesDisabled` | INTEGER | Yes | No |

## ItemTrackModification

| Property | Column | SQLite type | Nullable | Primary key |
| --- | --- | --- | --- | --- |
| `userId` | `userId` | INTEGER | No | Yes |
| `itemId` | `itemId` | TEXT | No | Yes |
| `trackIndex` | `trackIndex` | INTEGER | No | Yes |
| `delayMs` | `delayMs` | INTEGER | No | No |

## seerr_servers

| Property | Column | SQLite type | Nullable | Primary key |
| --- | --- | --- | --- | --- |
| `id` | `id` | INTEGER | No | Yes |
| `url` | `url` | TEXT | No | No |
| `name` | `name` | TEXT | Yes | No |
| `version` | `version` | TEXT | Yes | No |

## seerr_users

| Property | Column | SQLite type | Nullable | Primary key |
| --- | --- | --- | --- | --- |
| `jellyfinUserRowId` | `jellyfinUserRowId` | INTEGER | No | Yes |
| `serverId` | `serverId` | INTEGER | No | Yes |
| `authMethod` | `authMethod` | TEXT | No | No |
| `username` | `username` | TEXT | Yes | No |
| `password` | `password` | TEXT | Yes | No |
| `credential` | `credential` | TEXT | Yes | No |

## RememberedTab

| Property | Column | SQLite type | Nullable | Primary key |
| --- | --- | --- | --- | --- |
| `userId` | `userId` | INTEGER | No | Yes |
| `itemId` | `itemId` | TEXT | No | Yes |
| `index` | `index` | INTEGER | No | No |

[Original schema](https://github.com/damontecres/Wholphin/blob/d6523ce856f7066c35bc9df8b514a8d6b876f06c/app/schemas/com.github.damontecres.wholphin.data.AppDatabase/35.json).
