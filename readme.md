# Vanilla JS Virtual Dom
리액트에서 사용하고 있는 가상돔을 더 자세히 이해하기 위해   
바닐라 JS 로 가상돔을 구현해보는 repo 입니다.  

아래 링크의 강의 내용을 기반으로 진행했습니다.  
[building-a-simple-virtual-dom-from-scratch-3d05](https://dev.to/ycmjason/building-a-simple-virtual-dom-from-scratch-3d05)

## Stack
<p align="left">
  <img src="https://img.shields.io/badge/Html-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
</p>

## 가상 DOM
가상 DOM은 실제 DOM을 **표현**하며 메모리에 저장되는 자바스크립트 객체라고 할 수 있다.  
실제 DOM과의 다른 점은 가상돔은 API를 가지고 있지 않아 더 가볍다고 할 수 있다.

```javascript
// 1. 실제 DOM
const $app = document.getElementById('app')
// DOM은 API를 가지고 있어 프로그래밍 할 수 있다.
$app.innerHTML = "hello world"

// 2. 가상 DOM
// 실제 DOM 과는 다르게 API가 없어 상대적으로 가볍다.
// 동일한 형태로 생성되어야 하는 규칙은 없으며, 실제 DOM을 표현할 수 있으면 가상 DOM 이라고 할 수 있다.
const vApp = {
  tagName: 'div', // html 태그 이름
  attrs: { // html 속성
    id: 'app' // 태그의 id
  }
}
```

## createElement
대부분의 경우 가상 DOM을 구현할 때 createElement 라는 함수를 가진다. (보통 h 라고 부른다.)  
이 함수는 태그명과 속성, 자식들을 인자로 받아 가상 요소 (virtual element) 라는 데이터를 반환한다.

```javascript
// ./vdom/createElement.js

// 속성 혹은 자식이 없을 수 있으므로 비구조화 문법에 기본 값으로 빈 객체를 할당한다.
const createElement = (tagName, { attrs = {}, children = {} } = {}) => {
  // Object.create를 활용해 Object.prototype의 메서드를 상속받지 않는 순수 객체를 생성할 수 있다.
  const vElem = Object.create(null);

  Object.assign(vElem, {
    tagName,
    attrs,
    children,
  });

  return vElem;
}

export default createElement
```

## render
createElement 함수를 통해 가상 DOM을 메모리에 저장할 수 있다면,  
이제 render 함수를 통해 메모리에 저장한 가상 DOM 을 실제 DOM 으로 생성할 수 있다.

실제 DOM 에는 총 8가지 node가 존재하지만, 이번 예제에서는 ElementNode, TextNode 두가지만 구현한다.
```javascript
// ./vdom/render.js

// renderElem 함수는 가상 DOM을 인자로 받아 실제 요소로 변환하는 과정을 거친다.
const renderElem = vNode => {
  // 1. 가상 DOM의 tagName을 이용해 html 요소 생성 
  const $el = document.createElement(vNode.tagName)

  // 2. 가상 DOM의 속성을 Object.entries를 통해 [key, value]로 받아 html 요소에 할당
  for (const [k, v] of Object.entries(vNode.attrs)) {
    $el.setAttributes(k, v)
  }

  // 3. 가상 DOM의 자식 요소들을 재귀함수를 통해 html요소로 만들어 현재 요소에 할당.
  for (const child of vNode.children) {
    $el.appendChild(render(child))
  }

  return $el
}

// render 함수는 가상 DOM을 인자로 받으며, 해당 노드에 따라 반환하는 element가 다르다.
const render = vNode => {
  // 만약 가상 DOM이 단순히 text라면 createTextNode를 이용해 반환
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode)
  }

  // 그 외의 경우 이번 예제에서는 전부 elementNode로 판단.
  return renderElem(vNode)
}

export default render
```

## mount
createElement 함수로 가상 요소를 생성하고, render 함수로 가상 요소들을 html element로 변환했으니,
다음은 mount 함수를 통해 html 요소를 실제 페이지에 올릴수 있어야 한다

```javascript
// mount 함수는 replaceWith 메서드를 이용해 기존 요소를 가상돔을 통해 생성한 요소로 쉽게 변경 가능하다.
// %replaceWith는 IE와 Safari에서는 동작하지 않는다.%
const mount = ($node, $target) => {
  $target.replaceWith($node)
  return $node
}

export default mount
```

createElement, render, mount 세 함수를 이용하면 아래와 같이 html에 가상 DOM을 통해 요소를 추가할 수 있다!

```html
<!-- index.html --> 
<html>
  <head>
    <title>Virtual DOM Study</title>
  </head>

  <body>
    <div id="app"></div>
    <script type="module" src="./main.js"></script>
  </body>
</html>
```
```javascript
// main.js
import createElement from "./vdom/createElement.js"
import render from "./vdom/render.js"
import mount from "./vdom/mount.js"

// createElement 함수를 통해 가상 요소 (Virtual Element) 생성
const vApp = createElement('div', {
  attrs: {
    id: 'app',
  },
  children: [
    "this is textNode", // 가상 text => textNode
    createElement('img', { // 가상 요소 => elementNode
      attrs: {
        src: 'https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif',
      },
    }),
  ],
});

// render 함수를 통해 가상 요소를 실제 요소로 변환
const $app = render(vApp);

console.log($app);
//  <div id="app">
//    this is textNode
//    <img src="https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif">
//  </div>

// html에 만들어낸 실제 요소를 할당
mount($app, document.getElementById('app'))
```