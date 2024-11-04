const Listok = require('../Listok');

let listok = new Listok();

const view = {
    menuTitle: 'The Blog!',
    showThis: true,
    copyright: 'LISTOK.js',
    author: (params) => {
        return 'Red Spirit ' + JSON.stringify(params);
    },
    booksArr: [{name: 'book 1'}, {name: 'book 2'}],
    // booksObj: false,
    booksObj: {name: 'For dummies )'},
    booksFunc: () => {
        return [
            {name: 'book 1'},
            {name: 'book 2'},
        ]
    }
};

listok.defineFunction('globFunc', (params) => {
    return [
        {name: 'book 1'},
        {name: 'book 2'},
    ]
});

let content = listok.renderFile('test/template.html', view);
console.log('--------------------------------------------');
console.log(content);