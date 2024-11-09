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

describe('Subcontext Sections', () => {

    it('should render placeholder without context', () => {
        let listok = new Listok();
        const template = 'Person: {{#person}} {{name}}, {{person.age}} {{/person}}';
        const data = {
            person: {
                name: 'Alex',
                age: 30
            }
        };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('Person:  Alex, 30 ');
    });

    it('should render placeholder within context', () => {
        let listok = new Listok();
        const template = 'Person: {{#person->man}} {{man.name}}={{name}} {{/person}}!';
        const data = {
            person: {
                name: 'Alex',
                age: 30
            }
        };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('Person:  Alex !');
    });

    it('should render combined context', () => {
        let listok = new Listok();
        const template = 'Person: {{#person->man}} {{man.name}} {{/person}} {{man.age}}';
        const data = {
            person: {
                name: 'Alex',
                age: 30
            }
        };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('Person:  Alex  ');
    });

    it('should render nested context', () => {
        let listok = new Listok();
        const template = 'Person: {{#person->man}} {{man.name}} {{#man.job->job}} {{job.title}} {{/man.job}} {{/person}}';
        const data = {
            person: {
                name: 'Alex',
                age: 30,
                job: {
                    title: 'engineer',
                    experience: 3
                }
            }
        };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('Person:  Alex  engineer  ');
    });

});

describe('Iterate sections', () => {

    it('should render plain array', () => {
        let listok = new Listok();
        // если контекст это примитив, то ключ может быть ЛЮБОЙ и он всегда вернет этот примитив
        // по этому внутри items может быть и {{_}} и {{.}} и {{hello.world}} результат будет одинаков
        const template = '<ul>{{#items}} <li>{{_}}</li> {{/items}}</ul>';
        const data = {
            items: ['one', 'two', 'three']
        };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('<ul> <li>one</li>  <li>two</li>  <li>three</li> </ul>');
    });

    it('should render array of objects', () => {
        let listok = new Listok();
        const template = '<ul>{{#items}} <li>{{name}}</li> {{/items}}</ul>';
        const data = {
            items: [{name: 'Alex'}, {name: 'Max'}, {name: 'Nina'} ]
        };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('<ul> <li>Alex</li>  <li>Max</li>  <li>Nina</li> </ul>');
    });

    it('should render array of objects 2', () => {
        let listok = new Listok();
        const template = '<ul>{{#items->row}} <li>{{row.name}}={{name}}</li> {{/items}}</ul>';
        const data = {
            items: [{name: 'Alex'}, {name: 'Max'}, {name: 'Nina'} ]
        };
        const rendered = listok.render(template, data);
        expect(rendered).to.equal('<ul> <li>Alex=Alex</li>  <li>Max=Max</li>  <li>Nina=Nina</li> </ul>');
    });

});