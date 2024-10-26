const Listok = require('../Listok');

let listok = new Listok();

const view = {
    menuTitle: 'The Blog!',
    copyright: 'LISTOK.js',
    author: (params) => {
        return 'Red Spirit ' + JSON.stringify(params);
    },
    booksArr: [{name: 'book 1'}, {name: 'book 2'}],
    booksObj: false,
    // booksObj: {name: 'For dummies )'},
    booksFunc: (params) => {
        return 'Zloy Awaw is ' + params.name;
    }

};

let content = listok.renderFile('test/template2.html', view);
console.log('--------------------------------------------');
console.log(content);