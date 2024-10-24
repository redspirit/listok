const fs = require('fs');
const pathLib = require('path');
const get = require('get-value');

class Listok {
    constructor(viewsDir) {
        this.viewsDir = viewsDir ? viewsDir : process.cwd();
        this.tags = ['{{', '}}'];
        let tl = this.tags[0];
        let tr = this.tags[1];

        this.tagReg = new RegExp(`${tl}\\s*([\\da-z_.]+?)(\\(.*\\))?\\s*${tr}`, 'gi');
        this.sectionReg = new RegExp(`${tl}\\s*#([\\da-z_.]+?)\\s*${tr}(.*)${tl}\\s*\\/\\1\\s*${tr}`, 'gis');
    }

    isPrimitive(test) {
        return test !== Object(test);
    }

    isEmpty(val) {
        return val === null || val === undefined || val === false || val === '';
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

    getFromContext(context, key) {
        if (key === '_') {
            return context;
        } else {
            return this.isPrimitive(context) ? '' : get(context, key);
        }
        // if (this.isPrimitive(context)) {
        //     return key === '_' ? context : '';
        // } else {
        //     return get(context, key);
        // }
    }

    parseSections(template, context) {
        template = template.replaceAll(this.sectionReg, (original, tagName, innerBody) => {
            // console.log({original, tagName, innerBody});
            let subContext = this.getFromContext(context, tagName);
            return this.replaceSection(innerBody, subContext);
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

    replaceSection(innerBody, subContext) {
        if (this.isEmpty(subContext)) {
            return '';
        } else if (Array.isArray(subContext)) {    // is array
            let multiBody = '';
            for(let item of subContext) {
                multiBody += this.parseSections(innerBody, item);
            }
            return multiBody;
        } else if (typeof subContext === 'function') {  // is function
            let funcResult = subContext();
            return this.replaceSection(innerBody, funcResult);
        } else {        // is object
            return this.parseSections(innerBody, subContext);
        }
    }

    replacePlaceholder(context, key) {
        let value = this.getFromContext(context, key);
        console.log('context', context);
        console.log('key', key);
        console.log('value', value);
        console.log('isEmpty', this.isEmpty(value));
        if (this.isEmpty(value)) {
            return '';
        } else if (typeof value === 'string') {
            return value;
        } else if (typeof value === 'function') {
            return value();
        } else {
            return value ? value.toString() : '';
        }
    }

    replaceFunction(context, key, tagParams) {
        if (key === 'include' && tagParams) {
            let fileName = tagParams.trim().slice(1,-1);
            console.log('CTX', context);
            return this.renderFile(fileName, context);
        }
        let func = this.getFromContext(context, key);
        if (this.isEmpty(func)) {
            return '';
        } else if(typeof func === 'function') {
            return func(this.parseFunctionParams(tagParams));
        } else {
            return func.toString();
        }
    }

    render(template, context) {
        return this.parseSections(template, context);
    }

    renderFile(fileName, context) {
        let filePath = pathLib.join(this.viewsDir, fileName);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Template file ${filePath} not found!`);
        }
        let template = fs.readFileSync(filePath).toString();
        return this.parseSections(template, context);
    }
}

module.exports = Listok;