import { docopt } from 'docopt'
import path from 'path'
import fs from 'fs'

import { createCloudFormationSDK } from './create-cloud-formation-sdk'
import { getCloudFormationExports } from './get-cloud-formation-exports'
import { writeJS } from './write-js'
import { extractSourceKeys } from './extract-source'

async function cli(args) {
  const clidoc = `
  Usage:
    preamp [--profile=<profile>] [--cloud-formation-to-import=<preamp.config.js>] [--output=<aws-exports.js>]
    preamp -h | --help | --version
  `

  const cliargs = docopt(clidoc, {
    version: '0.1.1rc'
  })
  const sourceFile = cliargs['--cloud-formation-to-import']
  const targetFile = cliargs['--output'] || path.resolve(process.cwd(), 'aws-exports.js')

  const cfSDK = await createCloudFormationSDK(cliargs['--profile'])
  const { exportable, cloudFormationKeys } = extractSourceKeys(sourceFile)
  const allExports = await mergeCloudFormationExports(cfSDK, cloudFormationKeys, exportable)  
  try {
    await writeJS(allExports, targetFile)
  } catch (e) {
    console.error('Could not write JS', e)
  }
}

async function mergeCloudFormationExports(cfSDK, cloudFormationKeys, exportable) {
  const cfExportKeys = Object.keys(cloudFormationKeys)
  const cfExports = await getCloudFormationExports(cfSDK, cfExportKeys)
  const cfFoundKeys = Object.keys(cfExports)
  const cfResults = {}
  for (let key of cfExportKeys) {
    const originalKeyName = cloudFormationKeys[key]
    cfResults[originalKeyName] = cfExports[key]
  }

  const missing = cfExportKeys.filter(x => !cfFoundKeys.includes(x));
  if (missing.length > 0) {
    console.error('Could not find Cloudformation keys', missing)
    process.exit(1)
  }
  
  return {
    ...cfResults,
    ...exportable
  }
}

export {
  cli
}