import createElement from "./vdom/createElement.js"
import render from "./vdom/render.js"
import mount from "./vdom/mount.js"

// createElement 함수를 통해 가상 DOM 생성
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

const $app = render(vApp);

console.log($app);
//  <div id="app">
//    this is textNode
//    <img src="https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif">
//  </div>

mount($app, document.getElementById('app'))