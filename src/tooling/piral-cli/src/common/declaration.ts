import { generateDeclaration } from 'dets';
import { dirname, basename, resolve, extname } from 'path';
import { progress, log } from './log';
import { makeExternals } from './npm';
import { ForceOverwrite } from './enums';
import { retrievePiralRoot, retrievePiletsInfo } from './package';
import { entryModuleExtensions, piralBaseRoot } from './constants';
import { readText, getEntryFiles, matchFiles, createFileIfNotExists } from './io';

function findPiralBaseApi(root: string) {
  try {
    return require
      .resolve(piralBaseRoot, {
        paths: [root],
      })
      ?.replace(/\.js$/, '.d.ts');
  } catch {
    return undefined;
  }
}

function findDeclaredTypings(root: string) {
  try {
    const { typings } = require(resolve(root, 'package.json'));

    if (typings) {
      return [resolve(root, typings)];
    }
  } catch {}

  return [];
}

async function getAllFiles(entryModules: Array<string>) {
  const files: Array<string> = [];
  const pattern = '**/+(*.ts|*.tsx|*.js|*.jsx)';
  const allFiles = await Promise.all(entryModules.map((m) => matchFiles(dirname(m), pattern)));

  for (const found of allFiles) {
    files.push(...found.filter((file) => !files.includes(file)));
  }

  return files;
}

async function getEntryModules(entryFiles: string) {
  if (!entryModuleExtensions.includes(extname(entryFiles).toLowerCase())) {
    const appFile = await readText(dirname(entryFiles), basename(entryFiles));
    const entryModules = await getEntryFiles(appFile, dirname(entryFiles));
    return entryModules;
  }

  return [entryFiles];
}

export async function createDeclaration(
  baseDir: string,
  entry: string,
  target: string,
  forceOverwrite: ForceOverwrite,
) {
  progress('Reading configuration ...');
  const entryFiles = await retrievePiralRoot(baseDir, entry);
  const { name, root, externals } = await retrievePiletsInfo(entryFiles);
  const allowedImports = makeExternals(externals);
  const entryModules = await getEntryModules(entryFiles);
  const files = await getAllFiles(entryModules);

  progress('Bundling declaration file ...');

  try {
    const result = generateDeclaration({
      name,
      root,
      files,
      types: findDeclaredTypings(root),
      apis: [
        {
          file: findPiralBaseApi(root),
          name: 'PiletApi',
        },
      ],
      imports: allowedImports,
    });

    progress('Writing declaration file ...');
    await createFileIfNotExists(target, 'index.d.ts', result, forceOverwrite);
  } catch (ex) {
    log('declarationCouldNotBeGenerated_0076', baseDir, ex);
  }
}
