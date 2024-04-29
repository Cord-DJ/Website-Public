import fs from 'fs';
import fetch from 'node-fetch';

const documentId = '1gBB30yBz-eYw3fTeOl6jXCnOWWHHPGy-4EvWm-Ec3Ow';
const generate = {
  EN: 'en-US.json',
  DE: 'de-DE.json',
  SK: 'sk-SK.json',
  CS: 'cs-CZ.json',
  LT: 'lt-LT.json',
  ET: 'et-EE.json',
  'PT-BR': 'pt-BR.json',
  HR: 'hr-HR.json',
  ES: 'es-ES.json',
  JA: 'ja-JP.json'
};

(async () => {
  const response = await fetch(
    `https://docs.google.com/spreadsheets/d/${documentId}/export?format=csv&id=${documentId}`
  );
  const payload = await response.text();
  const data = csvToObject(payload).filter(x => x.ID);

  for (const lang of Object.keys(generate)) {
    const json = data.reduce((flatten, val) => {
      flatten[val.ID.trim()] = val[lang].trim() || undefined;
      return flatten;
    }, {});

    fs.writeFileSync(`${generate[lang]}`, JSON.stringify(json, null, 2));
  }
})().catch(e => console.error(e));

function unflatten(data) {
  if (Object(data) !== data || Array.isArray(data)) return data;
  var regex = /\.?([^.[\]]+)|\[(\d+)\]/g,
    resultholder = {};
  for (var p in data) {
    var cur = resultholder,
      prop = '',
      m;

    while ((m = regex.exec(p))) {
      cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
      prop = m[2] || m[1];
    }

    cur[prop] = data[p];
  }
  return resultholder[''] || resultholder;
}

// CSV parse
function csvToObject(data) {
  const arr = csvToArray(data);
  const header = arr[0];
  var data = arr.splice(1);

  return data.map(row => {
    return header.reduce((obj, v, i) => {
      obj[v] = i < row.length ? row[i] : null;
      return obj;
    }, {});
  });
}

function csvToArray(strData, delimiter = ',') {
  var objPattern = new RegExp(
    // Delimiters.
    '(\\' +
      delimiter +
      '|\\r?\\n|\\r|^)' +
      // Quoted fields.
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      // Standard fields.
      '([^"\\' +
      delimiter +
      '\\r\\n]*))',
    'gi'
  );

  const arrData = [[]];
  var arrMatches = null;

  while ((arrMatches = objPattern.exec(strData))) {
    const [_, del, quoted, standard] = arrMatches;
    if (del.length && del != delimiter) {
      arrData.push([]);
    }

    const val = quoted ? quoted.replace(new RegExp('""', 'g'), '"') : standard;
    arrData[arrData.length - 1].push(val);
  }

  return arrData;
}
