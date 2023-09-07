// renderElem 함수는 가상 DOM을 인자로 받아 실제 요소로 변환하는 과정을 거친다.
const renderElem = vNode => {
  // 1. 가상 DOM의 tagName을 이용해 html 요소 생성 
  const $el = document.createElement(vNode.tagName)

  // 2. 가상 DOM의 속성을 Object.entries를 통해 [key, value]로 받아 html 요소에 할당
  for (const [k, v] of Object.entries(vNode.attrs)) {
    $el.setAttribute(k, v)
  }

  // 3. 가상 DOM의 자식 요소들을 재귀함수를 통해 html요소로 만들어 현재 요소에 할당.
  for (const child of vNode.children) {
    $el.appendChild(render(child))
  }

  return $el
}

const render = vNode => {
  // 만약 가상돔이 단순히 text라면 createTextNode를 이용해 반환
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode)
  }

  // 그 외의 경우 이번 예제에서는 전부 elementNode로 판단.
  return renderElem(vNode)
}

export default render