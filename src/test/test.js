window.dom = {
    find(selector, scope) {
        return (scope || document).querySelectorAll(selector)
    },
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
    },
    each(nodeList, fn) {
        for (let i = 0; i < nodeList.length; i++) { //遍历
            fn.call(null, nodeList[i]) //将fn 和 node结合使用
        }
    }
}

const div = dom.find('#test>.red')[0] // 获取对应的元素
dom.style(div, 'color', 'red')// 设置 div.style.color

const divList = dom.find('.red')// 获取多个 div.red 元素
dom.each(divList, (n) => console.log(n)) // 遍历 divList 里的所有元素