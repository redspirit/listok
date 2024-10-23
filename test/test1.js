const fs = require('fs');
const Listok = require('../Listok');

let listok = new Listok();

let dataSource = (limit, sort) => {
    // получаем какие-нибудь данные по параметрам
    return [
        {name: 'first'},
        {name: 'second'},
    ]
}

const view = {
    menuTitle: 'The Blog!',
    copyright: 'LISTOK.js',
    author: (params) => {
        return 'Red Spirit ' + JSON.stringify(params);
    },
    booksArr: [{name: 'book 1'}, {name: 'book 2'}],
    booksObj: {name: 'For dummies )'},
    booksFunc: () => {
        return {name: 'Zloy Awaw'};
    }

};

let tpl = fs.readFileSync('./test/template.html').toString();

let content = listok.render(tpl, view);
console.log('--------------------------------------------');
console.log(content);