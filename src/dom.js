window.dom = {
  /*增*/
  create(string) {
    const container = document.createElement("template");//template可以使该容器放置任何元素，但不会在页面显示
    container.innerHTML = string.trim();//trim()含义在于将空格去掉，这样你不用担心你的文本是否留有空格而导致内容失效
    return container.content.firstChild;
  }, //创造节点
  after(node, node2) {
    node.parentNode.insertBefore(node2, node.nextSibling);//找到node父节点，利用insertBefore将node2插入node下一个节点的前面
  }, //在某节点后面增加节点
  before(node, node2) {
    node.parentNode.insertBefore(node2, node);
    //找到node父节点，利用insertBefore将node2插入node的前面
  }, //在某节点前面增加节点
  append(parent, node) {
    parent.appendChild(node)
  }, //为某节点增加次节点
  wrap(node, parent) {
    dom.before(node, parent)
    dom.append(parent, node)
  }, //为某节点重新选择父亲，注意：父亲重选后，原来的父亲就不是它的父亲节点了，有可能变成爷爷

  /*删*/
  remove(node) {
    node.parentNode.removeChild(node)//用该节点的爸爸删除它
    return node //返回一下，保留一下节点的引用
  },//删除某个节点
  empty(node) {
    const array = [] //设置数组
    let x = node.firstChild
    while (x) {
      array.push(dom.remove(node.firstChild))//将删掉的子节点放入array
      x = node.firstChild //让x等于下一个子节点，也即被删除的节点后一个节点此时变成了firstChild
    }
    return array // 返回一下，保证array可调用
  }, // 清空某节点

  /*改*/
  attr(node, name, value) { //重载
    if (arguments.length === 3) {
      node.setAttribute(name, value) //如果声明参数是3个，就增加或修改节点属性
    } else if (arguments.length === 2) {
      return node.getAttribute(name) //如果声明的参数是2个，那么读取参数
    }
  }, // 修改或增加或读取节点属性
  text(node, string) { //适配
    if (arguments.length === 2) {
      if ('innerText' in node) { //如果node可以使用'innerText'
        node.innerText = string // 支持ie
      } else {
        node.textContent = string // 支持firfox or Chrome
      }
    } else if (arguments.length === 1) {
      if ('innerText' in node) {
        return node.innerText //返回该节点的文本，支持ie
      } else {
        return node.textContent //返回该节点的文本，支持Chrome
      }
    }
  },// 修改文本，子节点也会被覆盖掉。声明长度只有一个时，为读取文本
  html(node, string) { //重载
    if (arguments.length === 2) { //声明两个就是增改HTML
      node.innerHTML = string
    } else if (arguments.length === 1) { //声明一个就是读取HTML
      return node.innerHTML
    }
  }, //改读HTML
  style(node, name, value) {
    if (arguments.length === 3) {  // dom.style(div, 'color', 'red') 改属性值
      node.style[name] = value;
    } else if (arguments.length === 2) {
      if (typeof name === 'string') { // dom.style(div, 'color') 查看属性值
        return node.style[name]
      } else if (name instanceof Object) { // dom.style(div, {color:'red'}) 属性值全面增改
        const object = name
        for (let key in object) { // key: border / color
          node.style[key] = object[key]
        }
      }
    }
  }, //读改style属性
  class: { // 此属性要生效，必须提前在html里将样式布置好
    add(node, className) {
      node.classList.add(className) //增加class属性
    },
    remove(node, className) {
      node.classList.remove(className) //删除class属性
    },
    has(node, className) { //查看有没有此属性
      return node.classList.contains(className)
    }
  },//增改class
  on(node, eventName, fn) {
    node.addEventListener(eventName, fn)
  },//增加事件监听
  off(node, eventName, fn) {
    node.removeEventListener(eventName, fn)
  },//移除事件监听

  /*查*/
  find(selector, scope) {
    return (scope || document).querySelectorAll(selector)
  }, //用于获取标签或标签们,scope表示范围内查找
  parent(node) {
    return node.parentNode
  }, //查找父节点
  children(node) {
    return node.children
  },//查找子节点 
  siblings(node) {
    return Array.from(node.parentNode.children)//Array.from使其变成数组
      .filter(n => n !== node)// 将不等于自己的过滤到Array
  },//查找兄弟姐妹
  next(node) {
    let x = node.nextSibling
    while (x && x.nodeType === 3) {// x存在且x是文本类型，则返回。nodetype是3的时候，表示文本。这里是为了防止x的下一个节点是回车空格等，所以加了文本限定。
      x = x.nextSibling
    }
    return x
  },//找弟弟
  previous(node) { //原理同 找弟弟
    let x = node.previousSibling
    while (x && x.nodeType === 3) {
      x = x.previousSibling
    }
    return x
  },//找哥哥
  each(nodeList, fn) {
    for (let i = 0; i < nodeList.length; i++) { //遍历
      fn.call(null, nodeList[i]) //将fn 和 node结合使用
    }
  },//遍历所有元素
  index(node){
    const list = dom.children(node.parentNode) //获取父节点的子节点们
    let i //let放在for里面，由于作用域的关系，return就拿不到i，所以放外面
    for(i=0;i<list.length;i++){
      if(list[i] === node){
        break
      }
    }
    return i
    } //查节点的排名
}