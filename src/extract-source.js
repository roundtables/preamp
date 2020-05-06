import fs from 'fs'
import { cosmiconfigSync } from 'cosmiconfig'

const getJSON = (sourceFile) => {
    if (!!sourceFile) {
      try {
        return JSON.parse(fs.readFileSync(sourceFile).toString())
      } catch (e) {
        console.error('Could not parse JSON', e)
      } 
    }
    const cosmic = cosmiconfigSync('preamp').search()
    return (cosmic && cosmic.config) || {}
  }
  
  export function extractSourceKeys (sourceFile) {
    let cloudFormationKeys = {}
    let exportable = {}
  
    try {
      const source = getJSON(sourceFile)
    
      for (let key of Object.keys(source)) {
        const value = source[key]
        if (typeof value === 'object') {
          if (!value.Value) {
            console.error(`${value} is not a valid object: missing Value field`)
            process.exit(1) 
          }
  
          if (value.Type && value.Type === 'cf') {
            cloudFormationKeys[value.Value] = key
          } else {
            exportable[key] = value.Value
          }
        } else {
          console.error(`${value} is not an object: ${typeof value}`)
        }
      }
    } catch (e) {
      console.error('Exception', e)
      process.exit(1)
    }
  
    return { exportable, cloudFormationKeys }
  }
