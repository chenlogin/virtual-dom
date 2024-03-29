interface Attrs {
    id?: string;
    class?: string;
    style?: string;
}

/** 
 * tagName对应真实的标签类型
 * attrs表示节点上的所有属性
 * child表示该节点的孩子节点
*/
export class Element{
    tagName: string;
    attrs: Attrs;
    child: Element[];
    constructor(tagName, attrs = {}, child = []){
        this.tagName = tagName;
        this.attrs = attrs;
        this.child = child;
    }
    render(){
        let ele = document.createElement(this.tagName);
        let attrs = this.attrs;
        for(let key in attrs){
            this.setVdToDom(ele,key,attrs[key])
        }
        let childNodes = this.child;
        childNodes.forEach(function(child){
            let childEle  = child instanceof Element ? child.render() : document.createTextNode(child);
            ele.appendChild(childEle);
        })
        return ele;  
    }

    setVdToDom(node,key,value){
        switch(key){
            case 'style':
                node.style.cssText = value;
                break;
            case 'value':
                let tagName = node.tagName || '';
                tagName = tagName.toLowerCase();
                if(tagName === 'input' || tagName === 'textarea'){//注意input类型的标签
                    node.value = value
                }else{
                    node.setAttribute(key,value)
                }
                break;
            default:
                node.setAttribute(key,value);
                break;
        }
    }
}

//创建函数对象
export function newElement(tag,attr,child){
    return new Element(tag,attr,child)
}