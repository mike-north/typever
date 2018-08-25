import * as findUp from 'find-up';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as semver from 'semver';
import { IDependencyMap, IPackageJSON, VersionCheckResult } from '../types';
const PKG_PATH = findUp.sync('package.json');
if (!PKG_PATH) {
  throw new Error('Could not find project package.json');
}
const PROJECT_ROOT = join(PKG_PATH, '..');

export function getDependencyVersion(libName: string): string {
  const resolvedLib = join(PROJECT_ROOT, 'node_modules', libName);
  if (!resolvedLib) throw new Error('Could not resolve lib ' + libName);
  const pkgPath = findUp.sync('package.json', { cwd: resolvedLib });
  if (!pkgPath) {
    throw new Error(
      'Could not find package.json for lib ' + libName + ' in node_modules'
    );
  }
  const pkg = JSON.parse(readFileSync(pkgPath).toString()) as IPackageJSON;
  return pkg.version;
}

export function determineVersionCompatibility(
  [lib, libTarget]: [string, string | null],
  [typ, typTarget]: [string, string | null],
  getDepVersion: (name: string) => null | string = getDependencyVersion
): VersionCheckResult {
  const libVersion = getDepVersion(lib);
  const typVersion = getDepVersion(typ);
  const versInfo = {
    lib: { name: lib, target: libTarget, version: libVersion },
    types: { name: typ, target: typTarget, version: typVersion }
  };
  if (!libTarget) {
    return {
      ...versInfo,
      result: {
        compatibility: 'yes',
        reason: `Library "${lib}" not found in package.json`
      }
    };
  }
  if (!typTarget) {
    return {
      ...versInfo,
      result: {
        compatibility: 'yes',
        reason: `Library "${typ}" not found in package.json`
      }
    };
  }

  if (!libVersion) {
    return {
      ...versInfo,
      result: {
        compatibility: 'yes',
        reason: `Library "${lib}" not found in node_modules`
      }
    };
  }
  if (!typVersion) {
    return {
      ...versInfo,
      result: {
        compatibility: 'yes',
        reason: `Library "${typ}" not found in node_modules`
      }
    };
  }

  const libMajor = semver.major(libVersion);
  const typeMajor = semver.major(typVersion);
  const typeMinor = semver.minor(typVersion);
  // Major version incompatibility
  if (!semver.satisfies(typVersion, `^${[libMajor, 0, 0].join('.')}`)) {
    return {
      ...versInfo,
      result: {
        compatibility: 'no',
        suggestion: `Upgrade "${typeMajor < libMajor ? typ : lib}"`,
        reason: `Library version (${lib}@${libTarget}) and types version (${typ}@${typTarget}) are not compatible`
      }
    };
  } else {
    const typNextMinor = [typeMajor, typeMinor + 1, 0].join('.');
    if (semver.satisfies(typNextMinor, typTarget)) {
      return {
        lib: versInfo.lib,
        types: Object.assign(
          { recommendedTarget: `~${typVersion}` },
          versInfo.types
        ),
        result: {
          compatibility: 'warn',
          reason: `A type library target of "${typTarget}" will allow your app to take in breaking changes. This is the SemVer equivalent of { "${typ}": "*" }. See more about ambient type versioning strategy here https://github.com/mike-north/types-version#the-versioning-strategy`,
          suggestion: `Update package.json with dependency { "${typ}": "~${typVersion}" }`
        }
      };
    }
  }
  return {
    ...versInfo,
    result: {
      compatibility: 'yes'
    }
  };
}

export default function versionCheck(
  deps: IDependencyMap,
  libName: string,
  typeLibName: string = `@types/${libName}`
): Promise<VersionCheckResult> {
  const libTarget = deps[libName];
  const typeTarget = deps[typeLibName];
  return Promise.resolve(
    determineVersionCompatibility(
      [libName, libTarget],
      [typeLibName, typeTarget]
    )
  );
}
