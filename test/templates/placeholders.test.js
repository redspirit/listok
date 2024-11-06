const chai = require('chai');
const Listok = require('../../Listok');

const expect = chai.expect;

describe('Simple Placeholders', () => {
    let listok = new Listok();

    it('should render a simple template', () => {
        const template = 'Hello, {{name}}!';
        const data = { name: 'John' };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('Hello, John!');
    });

    it('should render a template with multiple variables', () => {
        const template = 'My name is {{name}} and I am {{age}} years old.';
        const data = { name: 'Jane', age: 30 };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('My name is Jane and I am 30 years old.');
    });

    it('should render with HTML entities', () => {
        const template = '<p>{{name}}</p>';
        const data = { name: '<b>Bold text</b>' };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('<p><b>Bold text</b></p>');
    });

    it('should handle nested objects', () => {
        const template = 'My address is {{address.street}} {{address.city}}';
        const data = { address: { street: '123 Main St', city: 'Anytown' } };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('My address is 123 Main St Anytown');
    });

    it('should handle missing values', () => {
        const template = '{{name}} is {{age}} years old.';
        const rendered = listok.render(template, {});
        expect(rendered).to.equal(' is  years old.');
    });

    it('should not handle syntax error', () => {
        const template = 'Hello, {{name}!';
        const data = { name: 'John' };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('Hello, {{name}!');
    });

    it('should not handle with whitespaces', () => {
        const template = 'Hello, {{ name }}';
        const data = { name: 'John' };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('Hello, {{ name }}');
    });

    it('should render object value', () => {
        const template = 'Show me {{item}}';
        const data = { item: {foo: 'var'} };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('Show me [object Object]');
    });

    it('should render array value', () => {
        const template = 'Show me {{items}}';
        const data = { items: [1, 2, 3] };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('Show me 1,2,3');
    });

    it('should render a multiline template', () => {
        const template = `<div>\n{{name}}\n</div>`;
        const data = { name: 'block' };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('<div>\nblock\n</div>');
    });

});

describe('Functions Placeholders', () => {
    let listok = new Listok();

    it('should render a function without params', () => {
        const template = 'Sum of 2 and 5 is {{sum2And5()}}';
        const data = {
            sum2And5: () => 2 + 5
        };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('Sum of 2 and 5 is 7');
    });

    it('should render a function with 1 param', () => {
        const template = '4 to the power of 2 is {{pow(a=4)}}';
        const data = {
            pow: (params) => params.a * params.a
        };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('4 to the power of 2 is 16');
    });

    it('should render a function with 3 params', () => {
        const template = 'Today <b>{{toDate(year=2024, month=11, day=06)}}</b>';
        const data = {
            toDate: ({year, month, day}) => [year, month, day].join('-')
        };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('Today <b>2024-11-06</b>');
    });

    it('should render a global function', () => {
        const template = 'Result is {{calc(val=49)}}';
        listok.defineFunction('calc', (params) => {
            return Math.sqrt(params.val);
        })
        const rendered = listok.render(template, {});
        expect(rendered).to.equal('Result is 7');
    });

    it('should render a global function with context', () => {
        const template = 'Result is {{calc2()}}';
        listok.defineFunction('calc2', (params, ctx) => {
            return Math.sqrt(ctx.myValue);
        })
        const rendered = listok.render(template, {myValue: 64});
        expect(rendered).to.equal('Result is 8');
    });

});