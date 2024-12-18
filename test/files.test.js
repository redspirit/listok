const fs = require('fs');
const { expect } = require('chai');
const Listok = require('../Listok');

const tmpPath = './test/templates';


describe('Read template from files', () => {

    it('should load and render file', () => {
        let listok = new Listok(tmpPath);
        const data = { name: 'Liza' };
        const rendered = listok.renderFile('1_name.html', data);
        expect(rendered).to.equal('My name is Liza!');
    });

    it('should render section in section', () => {
        let listok = new Listok(tmpPath);
        const data = {
            title: 'Welcome',
            room: {
                name: 'Cabinet',
                items: [
                    { caption: 'Chair' },
                    { caption: 'Table' },
                    { caption: 'Lamp' },
                ]
            }
        };
        const rendered = listok.renderFile('2_sections.html', data);

        let result = fs.readFileSync(`${tmpPath}/2_sections_result.html`).toString();

        expect(rendered).to.equal(result);
    });

    it('should render include file', () => {
        let listok = new Listok(tmpPath);
        const data = {
            title: 'Site',
            author: 'Octopus'
        };
        const rendered = listok.renderFile('3_include.html', data);

        let result = fs.readFileSync(`${tmpPath}/3_include_result.html`).toString();

        expect(rendered).to.equal(result);
    });

    it('should render iteration in section', () => {
        let listok = new Listok(tmpPath);
        listok.defineFunction('getPages', ({limit}) => {
            console.log('LIMIT', limit);
            return Array(parseInt(limit)).fill(0).map((item, i) => {
                return {
                    title: `Title ${i+1}`,
                    url: `/page-${i+1}`
                }
            })
        })
        const data = {
            isHome: true,
        };
        const rendered = listok.renderFile('4_iterator_in_section.html', data);

        let result = fs.readFileSync(`${tmpPath}/4_iterator_in_section_result.html`).toString();

        expect(rendered).to.equal(result);
    });

});
