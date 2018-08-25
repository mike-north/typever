import * as program from 'commander';
import checkCommand from './commands/check';

export interface ConsoleUI {
  inputStream: NodeJS.ReadStream;
  outputStream: NodeJS.WriteStream;
  errorStream: NodeJS.WriteStream;
}

export default async function cli({
  cliArgs,
  inputStream,
  outputStream,
  errorStream
}: ConsoleUI & {
  cliArgs: string[];
}) {
  /**
   * Build args that include the arguments passed to the command AND
   * the path of the actual node and executable script that were run.
   * This requires a little extra work because we defer to a local library version
   * and fall back to a global one
   */
  const commandArgs: string[] = process.argv.slice(0, 2).concat(cliArgs);
  const ui: ConsoleUI = { inputStream, errorStream, outputStream };
  const cmd = createProgram(program, ui)
    .allowUnknownOption(false)
    .action(() => {
      // tslint:disable-next-line:no-console
      console.error('incorrect usage');
      cmd.outputHelp();
    })
    .parse(commandArgs);
  if (!cmd.args || !cmd.args.length) program.help();
}

function installCheckCommand(
  prg: program.Command,
  ui: ConsoleUI
): program.Command {
  return prg
    .command('check <lib> [typesLib]')
    .action(
      (libName: string, typeLib: string | undefined, cmd: program.Command) => {
        checkCommand(libName, typeLib, cmd, ui);
      }
    )
    .description('check the type version of a particular package');
}

export function createProgram(
  prg: program.Command,
  ui: ConsoleUI
): program.Command {
  installCheckCommand(prg, ui);
  return prg;
}
