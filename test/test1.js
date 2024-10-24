const Listok = require('../Listok');

let listok = new Listok();

const view = {
    menuTitle: 'The Blog!',
    copyright: 'LISTOK.js',
    author: (params) => {
        return 'Red Spirit ' + JSON.stringify(params);
    },
    booksArr: [{name: 'book 1'}, {name: 'book 2'}],
    booksObj: true,
    // booksObj: {name: 'For dummies )'},
    booksFunc: () => {
        return {name: 'Zloy Awaw'};
    }

};

let content = listok.renderFile('test/template2.html', view);
console.log('--------------------------------------------');
console.log(content);