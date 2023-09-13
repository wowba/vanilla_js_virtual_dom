import render from './render.js';

const diffAttrs = (oldAttrs, newAttrs) => {
  const patches = [];

  // 1. 새로운 속성 입력
  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push($node => {
      $node.setAttribute(k, v);
      return $node;
    });
  }

  // 2. 기존 속성 제거
  for (const k in oldAttrs) {
    if (!(k in newAttrs)) {
      patches.push($node => {
        $node.removeAttribute(k);
        return $node;
      });
    }
  }

  return $node => {
    for (const patch of patches) {
      patch($node);
    }
    return $node;
  };
};

const diffChildren = (oldVChildren, newVChildren) => {
  const childPatches = [];
  oldVChildren.forEach((oldVChild, i) => {
    childPatches.push(diff(oldVChild, newVChildren[i]));
  });

  const additionalPatches = [];
  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push($node => {
      $node.appendChild(render(newVChildren));
      return $node;
    });
  }

  return $parent => {
    $parent.childNodes.forEach(($child, i) => {
      childPatches[i]($child);
    });

    for (const patch of additionalPatches) {
      patch($parent);
    }
    return $parent;
  };
};

const diff = (oldVTree, newVTree) => {
  // 1. 새로 들어온 가상돔이 없을경우
  if (newVTree === undefined) {
    return $node => {
      $node.remove();
      // 아무것도 변하지 않기 때문에 undefined 반환
      return undefined;
    }
  }

  // 2. 문자열 (Textnode 일 경우)
  if (typeof oldVTree === 'string' ||
    typeof newVTree === 'string') {
    if (oldVTree !== newVTree) {
      // 2-1. text node와 element node가 있을 경우 새로운 가상돔 반환
      return $node => {
        const $newNode = render(newVTree);
        $node.replaceWith($newNode);
        return $newNode;
      };
    } else {
      // 2-2. 동일한 text node면 변화 없음
      return $node => $node;
    }
  }

  // 3. 태그가 다른, 아예 새로운 요소가 올 경우
  // 굳이 차이점을 찾지 않고 새로운 가상돔을 반환한다.
  if (oldVTree.tagName !== newVTree.tagName) {
    return $node => {
      const $newNode = render(newVTree);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  // 4. 두 요소의 차이는 속성과 자식 요소밖에 없을 경우
  const patchAttrs = diffAttrs(oldVTree.attrs, newVTree.attrs);
  const patchChildren = diffChildren(oldVTree.children, newVTree.children);

  return $node => {
    patchAttrs($node);
    patchChildren($node);
    return $node;
  };
};

export default diff;