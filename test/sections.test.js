const chai = require('chai');
const Listok = require('../Listok');

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

    it('should render a simple section condition without var', () => {
        let listok = new Listok();
        const template = 'This {{#isHeader}} IS HEADER {{/isHeader}}!';
        const rendered = listok.render(template, {});
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

describe('Iterate sections', () => {

    it('should render plain array', () => {
        let listok = new Listok();
        const template = '<ul>{{#items}} <li>{{_}}</li> {{/items}}</ul>';
        const data = {
            items: ['one', 'two', 'three']
        };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('<ul> <li>one</li>  <li>two</li>  <li>three</li> </ul>');
    });

    it('should render array of objects', () => {
        let listok = new Listok();
        const template = '<ul>{{#items}} <li>{{_.name}}</li> {{/items}}</ul>';
        const data = {
            items: [{name: 'Alex'}, {name: 'Max'}, {name: 'Nina'} ]
        };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('<ul> <li>Alex</li>  <li>Max</li>  <li>Nina</li> </ul>');
    });

    it('should render array of objects 2', () => {
        let listok = new Listok();
        const template = '<ul>{{#items}} <li>{{name}}</li> {{/items}}</ul>';
        const data = {
            name: 'Hello',
            items: [{name: 'Alex'}, {name: 'Max'}, {name: 'Nina'} ]
        };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('<ul> <li>Hello</li>  <li>Hello</li>  <li>Hello</li> </ul>');
    });

    it('should render array of objects 3', () => {
        let listok = new Listok();
        const template = '<ul>{{#items->item}} <li>{{item.name}}</li> {{/items}}</ul>';
        const data = {
            items: [{name: 'Alex'}, {name: 'Max'}, {name: 'Nina'} ]
        };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('<ul> <li>Alex</li>  <li>Max</li>  <li>Nina</li> </ul>');
    });

});


describe('Context in sections', () => {

    it('should render placeholder in section', () => {
        let listok = new Listok();
        const template = '<div>{{#isHeader}} {{title}} {{/isHeader}}</div>';
        const data = {
            isHeader: true,
            title: 'Blog'
        };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('<div> Blog </div>');
    });


});