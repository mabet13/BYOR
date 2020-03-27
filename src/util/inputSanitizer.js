import sanitizeHtml from 'sanitize-html';

const relaxedOptions = {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'ul',
        'br', 'p', 'u'],
    allowedAttributes: {
        'a': ['href', 'target']
    }
};

const restrictedOptions = {
    allowedTags: [],
    allowedAttributes: {},
    textFilter: function (text) {
        return text.replace(/&amp;/, '&');
    }
};

export default class InputSanitizer {
    sanitize(rawBlip) {
        let blip = this.trimWhiteSpaces(rawBlip);
        blip.description = sanitizeHtml(blip.description, relaxedOptions);
        blip.name = sanitizeHtml(blip.name, restrictedOptions);
        blip.isNew = sanitizeHtml(blip.isNew, restrictedOptions);
        blip.ring = sanitizeHtml(blip.ring, restrictedOptions);
        blip.quadrant = sanitizeHtml(blip.quadrant, restrictedOptions);
        blip.link = sanitizeHtml(blip.link, restrictedOptions);

        return blip;
    };

    sanitizeForProtectedSheet(rawBlip, header) {
        let blip = this.trimWhiteSpaces(rawBlip);

        const descriptionIndex = header.indexOf('description');
        const nameIndex = header.indexOf('name');
        const isNewIndex = header.indexOf('isNew');
        const quadrantIndex = header.indexOf('quadrant');
        const ringIndex = header.indexOf('ring');
        const linkIndex = header.indexOf('link');

        const description = descriptionIndex === -1 ? '' : blip[descriptionIndex];
        const name = nameIndex === -1 ? '' : blip[nameIndex];
        const isNew = isNewIndex === -1 ? '' : blip[isNewIndex];
        const ring = ringIndex === -1 ? '' : blip[ringIndex];
        const quadrant = quadrantIndex === -1 ? '' : blip[quadrantIndex];
        const link = linkIndex === -1 ? '' : blip[linkIndex];

        blip.description = sanitizeHtml(description, relaxedOptions);
        blip.name = sanitizeHtml(name, restrictedOptions);
        blip.isNew = sanitizeHtml(isNew, restrictedOptions);
        blip.ring = sanitizeHtml(ring, restrictedOptions);
        blip.quadrant = sanitizeHtml(quadrant, restrictedOptions);
        blip.link = sanitizeHtml(link, restrictedOptions);

        return blip;
    };

    trimWhiteSpaces(blip) {
        return JSON.parse(JSON.stringify(blip).replace(/"\s+|\s+"/g, '"'));
    }
}
