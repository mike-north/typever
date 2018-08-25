import { Command } from 'commander';
import * as findUp from 'find-up';
import { readFileSync } from 'fs';
import versionCheck from '../../core/version-check';
import { IPackageJSON } from '../../types';
import { ConsoleUI } from '../index';

function checkDependency(
  lib: string,
  typeLib: string | undefined,
  _ui: ConsoleUI
): Promise<any> {
  const pkgPath = findUp.sync('package.json');
  if (!pkgPath) throw new Error('Could not find a package.json');
  const pkg: IPackageJSON = JSON.parse(readFileSync(pkgPath).toString());
  const allDeps = Object.assign(
    {},
    pkg.dependencies || {},
    pkg.devDependencies || {}
  );
  return versionCheck(allDeps, lib, typeLib);
}

export default function check(
  libName: string,
  typeLibName: string | undefined,
  command: Command,
  ui: ConsoleUI
) {
  if (!libName) {
    ui.errorStream.write('No libName specified\n');
    command.help();
  }
  return checkDependency(libName, typeLibName, ui).then(res => {
    console.log(res);
  });
  // .then(formatCheckResult)
  // .then(result => {
  //   console.log('result=', result);
  //   ui.outputStream.write(result + '\n');
  // })
  // .catch(err => {
  //   console.log('err=', err);
  //   ui.errorStream.write(err + '\n');
  // });
}
