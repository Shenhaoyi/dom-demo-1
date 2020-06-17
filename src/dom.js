// window.dom = {
//   create(tagName) {
//     return document.createElement(tagName);
//   },
// };

window.dom = {
  //增
  create(string) {
    // const container = document.createElement("div"); //有些标签是不能直接放在div中的，比如li等
    const container = document.createElement("template"); //这个标签可以容纳任意标签，不会显示
    // container.innerHTML = string;
    container.innerHTML = string.trim(); //去掉空格，防止第一个自带为文本
    // return container.children[0]; template不能通过这种方式
    return container.content.firstChild;
  },

  after(node, node2) {
    console.log(node.nextSibling); //没有下一个节点就是null，没有问题
    node.parentNode.insertBefore(node2, node.nextSibling); //这个函数是在该节点之前插入，nextSibling下一个弟弟
  },
  before(node, node2) {
    node.parentNode.insertBefore(node2, node);
  },
  append(parent, node) {
    parent.appendChild(node);
  },
  wrap(node, parent) {
    //将parent用node包裹起来
    dom.before(node, parent); //先插入到parent的前面
    dom.append(parent, node); //改变了地方，原来的位置就没有node了，除非复制一个
  },

  //删
  remove(node) {
    node.parentNode.removeChild(node);
    return node;
  },
  empty(node) {
    // node.innerHTML = "";
    // const childNodes = node.childNodes; 可以简写成下面的句子
    // const { childNodes } = node;
    const array = [];
    // for (let i = 0; i < childNodes.length; i++) {
    //   // childNodes.length 是会变化的
    //   dom.remove(childNodes[i]);
    //   array.push(childNodes[i]);
    // }
    let x = node.firstChild;
    while (x) {
      array.push(dom.remove(node.firstChild));
      x = node.firstChild;
    }
    return array;
  },

  //改
  //属性查询和设置，//重载
  attr(node, name, value) {
    if (arguments.length === 2) {
      return node.getAttribute(name, value);
    } else if (arguments.length === 3) {
      node.setAttribute(name, value);
    }
  },
  //会把所有文本 内容全部替换掉，但是如果文本中还有span也会替换掉（也就是确定不了要替换的到底是那一部分的文本），如果想改特定的，请使用标签包起来，在标签中替换！
  text(node, string) {
    //适配
    if (arguments.length === 1) {
      if ("innerText" in node) {
        return node.innerText; //ie
      } else {
        return node.textContent; //firefox/ chrome
      }
    } else if (arguments.length === 2) {
      if ("innerText" in node) {
        //加引号是因为key都是 字符串
        node.innerText = string; //ie
      } else {
        node.textContent = string; //firefox/ chrome
      }
    }
  },
  html(node, string) {
    if (arguments.length === 2) {
      node.innerHTML = string;
    } else if ((arguments.length = 1)) {
      return node.innerHTML;
    }
  },
  style(node, name, value) {
    if (arguments.length === 3) {
      //按照name value添加样式
      node.style[name] = value;
    } else if (arguments.length === 2) {
      if (typeof name === "string") {
        //获取某个样式
        return node.style[name];
      } else if (name instanceof Object) {
        const object = name;
        for (let key in object) {
          node.style[key] = object[key];
        }
      }
    }
  },
  class: {
    add(node, className) {
      node.classList.add(className);
    },
    remove(node, className) {
      node.classList.remove(className);
    },
    has(node, className) {
      return node.classList.contains(className);
    },
  },
  on(node, eventName, fn) {
    node.addEventListener(eventName, fn);
  },
  off(node, eventName, fn) {
    node.removeEventListener(eventName, fn);
  },

  //查
  find(selector, scope) {
    //有scope，就在scope中找
    return (scope || document).querySelectorAll(selector);
  },
  parent(node) {
    return node.parentNode;
  },
  children(node) {
    return node.children;
  },
  siblings(node) {
    return Array.from(node.parentNode.children).filter((n) => n !== node);
  },
  next(node) {
    //过滤回车等文本
    let x = node.nextSibling;
    while (x && x.nodeType === 3) {
      x = x.nextSibling;
    }
    return x;
  },
  previous(node) {
    //过滤回车等文本
    let x = node.previousSibling;
    while (x && x.nodeType === 3) {
      x = x.previousSibling;
    }
    return x;
  },
  each(nodeList, fn) {
    for (let i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i]);
    }
  },
  index(node) {
    const list = dom.children(node.parentNode);
    for (var i = 0; i < list.length; i++) {
      if (list[i] === node) {
        break;
      }
    }
    return i;
  },
};
