import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL || !/^postgres(ql)?:\/\//.test(process.env.DATABASE_URL)) {
  throw new Error('DATABASE_URL must be a valid Neon Postgres connection string')
}

const sql = neon(process.env.DATABASE_URL)
const directory = resolve(process.cwd(), 'db', 'migrations')
for (const filename of readdirSync(directory).filter((name) => name.endsWith('.sql')).sort()) {
  const content = readFileSync(resolve(directory, filename), 'utf8')
  const statements = content.split(';').map(s => s.trim()).filter(Boolean)
  for (const statement of statements) {
    await sql.query(statement)
  }
  console.log(`Applied ${filename}`)
}
