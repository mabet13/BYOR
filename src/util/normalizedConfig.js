let config;
try {
    config = require('../../config.json');
} catch (e) {
    console.log('no config.json available.');
}
export let normalizedConfig = {};

export function getConfig(blips = []) {
    if ((normalizedConfig.quadrants || []).length === 4 && (normalizedConfig.rings || []).length) return normalizedConfig;

    // create a config if we dont have one.
    normalizedConfig = createConfig(blips);
    return normalizedConfig;
}

export function createConfig(blips) {
    let configuration = config;

    // if we have no config, get our config from the csv
    if (!configuration) {
        configuration = {
            quadrants: [],
            rings: [],
            legend: {
                triangleKey: 'New or moved',
                circleKey: 'No change'
            },
            footerText: "footerText",
            radarBaseUrl: " ",
            CsvQueryParams: {test: "test"}
        };

        blips.forEach((blip) => {
            if (!configuration.quadrants.includes(blip.quadrant)) {
                configuration.quadrants.push(blip.quadrant);
            }
            if (!configuration.rings.includes(blip.ring)) {
                configuration.rings.push(blip.ring);
            }
        });
    }

    if ((normalizedConfig.quadrants || []).length && (normalizedConfig.rings || []).length) {
        configuration.quadrants = configuration.quadrants.map(el => el.toLowerCase());
        configuration.rings = configuration.rings.map(el => el.toLowerCase());
    }

    configuration.generateCsvUrl = (queryParams) => {
        if (!configuration.radarBaseUrl) throw new Error('No "radarBaseUrl" exists in config');
        if (!Object.keys(configuration.CsvQueryParams).length) throw new Error('No "CsvQueryParams" exist in config');

        let url = configuration.radarBaseUrl;
        for (const [param, defaultVal] of Object.entries(configuration.CsvQueryParams)) {
            const regexp = new RegExp(`\\[${param}\\]`);
            url = url.replace(regexp, queryParams[param] || defaultVal);
        }

        return url;
    };

    return configuration;
}
