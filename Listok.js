const fs = require('fs');
const pathLib = require('path');
const get = require('get-value');

class Listok {
    constructor(viewsDir) {
        this.viewsDir = viewsDir ? viewsDir : process.cwd();
        this.tags = ['{{', '}}'];
        this.subKey = '_';
        let tl = this.tags[0];
        let tr = this.tags[1];

        this.tagReg = new RegExp(`${tl}([\\da-z_.$]+?)(\\(.*\\))?${tr}`, 'gi');
        this.sectionReg = new RegExp(`${tl}([#!])([\\da-z_.!$]+?)(\\(.*?\\))?(->[\\da-z_]+?)?${tr}(.*?)${tl}\\/\\2${tr}`, 'gis');

        this.context = {};
        this.funcContext = {};
    }

    isPrimitive(test) {
        return test !== Object(test);
    }

    isEmpty(val) {
        return val === null || val === undefined || val === false || val === '';
    }

    parseFunctionParams(str) {
        let params = {};
        if(!str) return params;
        str = str.trim().slice(1,-1);
        str.split(',').forEach(p => {
            let chunks = p.trim().split('=');
            if (chunks[1])
                params[chunks[0].trim()] = chunks[1].trim();
        });
        return params;
    }

    mergeObjects (target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] !== null && source[key] !== undefined) {
                result[key] = source[key];
            }
        }
        return result;
    }

    getFromContext(context, key, tagType = '#', ctxPointer) {
        let ctx;
        if (key === this.subKey) {
            ctx = context;
        } else {
            if(key.charAt(0) === '$') {
                ctx = this.isPrimitive(this.context) ? '' : get(this.context, key.substring(1));
            } else {
                // console.log('key', key);
                // console.log('context', this.mergeObjects(context, this.funcContext));
                ctx = get(this.mergeObjects(context, this.funcContext), key);
            }
        }
        return tagType === '!' ? !ctx : ctx;
    }

    parseSections(template, context) {
        template = template.replaceAll(this.sectionReg, (original, tagType, tagName, tagParams, _ctxPointer, innerBody) => {
            let ctxPointer = _ctxPointer ? _ctxPointer.slice(2) : null; // remove '->'
            // console.log({tagType, tagName, tagParams, ctxPointer});
            let subContext = this.getFromContext(context, tagName, tagType, ctxPointer);
            return this.replaceSection(innerBody, subContext, tagParams);
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

    replaceSection(innerBody, subContext, tagParams) {
        if (this.isEmpty(subContext)) {
            return '';
        } else if (Array.isArray(subContext)) {    // is array
            let multiBody = '';
            for(let item of subContext) {
                multiBody += this.parseSections(innerBody, item);
            }
            return multiBody;
        } else if (typeof subContext === 'function') {  // is function
            let funcResult = subContext(this.parseFunctionParams(tagParams, subContext));
            // console.log('REPL innerBody', innerBody);
            // console.log('REPL funcResult', funcResult);
            return this.replaceSection(innerBody, funcResult);
        } else {        // is object
            return this.parseSections(innerBody, subContext);
        }
    }

    replacePlaceholder(context, key) {
        let value = this.getFromContext(context, key);
        // console.log('context', context);
        // console.log('key', key);
        // console.log('value', value);
        if (this.isEmpty(value)) {
            return '';
        } else if (typeof value === 'string') {
            return value;
        } else if (typeof value === 'function') {
            return value(context);
        } else {
            return value ? value.toString() : '';
        }
    }

    replaceFunction(context, key, tagParams) {
        if (key === 'include' && tagParams) {
            // console.log('INCL', key, tagParams);
            let fileName = tagParams.trim().slice(1,-1);
            return this.renderFile(fileName, context, false);
        }
        let func = this.getFromContext(context, key);
        if (this.isEmpty(func)) {
            return '';
        } else if(typeof func === 'function') {
            return func(this.parseFunctionParams(tagParams), context);
        } else {
            return func.toString();
        }
    }

    defineFunction(name, fn) {
        this.funcContext[name] = fn;
    }

    render(template, context, setGlobalContext = true) {
        if (setGlobalContext) this.context = context;
        return this.parseSections(template, context);
    }

    renderFile(fileName, context, setGlobalContext = true) {
        let filePath = pathLib.join(this.viewsDir, fileName);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Template file ${filePath} not found!`);
        }
        let template = fs.readFileSync(filePath).toString();
        if (setGlobalContext) this.context = context;
        return this.parseSections(template, context);
    }
}

module.exports = Listok;