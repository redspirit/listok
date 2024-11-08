# listok

Шаблонизатор для Node.js с синтаксисом {{mustache}}

[![Publish to NPM](https://github.com/redspirit/listok/actions/workflows/publish.yml/badge.svg)](https://github.com/redspirit/listok/actions/workflows/publish.yml)

Это простой, миниатюрный (~6Kb) и гибкий шаблонизатор, с синтаксисом, который вдохновлен знаменитым [mustache](https://www.npmjs.com/package/mustache).

## Установка
```shell
npm install listok.js
```

## Пример использования
```js
const Listok = require('listok.js');

let listok = new Listok();

let template = 'My name is {{name}}!';
let view = { name: 'Alex' };

let result = listok.render(template, view);

console.log(result); // My name is Alex!
```

## Использование файлов
```js
let listok = new Listok('./path/to/templates');

let view = { name: 'Alex' };

let result = listok.renderFile('template.html', view);

console.log(result);
```

## Placeholders

### Base
```js
let listok = new Listok();

listok.render('<p>{{firstName}} {{lastName}}</p>', {
    firstName: 'John',
    lastName: 'Smith'
}); // "<p>John Smith</p>"
```
### Dot-notation
```js
let listok = new Listok();

listok.render('My name is {{person.name}}, Im {{person.age}} years old', {
    person: {
        name: 'John',
        age: 30
    }
}); // "My name is John, Im 30 years old"
```

### Function
```js
let listok = new Listok();

listok.render('Today is {{getDate()}}', {
    getDate: () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${day}.${month}.${year}`;
    }
}); // "Today is 8.11.2024"
```

### Function with params
```js
let listok = new Listok();

listok.render('Sum 3 and 5 equal {{sum(a=3, b=5)}}', {
    sum: (params) => {
        // Внимание! Все параметры имеют тип String
        return params.a + params.b;
    }
}); // "Sum 3 and 5 equal 8"
```

### Use context in function
```js
let listok = new Listok();

listok.render('My name is{{nameToBold()}}!', {
    nameToBold: (params, ctx) => {
        // Внимание! Все параметры имеют тип String
        return `<b>${ctx.person.name}</b>`;
    },
    person: {
        name: 'John',
        age: 30
    }
}); // "My name <b>John</b>!"
```

### Use special method
Любую функцию можно добавить с помощью метода `.defineFunction(name, fn)`, таким образом функция добавится в корень контекста, это более "чистый" способ добавить функцию для использования в шаблонах, хотя никто не запрещает описать функцию в самом контексте напрямую как в примерах выше.

```js
let listok = new Listok();

listok.defineFunction('pow', (params) => {
    return Math.pow(params.val, 2);
})

listok.render('5^2 = {{pow(val=5)}}', {}); // "5^2 = 25"
```


## Sections

## Iterations


### Todo:
- Больше тестов с файлами и include файлов
- Добавить экранирование html при вставке
- Добавить асинхронность в функциях контекста
