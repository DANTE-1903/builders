# Builders App — API Endpoints

This app is **read-only**. It displays builders and projects that are created and
managed in the main Boundless app. Every read comes from the shared
`boundless-nestjs` backend, so this app and boundless-platform stay consistent
(a project or user followed in the platform is read here from the same data).

Profiles, project pages, and organization pages live in the main Boundless app.
This app links out to them rather than rendering them. See
[Main app pages we link to](#main-app-pages-we-link-to).

The public read API was implemented by the backend team. This document mirrors
`boundless-nestjs/docs/builders-public-reads.md` and maps each endpoint to the
screen that uses it. If the two ever drift, the backend doc is the source of
truth.

## Rules and conventions

- This app calls **`GET` endpoints only**. All writes (follow, create, edit,
  upload) stay in boundless-platform.
- Follows and profiles are stored once and shared. We reuse the same reads, we
  do not duplicate the data model.
- **Prefix:** every path is served under the global `/api` prefix. `GET /projects`
  is `GET /api/projects`. Base URL comes from `NEXT_PUBLIC_API_URL`
  (staging: `https://stage-api.boundlessfi.xyz`).
- **Auth:** the backend runs a global session guard. These routes opt out with
  `@AllowAnonymous()`, so they are public. Personalize-if-present routes use
  `@OptionalAuth()`.
- **No PII:** public reads never return `email` or other sensitive account
  fields. Identity and user-authored public profile fields only.
- **Pagination:** list responses return
  `{ data, pagination: { page, limit, total, totalPages, hasNext, hasPrev } }`.

## Status legend

- **Public**: implemented and public. Use directly.

---

## `/` — Home / Landing

| Endpoint | Purpose | Status |
| --- | --- | --- |
| `GET /users/top-builders` | Top builders row. Card-ready. Accepts `limit`. | Public |
| `GET /projects/featured` | Featured projects row | Public |
| `GET /users/directory?limit=1` | Stats strip count (`pagination.total`) | Public |
| `GET /projects?limit=1` | Stats strip count (`pagination.total`) | Public |

> **Top builders:** use `GET /users/top-builders`. It returns a flat array of
> card-ready builders in the standard `{ success, message, data, meta }`
> envelope, with everything `BuilderCardView` needs:
>
> ```json
> { "id", "name", "username", "image", "role", "location",
>   "country", "skills": [], "followers": 0, "projects": 0 }
> ```
>
> Map: `name` -> displayName, `image` -> avatarSrc, `location` -> location,
> `skills`/`followers`/`projects` straight across. Do **not** map `role` (it is
> the account role, e.g. `"user"`, not a professional title).
>
> The stats strip derives its Builders and Projects counts from the
> `pagination.total` of `GET /users/directory` and `GET /projects` (each called
> with `limit=1`).

---

## `/builders` — Builders Directory

| Endpoint | Purpose | Status |
| --- | --- | --- |
| `GET /users/directory` | Public builders directory. Filters: `country`, `skills` (repeatable/CSV), `status`, `search`, `sort` (`name_asc\|name_desc\|newest\|oldest`), `page`, `limit`. Public profiles only. | Public |
| `GET /users/filters` | Facets: `skills[]`, `countries[]` (with counts), `statuses[]` | Public |

> The directory is `GET /users/directory`, **not** `GET /users`. `GET /users` is
> Admin-only and is not used by this app.
>
> **Who is listed:** the directory returns only people who qualify as builders: a
> username, an avatar, at least one skill, not a staff account, and at least one
> piece of real work on Boundless (a published project, a hackathon entry, a
> bounty submission, a win, or a grant award). Signing up or creating an
> organization alone does not get someone listed. This app does not filter
> anything itself; the rule lives in the API.

---

## Main app pages we link to

This app renders directories only. The detail pages for a builder, a project,
and an organization live in the main Boundless app, and cards link to them there:

| Entity | Main app page |
| --- | --- |
| Builder | `https://boundlessfi.xyz/profile/<username>` |
| Project | `https://boundlessfi.xyz/projects/<slug>` |
| Organization | `https://boundlessfi.xyz/organizations/<slug>` |
| Projects directory | `https://boundlessfi.xyz/projects` |

The origin comes from `NEXT_PUBLIC_BOUNDLESS_APP_URL` (fallback
`https://boundlessfi.xyz`). These routes are not built in this app.

---

### Not built here (boundary)

`POST` / `DELETE /follows/:entityType/:entityId` and every other write stay in
boundless-platform. This app never calls them.

---

## Backend schema notes

From migration `20260725000000_builders_public_reads`:

- `BuilderStatus` enum (`AVAILABLE`, `OPEN_TO_WORK`, `BUSY`, `UNAVAILABLE`) and
  indexed `UserProfile.country` / `UserProfile.status` back the directory filters
  and facets.

## Shared data

Follows and profiles are stored once and read by both apps. A user or project
followed in boundless-platform is read here through the same endpoints. Nothing
is duplicated.
