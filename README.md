# Indie Black Friday

Black Friday and Cyber Monday deals from indie makers: apps, tools, templates, courses and books
built by independent developers and small teams. Browse them at
[indiegoodies.com/blackfriday](https://indiegoodies.com/blackfriday).

Running a deal on something you made? [Add it with a pull request](CONTRIBUTING.md). Every merged
pull request is published to the site automatically.

## Layout

```
categories.json          the categories, in display order
2026/<slug>.json         one deal, in the folder of its year
schema/*.schema.json     JSON Schema of each file
scripts/validate.mjs     the check that runs on every pull request
```

Older years stay in place, so the site can show past Black Fridays.
