const get = require('get-value');

class Listok {
    constructor() {
        this.tags = ['{{', '}}'];
        let tl = this.tags[0];
        let tr = this.tags[1];

        this.tagReg = new RegExp(`${tl}\\s*([a-z_.]+?)(\\(.*\\))?\\s*${tr}`, 'gi');
        this.sectionReg = new RegExp(`${tl}\\s*#([a-z_.]+?)\\s*${tr}(.*)${tl}\\s*\\/\\1\\s*${tr}`, 'gis');
    }

    parseFunctionParams(str) {
        let params = {};
        str = str.trim().slice(1,-1);
        str.split(',').forEach(p => {
            let chunks = p.trim().split('=');
            if (chunks[1])
                params[chunks[0].trim()] = chunks[1].trim();
        });
        return params;
    }

    iterateContext(innerBody, subContext) {
        if(typeof subContext === 'boolean') {    // is Boolean ????????????????

        } else if (Array.isArray(subContext)) {    // is array
            let multiBody = '';
            for(let item of subContext) {
                multiBody += this.parseSections(innerBody, item);
            }
            return multiBody;
        } else if (typeof subContext === 'function') {  // is function
            let funcResult = subContext();
            return this.iterateContext(innerBody, funcResult);
        } else {        // is object
            return this.parseSections(innerBody, subContext);
        }
    }

    //  todo обработка любого контекста и удаление секции если контекст не истина

    parseSections(template, context) {
        template = template.replaceAll(this.sectionReg, (original, tagName, innerBody) => {
            console.log({original, tagName, innerBody});
            let subContext = get(context, tagName);
            return this.iterateContext(innerBody, subContext);
        });

        template = template.replaceAll(this.tagReg, (original, tagName, tagParams) => {
            if (tagParams) {
                return this.replaceFunction(context, tagName, tagParams);
            } else {
                return this.replacePlaceholder(context, tagName);
            }
        });

        return template;
    }

    replacePlaceholder(context, key) {
        let value = get(context, key);
        if(typeof value === 'string') {
            return value;
        } else if (typeof value === 'function') {
            return value();
        } else {
            return value ? value.toString() : '???';
        }
    }

    replaceFunction(context, key, tagParams) {
        let func = get(context, key);
        if(typeof func === 'function') {
            return func(this.parseFunctionParams(tagParams));
        } else {
            return func.toString();
        }
    }

    render(template, context) {
        return this.parseSections(template, context);
    }

}

module.exports = Listok;