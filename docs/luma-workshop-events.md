# Luma Workshop Events

Workshop events for Agentic Conf Hamburg 2026 are managed as **private (unlisted)** Luma events linked to the main conference calendar. Participants access them via direct links on the conference dashboard.

## Events Overview

| Workshop | Speaker | Event ID | Luma Link |
|---|---|---|---|
| Create Your Own RPG with Agentic AI using Strands Agents | Arnaud Jean | `evt-SMVQuaeXooPzGJ1` | https://luma.com/110uhq2i |
| What if building faster just means building the wrong thing faster? | Christoph Steinlehner | `evt-gS2aAAP4qLSAOrD` | https://luma.com/0plg8o36 |
| Why, and how you need to sandbox AI-Generated Code? | Harshil Agrawal | `evt-tHqoP7jcmDFYUY1` | https://luma.com/15ntjibp |
| Turn Your Agent Into Your Own Nemesis | Tereza Iofciu | `evt-lFfWNDw6hgu5AIC` | https://luma.com/2uxjdzfa |

**Main conference event:** `evt-cMXpanFfLBNrXtG` — https://lu.ma/45lfeyeh
**Calendar ID:** `cal-D84cnqjePTZrEJl`

## Configuration

- **Visibility:** Private (unlisted) — only accessible via direct link
- **Capacity:** 15 participants per workshop
- **Location:** SAE Institute Hamburg, Feldstraße 66, 20359 Hamburg
- **Time:** March 22, 2026 (times are placeholder 10:00–11:30 CET — update when schedule is set)

## API Reference

All requests use:
- **Base URL:** `https://public-api.lu.ma/public/v1`
- **Auth header:** `x-luma-api-key: <API_KEY>`
- **Content-Type:** `application/json`

### Update an event

```bash
curl -X POST "https://public-api.lu.ma/public/v1/event/update" \
  -H "x-luma-api-key: $LUMA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "event_api_id": "evt-SMVQuaeXooPzGJ1",
    "name": "Workshop: New Title Here",
    "start_at": "2026-03-22T14:00:00+01:00",
    "end_at": "2026-03-22T15:30:00+01:00"
  }'
```

Common updatable fields: `name`, `description_md`, `start_at`, `end_at`, `visibility`.

### Update ticket capacity

Each event has a "Standard" ticket type. To change the max capacity:

```bash
# 1. Get the ticket type ID
curl "https://public-api.lu.ma/public/v1/event/ticket-types/list?event_api_id=evt-SMVQuaeXooPzGJ1" \
  -H "x-luma-api-key: $LUMA_API_KEY"

# 2. Update capacity (use the evtticktyp-* ID from step 1)
curl -X POST "https://public-api.lu.ma/public/v1/event/ticket-types/update" \
  -H "x-luma-api-key: $LUMA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "event_api_id": "evt-SMVQuaeXooPzGJ1",
    "event_ticket_type_api_id": "evtticktyp-M2oNdLGtsrFmLJO",
    "max_capacity": 20
  }'
```

Ticket type IDs:

| Event | Ticket Type ID |
|---|---|
| RPG Workshop | `evtticktyp-M2oNdLGtsrFmLJO` |
| Building Faster Workshop | `evtticktyp-8QGbSWJ7CnaOh51` |
| Sandbox Workshop | `evtticktyp-f7BtYirdEb7wuT9` |
| Nemesis Workshop | `evtticktyp-jqOZ0HeBHg5YZpN` |

### Create a new workshop event

```bash
curl -X POST "https://public-api.lu.ma/public/v1/event/create" \
  -H "x-luma-api-key: $LUMA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Workshop: Title Here",
    "description_md": "Description in **markdown**.\n\n**Speaker:** Name\n\n---\n\n*This workshop is part of [Agentic Conf Hamburg 2026](https://lu.ma/45lfeyeh). You need a conference ticket to attend.*",
    "start_at": "2026-03-22T10:00:00+01:00",
    "end_at": "2026-03-22T11:30:00+01:00",
    "timezone": "Europe/Berlin",
    "visibility": "private",
    "calendar_id": "cal-D84cnqjePTZrEJl",
    "geo_address_json": {
      "type": "google",
      "place_id": "ChIJDWyHFmuPsUcRCG1yuSlwVOQ",
      "address": "SAE Institute Hamburg",
      "city": "Hamburg",
      "region": "Hamburg",
      "country": "DE",
      "city_state": "Hamburg, Hamburg",
      "full_address": "SAE Institute Hamburg, Feldstraße 66 2. Etage im Medienbunker, 20359 Hamburg, Germany",
      "description": "Medienbunker / U Feldstr"
    },
    "geo_latitude": "53.5563181",
    "geo_longitude": "9.970071899999999"
  }'
```

After creating, set the capacity on the auto-created ticket type (see "Update ticket capacity" above).

### Get event details

```bash
curl "https://public-api.lu.ma/public/v1/event/get?api_id=evt-SMVQuaeXooPzGJ1" \
  -H "x-luma-api-key: $LUMA_API_KEY"
```

## Syncing with the Website

Workshop data for the dashboard lives in `src/data/workshops.ts`. When adding or updating workshops:

1. Create/update the Luma event via API
2. Update `src/data/workshops.ts` with the new event details (`lumaEventId`, `lumaUrl`, title, description, etc.)
3. Deploy
