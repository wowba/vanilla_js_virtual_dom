import createElement from "./vdom/createElement.js"
import render from "./vdom/render.js"
import mount from "./vdom/mount.js"
import diff from './vdom/diff.js'

// createElement 함수를 통해 가상 DOM 생성
const createVApp = count => createElement('div', {
  attrs: {
    id: 'app',
  },
  children: [
    "Count : ", // 가상 text => textNode
    String(count),
    createElement('img', { // 가상 요소 => elementNode
      attrs: {
        src: 'https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif',
      },
    }),
  ],
});



let count = 0;
// 숫자를 가지는 가상 요소 만들기
let vApp = createVApp(count);
// 가상 요소를 렌더링
const $app = render(vApp);
console.log($app);
//  <div id="app">
//    "Count : "
//    "0"
//    <img src="https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif">
//  </div>
let $rootEl = mount($app, document.getElementById('app'));

// 매 초 랜덤 카운더 렌더링하기
setInterval(() => {
  const n = Math.floor(Math.random() * 10);
  // 랜덤숫자를 가상 요소로 만들기
  const vNewApp = createVApp(n);
  // 가상 요소를 비교하여 patch 를 통해 차이 찾기
  const patch = diff(vApp, vNewApp);
  // root 노드에 patch의 결과인 새로운 html 요소를 할당
  $rootEl = patch($rootEl);
  // 가상돔 업데이트
  vApp = vNewApp;
}, 1000);