# Contributing

Thanks for sharing your Black Friday deal. Every deal is one JSON file. Open a pull request that
adds a file to this year's folder. A check validates it, a maintainer reviews it, and once it's
merged the deal shows up on [indiegoodies.com/blackfriday](https://indiegoodies.com/blackfriday).

Not comfortable editing JSON? [Submit your deal with the form](../../issues/new/choose) instead.

## What belongs here

**Indie deals only.** The product is made and sold by an independent maker or a small,
self-funded team, and you are that maker (or have their go-ahead).

Not accepted: products from large or venture-backed companies, agencies, marketplaces, resellers,
affiliate or deal-site links, and "deals" that are the regular price.

The deal must be a real Black Friday or Cyber Monday discount, roughly between mid November and
early December.

## Add a deal

Create `2026/<slug>.json`. The slug is the product name in lowercase words joined by hyphens
(`pastepal`, `yoink-for-mac`).

```json
{
  "name": "PastePal",
  "url": "https://indiegoodies.com/pastepal",
  "description": "Universal clipboard manager for Mac, iPhone and iPad",
  "category": "productivity",
  "platforms": ["mac", "ios", "ipad"],
  "deal": "50% off lifetime with code BF26",
  "code": "BF26",
  "pricing": "lifetime",
  "price": { "regular": 14.99, "sale": 7.49, "currency": "USD" },
  "discount": 50,
  "startDate": "2026-11-20",
  "endDate": "2026-12-02",
  "icon": "https://indiegoodies.com/icons/pastepal.png"
}
```

| Field | |
|---|---|
| `name` | Required. The product's name. |
| `url` | Required. Where people get the deal (`https://`). No affiliate links. |
| `description` | Required. What it does, one line, up to 160 characters, no trailing period. |
| `category` | Required. One slug from the table below. |
| `deal` | Required. The offer in a few words, up to 90 characters: "50% off lifetime". |
| `platforms` | Optional. Any of `mac`, `ios`, `ipad`, `watch`, `vision`, `tv`, `android`, `windows`, `linux`, `web`, `chrome`. |
| `code` | Optional. The coupon code, if one is needed. |
| `pricing` | Optional. `lifetime`, `one-time` or `subscription`. |
| `price` | Optional. `regular` and `sale` prices, and the `currency` (`USD`, `EUR`...). |
| `discount` | Optional. Percent off, a whole number. |
| `startDate`, `endDate` | Optional. `YYYY-MM-DD`. The deal is shown as ended after `endDate`. |
| `icon` | Optional. A direct `https://` link to a square icon, at least 128 px. Not a link that expires. |

Use 2-space indent, the key order shown above, and a trailing newline.

### Categories

| Slug | Name |
|---|---|
| `productivity` | Productivity |
| `utilities` | Utilities |
| `writing` | Notes & Writing |
| `ai` | AI |
| `developer-tools` | Developer Tools |
| `design` | Design |
| `media` | Photo, Video & Audio |
| `marketing` | Marketing & SEO |
| `business` | Business & Finance |
| `lifestyle` | Health & Lifestyle |
| `education` | Learning |

## Check locally

With Node 24:

```
npm ci
npm run validate
```

## Pull requests

- One deal per pull request (several products from the same maker are fine in one).
- Fill in the pull request template.
