#!/usr/bin/env node
// Validates categories.json and every <year>/<slug>.json deal. Exits 1 and lists every problem.
//
// Usage: node scripts/validate.mjs [repo dir]   (defaults to the repo this script is in)

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const root = resolve(process.argv[2] ?? join(import.meta.dirname, '..'))
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
const YEAR = /^20\d\d$/
// Top-level entries that aren't year folders.
const KNOWN = new Set(['.git', '.github', '.gitignore', 'node_modules', 'schema', 'scripts', 'categories.json', 'package.json', 'package-lock.json', 'README.md', 'CONTRIBUTING.md', 'LICENSE'])

const errors = []
const error = (file, message) => errors.push(`${file}: ${message}`)

const ajv = new Ajv2020({ allErrors: true, strict: true })
addFormats(ajv, ['uri', 'date'])
const schema = (kind) => ajv.compile(JSON.parse(readFileSync(join(root, 'schema', `${kind}.schema.json`), 'utf8')))
const validators = { categories: schema('categories'), deal: schema('deal') }

function load(file, kind) {
  let value
  try {
    value = JSON.parse(readFileSync(join(root, file), 'utf8'))
  } catch (e) {
    error(file, `not valid JSON: ${e.message}`)
    return undefined
  }
  if (validators[kind](value)) return value
  for (const e of validators[kind].errors) {
    const extra = e.params?.additionalProperty ? ` "${e.params.additionalProperty}"` : ''
    error(file, `${e.instancePath || '(root)'} ${e.message}${extra}`)
  }
  return undefined
}

const categories = load('categories.json', 'categories') ?? []
const categorySlugs = new Set(categories.map((c) => c.slug))
if (categorySlugs.size !== categories.length) error('categories.json', 'duplicate slug')

/** The url without tracking parameters, fragment or trailing slash, to spot the same deal twice. */
function canonicalUrl(value) {
  const url = new URL(value)
  for (const key of [...url.searchParams.keys()]) if (/^(utm_|ref$|via$)/.test(key)) url.searchParams.delete(key)
  url.hash = ''
  return url.toString().replace(/\/$/, '').toLowerCase()
}

let count = 0
for (const entry of readdirSync(root).sort()) {
  if (KNOWN.has(entry)) continue
  if (!YEAR.test(entry) || !statSync(join(root, entry)).isDirectory()) {
    error(entry, 'unexpected entry (deals go in a year folder like 2026/)')
    continue
  }
  const urls = new Map()
  for (const name of readdirSync(join(root, entry)).sort()) {
    const file = `${entry}/${name}`
    if (name === '.gitkeep') continue
    if (!name.endsWith('.json')) {
      error(file, 'unexpected file (only <slug>.json belongs here)')
      continue
    }
    const slug = name.slice(0, -5)
    if (!SLUG.test(slug)) error(file, `"${slug}" is not a valid file name (lowercase words joined by hyphens)`)
    const deal = load(file, 'deal')
    if (!deal) continue
    count++
    if (!categorySlugs.has(deal.category)) error(file, `unknown category "${deal.category}" (see categories.json)`)
    if (deal.startDate && deal.startDate.slice(0, 4) !== entry) error(file, `startDate ${deal.startDate} is not in ${entry}`)
    if (deal.startDate && deal.endDate && deal.endDate < deal.startDate) error(file, 'endDate is before startDate')
    if (deal.price && deal.price.sale >= deal.price.regular) error(file, 'price.sale must be lower than price.regular')
    const key = canonicalUrl(deal.url)
    if (urls.has(key)) error(file, `same url as ${urls.get(key)}`)
    urls.set(key, file)
  }
}

if (errors.length) {
  console.error(`${errors.length} problem(s):`)
  for (const e of errors) console.error(`  ${e}`)
  process.exit(1)
}
console.log(`OK: ${count} deals in ${categories.length} categories.`)
