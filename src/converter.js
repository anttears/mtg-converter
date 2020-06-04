const args = process.argv.slice(2);
const fs = require('fs');

/**
 * Write the custom object to a file ready for upload.
 *
 * @param {Object} set
 */
const writeToOutput = (set) => {
    const path = `${__dirname}\\output\\${set.name}`;
    const setText = JSON.stringify(set);
    fs.writeFileSync(path, setText);
};

/**
 * Take a string with possible numeric value e.g. '1' or 'R' or undefined.
 * Return int, string or null e.g. 1 or 'R' or null.
 *
 * @param {string|undefined} value
 *
 * @return {number|string|null}
 */
const convertToInt = (value) => {
    const float = parseFloat(value);
    const int = parseInt(value, 10);
    const isNumericMana = !isNaN(float) && isFinite(value) && float === int;

    if (isNumericMana) {
        return int;
    } else if (typeof value === 'string') {
        return value;
    }
    return null;
};

/**
 * Convert mana cost string to an array of values e.g. '{2}{R}' into [2, 'R'].
 * Given performance isn't an issue here, it's worth taking the time to make the values as useful as possible, hence the conversion to numeric.
 * We're only going to get int's here, there's no such thing as partial mana.
 *
 * @param {string} manaCost
 *
 * @return {string|number|null[]}
 */
const convertManaCost = (manaCost) => {
    const regExp = /{(.*?)}/g;
    const convertedManaCost = [];
    let convertedCost;

    while ((match = regExp.exec(manaCost)) !== null) {
        convertedCost = match[1];
        convertedManaCost.push(convertToInt(convertedCost));
    }

    return convertedManaCost;
};

/**
 * Nice to have a list of abilities, should make it easier to try and parse later.
 * Need to have a think about how to parse the text into a function. That's for another project, but might need to change the data format.
 *
 * @param {string} text
 *
 * @return {string[]|null}
 */
const convertAbilities = (text) => {
    return text ? text.split('\n') : null;
};

/**
 * Convert the cards from on format to another.
 *
 * @param {Object[]} mtgCards
 *
 * @return {Object[]}
 */
const convertCards = (mtgCards) => {
    return mtgCards.map(mtgCard => {
        return {
            name: mtgCard.name,
            types: mtgCard.types,
            subType: mtgCard.subTypes,
            convertedManaCost: mtgCard.convertedManaCost,
            manaCost: convertManaCost(mtgCard.manaCost),
            rarity: mtgCard.rarity,
            power: convertToInt(mtgCard.power),
            toughness: convertToInt(mtgCard.toughness),
            colors: mtgCard.colors,
            colorIdentity: mtgCard.colorIdentity,
            abilities: convertAbilities(mtgCard.text),
            flavorText: mtgCard.flavorText,
            uuid: mtgCard.uuid
        };
    });
};

/**
 * Convert the tokens into my format.
 *
 * @param {Object[]} mtgTokens
 *
 * @return {Object[]}
 */
const convertTokens = (mtgTokens) => {
    return mtgTokens.map(token => {
        return {
            name: token.name,
            colorIdentity: token.colorIdentity,
            colors: token.colors,
            power: convertToInt(token.power),
            toughness: convertToInt(token.toughness),
            types: token.types,
            subtypes: token.subtypes,
            text: convertAbilities(token.text),
            uuid: token.uuid
        };
    });
};

/**
 * Read the file and return the json therein.
 *
 * @param {string} fileName
 *
 * @return {Object}
 */
const getJsonFromFile = (fileName) => {
    const path = `${__dirname}\\input\\${fileName}`;
    return JSON.parse(fs.readFileSync(path, 'utf8'));
};

/**
 * Transform the existing json into our own format.
 * Gone for readability here, it's useful to see at a glance the naming.
 *
 * @param {Object} mtgJson
 */
const convertJson = (mtgJson) => {
    // This is a big file, so cut it down.
    return {
        name: mtgJson.name,
        setSize: mtgJson.totalSetSize,
        code: mtgJson.code,
        cards: convertCards(mtgJson.cards),
        tokens: convertTokens(mtgJson.tokens)
    };
};

/**
 * Get the JSON file, convert it and save it in output.
 *
 * @param {string} fileName
 */
const convertFile = (fileName) => {
    const mtgJson = getJsonFromFile(fileName);
    const set = convertJson(mtgJson);
    writeToOutput(set);
};

// Entry point for npm run convert
convertFile(args[0]);
