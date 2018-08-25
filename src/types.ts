// tslint:disable interface-name

export type VersionCompatibility = 'yes' | 'no' | 'warn';
export interface VersionCompatibilityResult {
  compatibility: VersionCompatibility;
  reason?: string;
  suggestion?: string;
}

export interface VersionCheckResult<
  P extends CheckResult.Package = CheckResult.Package
> {
  lib: P;
  types: P;
  result: VersionCompatibilityResult;
}

// tslint:disable-next-line:no-namespace
export declare namespace CheckResult {
  interface Package {
    name: string;
    target: string | null;
    version: string | null;
  }
}

// Copied from https://gist.github.com/iainreid820/5c1cc527fe6b5b7dba41fec7fe54bf6e
export declare interface IPackageJSON extends Object {
  readonly name: string;
  readonly version: string;
  readonly description?: string;
  readonly keywords?: string[];
  readonly homepage?: string;
  readonly bugs?: string | IBugs;
  readonly license?: string;
  readonly author?: string | IAuthor;
  readonly contributors?: string[] | IAuthor[];
  readonly files?: string[];
  readonly main?: string;
  readonly bin?: string | IBinMap;
  readonly man?: string | string[];
  readonly directories?: IDirectories;
  readonly repository?: string | IRepository;
  readonly scripts?: IScriptsMap;
  readonly config?: IConfig;
  readonly dependencies?: IDependencyMap;
  readonly devDependencies?: IDependencyMap;
  readonly peerDependencies?: IDependencyMap;
  readonly optionalDependencies?: IDependencyMap;
  readonly bundledDependencies?: string[];
  readonly engines?: IEngines;
  readonly os?: string[];
  readonly cpu?: string[];
  readonly preferGlobal?: boolean;
  readonly private?: boolean;
  readonly publishConfig?: IPublishConfig;
}

/**
 * An author or contributor
 */
export declare interface IAuthor {
  name: string;
  email?: string;
  homepage?: string;
}

/**
 * A map of exposed bin commands
 */
export declare interface IBinMap {
  [commandName: string]: string;
}

/**
 * A bugs link
 */
export declare interface IBugs {
  email: string;
  url: string;
}

export declare interface IConfig {
  name?: string;
  // tslint:disable-next-line:ban-types
  config?: Object;
}

/**
 * A map of dependencies
 */
export declare interface IDependencyMap {
  [dependencyName: string]: string;
}

/**
 * CommonJS package structure
 */
export declare interface IDirectories {
  lib?: string;
  bin?: string;
  man?: string;
  doc?: string;
  example?: string;
}

export declare interface IEngines {
  node?: string;
  npm?: string;
}

export declare interface IPublishConfig {
  registry?: string;
}

/**
 * A project repository
 */
export declare interface IRepository {
  type: string;
  url: string;
}

export declare interface IScriptsMap {
  [scriptName: string]: string;
}
