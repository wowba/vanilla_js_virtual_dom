// 속성 혹은 자식이 없을 수 있으므로 비구조화 문법에 기본 값으로 빈 객체 및 배열을 할당한다.
const createElement = (tagName, { attrs = {}, children = [] } = {}) => {
  // Object.create를 활용해 Object.prototype의 메서드를 상속받지 않는 순수 객체를 생성할 수 있다.
  const vElem = Object.create(null);

  // null을 할당한 순수 객체에 태그 명 및 속성, 자식을 할당한 뒤 반환한다.
  Object.assign(vElem, {
    tagName,
    attrs,
    children,
  });

  return vElem;
}

export default createElement