import { newElement } from './src/element';

const VdObj1 = newElement('ul',{id: 'list'},[
    newElement('li',{class: 'list-1',style:'color:red' }, ['lavie']),
    newElement('li',{class: 'list-2' }, ['virtual dom']),
    newElement('li',{class: 'list-3' }, ['React']),  
    newElement('li',{class: 'list-4' }, ['Vue']) 
])
const RealDom = VdObj1.render();
const renderDom = function(element,target){
    target.appendChild(element)
}
export default function start(){
   renderDom(RealDom,document.body)
}