const chai = require('chai');
const Listok = require('../../Listok');

const expect = chai.expect;

describe('Simple Sections', () => {

    it('should render a simple section condition', () => {
        let listok = new Listok();
        const template = 'This {{#isHeader}} IS HEADER {{/isHeader}}!';
        const data = { isHeader: true };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('This  IS HEADER !');
    });

    it('should render a simple section condition is false', () => {
        let listok = new Listok();
        const template = 'This {{#isHeader}} IS HEADER {{/isHeader}}!';
        const data = { isHeader: false };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('This !');
    });

    it('should render a simple section condition invert', () => {
        let listok = new Listok();
        const template = 'This {{!isHeader}} IS HEADER {{/isHeader}}!';
        const data = { isHeader: true };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('This !');
    });

    it('should render a simple section condition complex', () => {
        let listok = new Listok();
        const template = 'This {{#isHeader}} IS HEADER {{/isHeader}} {{!isHeader}} NOT HEADER {{/isHeader}}';
        const data = { isHeader: true };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('This  IS HEADER  ');
    });

    it('should render a simple section condition complex invert', () => {
        let listok = new Listok();
        const template = 'This {{#isHeader}} IS HEADER {{/isHeader}} {{!isHeader}} NOT HEADER {{/isHeader}}';
        const data = { isHeader: false };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('This   NOT HEADER ');
    });

});
