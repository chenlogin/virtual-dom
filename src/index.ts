import { Element } from './element';

//declare APP_VERSION;
function newElement(tag,attr,child){//创建函数对象
    return new Element(tag,attr,child)
}

const VdObj = newElement('ul',{id: 'list'},[
    newElement('li',{class:'list-1',style:'color:red'},['lavie']),
    newElement('li',{class:'list-2'},['virtual dom']),
    newElement('li',{class:'list-3'},['React']),
    newElement('li',{class:'list-4'},['Vue']),
]);

console.log(VdObj);
