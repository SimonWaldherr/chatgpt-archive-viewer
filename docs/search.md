# Search reference

The archive viewer searches conversation titles and the text of every message. Search is case-insensitive and diacritic-insensitive: for example, `cafe` finds `Café`, and `uber` finds `über`.

## Text queries

| Query | Meaning |
| --- | --- |
| `python api` | Both words must occur in the conversation |
| `"machine learning"` | The exact phrase must occur |
| `python -error` | `python` must occur and `error` must not occur |
| `python/javascript` | At least one slash-separated word must occur |
| `python OR javascript` | At least one of the terms must occur |

`OR` applies to free-text terms. Multiple groups and ordinary terms can be combined: `api python OR javascript -deprecated` means that `api` must occur, either `python` or `javascript` must occur, and `deprecated` must not occur.

## Field filters

| Filter | Meaning | Example |
| --- | --- | --- |
| `title:` | Search only the conversation title | `title:"release notes"` |
| `from:` | Require at least one message from an author | `from:user`, `from:assistant`, `from:tool` |
| `model:` | Require a model used in the conversation | `model:gpt-4o` |
| `has:` | Require a content type | `has:code`, `has:image`, `has:audio`, `has:attachment` |
| `is:` | Filter archive status | `is:archived`, `is:active` |
| `messages:` | Filter by message count | `messages:20`, `messages:>20`, `messages:10..50` |
| `created:` | Match the creation period | `created:2025`, `created:2025-06`, `created:2025-06-15` |
| `updated:` | Match the last-change period | `updated:2026-01` |
| `after:` | Last change on or after a date | `after:2025-01-01` |
| `before:` | Last change strictly before a date | `before:2026-01-01` |

Model matching is partial, so `model:gpt-4` can match identifiers such as `gpt-4o`. `from:assistant` is an alias for the displayed `ChatGPT` author.

Message-count comparisons support `>`, `>=`, `<`, `<=`, an exact number, and inclusive ranges:

```text
messages:>=50
messages:10..25
```

## Combining filters

Filters and text terms use AND semantics. This query finds active conversations created in 2025, containing code, with more than 20 messages and the exact phrase “archive viewer”:

```text
"archive viewer" created:2025 has:code messages:>20 is:active
```

Another example finds conversations changed during January 2026 that contain a user message and used a GPT-4 model:

```text
updated:2026-01 from:user model:gpt-4
```

## Date behavior

- Dates use the browser's local timezone.
- `created:` checks the export's creation timestamp and falls back to the first message timestamp.
- `updated:` checks the export's update timestamp and falls back to the last message timestamp.
- `after:` and `before:` operate on the last-change timestamp.
- A year or month denotes the complete period. For example, `created:2025` matches the whole year 2025.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `/` | Focus the search field |
| `Escape` | Clear and leave the search field |
