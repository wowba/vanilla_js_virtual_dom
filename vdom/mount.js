// mount 함수는 replaceWith 메서드를 이용해 기존 요소를 가상돔을 통해 생성한 요소로 쉽게 변경 가능하다.
// %replaceWith는 IE와 Safari에서는 동작하지 않는다.%
const mount = ($node, $target) => {
  $target.replaceWith($node)
  return $node
}

export default mount