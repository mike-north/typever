import chalk from 'chalk';
import * as size from 'window-size';
import * as wrap from 'word-wrap';

import {
  CheckResult,
  VersionCheckResult,
  VersionCompatibility
} from '../types';

const LABELS: { [K in VersionCompatibility]: string } = {
  yes: `${chalk.bold.greenBright('OK ✅ ')}`,
  no: `${chalk.bold.redBright('DANGER 🚨 ')}`,
  warn: `${chalk.bold.yellow('WARNING ⚠️ ')}`
};

function libAndVersion(pkg: CheckResult.Package) {
  return [pkg.name, '@', pkg.target].join('');
}

function checkResultSummary(cr: VersionCheckResult): string {
  return [
    LABELS[cr.result.compatibility],
    chalk.dim(' types version check for '),
    libAndVersion(cr.lib),
    chalk.dim(' - '),
    chalk[
      cr.result.compatibility === 'yes'
        ? 'greenBright'
        : cr.result.compatibility === 'no'
          ? 'redBright'
          : 'yellowBright'
    ](libAndVersion(cr.types))
  ].join('');
}

export function formatCheckResult(cr: VersionCheckResult): string {
  const messages = [];
  messages.push(checkResultSummary(cr));
  if (cr.result.reason) {
    messages.push(
      wrap(
        chalk[cr.result.compatibility === 'warn' ? 'yellow' : 'red'](
          ' * REASON'
        ) +
          ' - ' +
          cr.result.reason.replace(/\{/, '\n{'),
        {
          indent: '     ',
          width: size.width - 8
        }
      ).replace(/^[\s]+/, ' ')
    );
  }
  if (cr.result.suggestion) {
    messages.push(
      wrap(
        chalk[cr.result.compatibility === 'warn' ? 'yellow' : 'red'](
          ' * SUGGESTION'
        ) +
          ' - ' +
          cr.result.suggestion.replace(/\{/, '\n{'),
        {
          indent: '     ',
          width: size.width - 8
        }
      ).replace(/^[\s]+/, ' ')
    );
  }

  return messages.join('\n');
}
