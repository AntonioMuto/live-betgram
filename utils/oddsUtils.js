const API_URL = process.env.API_URL

const convertMapToObject = (map) => {
    const obj = {};
    map.forEach((value, key) => {
        obj[key] = value; // 'value' è un array di oggetti
    });
    return obj;
};

const createEmptyMap = () => {
    return new Map();
};

const createMapFromEsito = (esitoMap) => {
    const mapOdds = new Map();

    for (const key in esitoMap) {
        if (esitoMap.hasOwnProperty(key)) {
            const item = filterData(esitoMap[key]);
            const idTipoScommessa = item.idTipoScommessa;

            if (!mapOdds.has(idTipoScommessa)) {
                mapOdds.set(idTipoScommessa, []);
            }
            mapOdds.get(idTipoScommessa).push(item);
        }
    }

    return mapOdds;
};


const filterData = (esito) => {
    const filteredItem = {
        key: esito.key,
        idProgramma: esito.idProgramma,
        idAvvenimento: esito.idAvvenimento,
        idTipoScommessa: esito.idTipoScommessa,
        idDisciplina: esito.idDisciplina,
        idEsito: esito.idEsito,
        descrizione: esito.descrizione,
        descrizioneTipoScommessaWithInfoAgg: esito.descrizioneTipoScommessaWithInfoAgg,
        quota: esito.quota,
    }
    return filteredItem;
}

const updateMapFromEsito = (mapOdds, esitoMap) => {
    for (const key in esitoMap) {
        if (esitoMap.hasOwnProperty(key)) {
            const item = filterData(esitoMap[key]);
            const idTipoScommessa = item.idTipoScommessa;

            if (!mapOdds.has(idTipoScommessa)) {
                mapOdds.set(idTipoScommessa, []);
            }
            mapOdds.get(idTipoScommessa).push(item);
        }
    }
};


const retrieveOddsInfo = async (match, key, type) => {
    const responseOdd = await fetch(`${API_URL}${match}/${key}/${type}`);
    if (!responseOdd.ok) {
        throw new Error(`HTTP error! status: ${responseOdd.status}`);
    }
    const data = await responseOdd.json();
    return data;
}

module.exports = {
    createEmptyMap,
    filterData,
    createMapFromEsito,
    updateMapFromEsito,
    convertMapToObject,
    retrieveOddsInfo
};