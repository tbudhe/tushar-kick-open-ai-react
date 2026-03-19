#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const envFile = process.env.ENV_FILE || '.env';
const requestedKeys = process.argv.slice(2);

function runRailwayCommand(args) {
  return execFileSync('railway', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function parseDotEnv(content) {
  return content.split(/\r?\n/);
}

function formatEnvValue(value) {
  if (value === '') {
    return '';
  }

  if (/^[A-Za-z0-9_./:@-]+$/.test(value)) {
    return value;
  }

  return `"${value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/"/g, '\\"')}"`;
}

function maskValue(value) {
  if (value.length <= 4) {
    return '****';
  }
  return `${value.slice(0, 2)}****${value.slice(-2)}`;
}

function updateEnvLines(lines, key, value) {
  const formatted = `${key}=${formatEnvValue(value)}`;
  const pattern = new RegExp(`^${key}=`);
  const index = lines.findIndex((line) => pattern.test(line));

  if (index >= 0) {
    lines[index] = formatted;
  } else {
    if (lines.length > 0 && lines[lines.length - 1] !== '') {
      lines.push('');
    }
    lines.push(formatted);
  }
}

let raw;
try {
  raw = runRailwayCommand(['variables', '--json']);
} catch (error) {
  console.error('Failed to read Railway variables. Make sure Railway CLI is logged in and the project is linked.');
  process.exit(1);
}

let remoteVars;
try {
  remoteVars = JSON.parse(raw);
} catch (error) {
  console.error('Railway returned invalid JSON for variables.');
  process.exit(1);
}

const selectedKeys = requestedKeys.length > 0
  ? requestedKeys
  : Object.keys(remoteVars).sort();

const envPath = path.resolve(process.cwd(), envFile);
const existingContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const lines = parseDotEnv(existingContent);

let updatedCount = 0;
for (const key of selectedKeys) {
  if (!(key in remoteVars)) {
    continue;
  }
  const value = String(remoteVars[key] ?? '');
  updateEnvLines(lines, key, value);
  console.log(`Synced ${key}=${maskValue(value)}`);
  updatedCount += 1;
}

fs.writeFileSync(envPath, `${lines.join('\n').replace(/\n{3,}/g, '\n\n')}\n`, 'utf8');
console.log(`Updated ${envPath} with ${updatedCount} Railway variable(s).`);
