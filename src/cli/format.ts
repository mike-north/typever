import { VersionCheckResult } from '../types';

export function formatCheckResult(cr: VersionCheckResult): string {
  console.log('format');
  return `${cr.lib.name}? ${cr.result}`;
}
