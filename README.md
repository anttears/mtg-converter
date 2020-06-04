# MTGJSON Converter
This turns json files from MTGJSON and converts them to my proprietary format.

## Invoking
npm run convert -- <filename.extension>
e.g. `npm run convert -- THS.json`

This will result in the converted file being saved to the output folder with the value for `name` as the filename.

### TODO
- Convert to Typescript
- lint on commit
- tests