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
대부분의 가상 DOM은 createElement 라는 함수를 가진다. (보통 h 라고 부른다.)  
이 함수는 태그명과 속성, 자식들을 인자로 받아 가상 요소 (virtual element) 라는 데이터를 반환한다.

```javascript
// vdom/createElement.js

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