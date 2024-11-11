# listok.js

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
listok.render('My name is {{person.name}}, Im {{person.age}} years old', {
    person: {
        name: 'John',
        age: 30
    }
}); // "My name is John, Im 30 years old"
```

### Function
```js
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
listok.render('Sum 3 and 5 equal {{sum(a=3, b=5)}}', {
    sum: (params) => {
        // Внимание! Все параметры имеют тип String
        return params.a + params.b;
    }
}); // "Sum 3 and 5 equal 8"
```

### Use context in function
```js
listok.render('My name is{{nameToBold()}}!', {
    nameToBold: (params, ctx) => {
        return `<b>${ctx.person.name}</b>`;
    },
    person: {
        name: 'John',
        age: 30
    }
}); // "My name <b>John</b>!"
```

### Use .defineFunction()
Любую функцию можно добавить с помощью метода `.defineFunction(name, fn)`, таким образом функция добавится в корень контекста, это более "чистый" способ добавить функцию для использования в шаблонах, хотя никто не запрещает описать функцию в самом контексте напрямую как в примерах выше.

```js
listok.defineFunction('pow', (params) => {
    return Math.pow(params.val, 2);
})

listok.render('5^2 = {{pow(val=5)}}', {}); // "5^2 = 25"
```

## Sections
Секции использются для того, чтобы отображать или удалять часть шаблона. 
В примере ниже `{{#isHeader}} IS HEADER {{/isHeader}}` отобразиться только когда свойство `isHeader` истино.  
Чтобы инвертировать секцию используется символ "!" вместо "#".
```js
listok.render('This {{#isHeader}} IS HEADER {{/isHeader}} {{!isHeader}} NOT HEADER {{/isHeader}}', 
    { isHeader: true }
); // "This  IS HEADER  "
```

Секция также создает внутри себя контекст к которому можно братиться:
```js
listok.render('Person: {{#person}} {{name}}, {{age}} {{/person}}', {
    person: {
        name: 'Alex',
        age: 30
    }
}); // "Person:  Alex, 30 "
```

Контексту внутри секции можно явно задать имя и обращаться к свойствам контекста по его имени.  
Пример ниже демонстрирует, что внутри секции `{{#person->man}}` можно обратиться к имени через `{{man.name}}`, 
а за пределами секции доступа к `man` уже не будет
```js
listok.render('Person: {{#person->man}} {{man.name}} {{/person}} {{man.age}}', {
    person: {
        name: 'Alex',
        age: 30
    }
}); // "Person:  Alex  "
```

## Iterations
Если значением секции будет массив, то шаблонизатор отобразит содержимое секции столько раз, сколько эементов в массиве:
```js
listok.render('<ul>{{#guests}} <li>{{name}}</li> {{/guests}}</ul>', {
    guests: [{name: 'Alex'}, {name: 'Max'}, {name: 'Nina'} ]
}); // "<ul> <li>Alex</li>  <li>Max</li>  <li>Nina</li> </ul>"
```

Внимание! Если элементы массива это примитивы, то чтобы их отобразить используйте символ "_":
```js
listok.render('<ul>{{#items}} <li>{{_}}</li> {{/items}}</ul>', {
    items: ['one', 'two', 'three']
}); // "<ul> <li>one</li>  <li>two</li>  <li>three</li> </ul>"
```

---

### Todo:
- Добавить экранирование html при вставке
- Добавить асинхронность в функциях контекста
