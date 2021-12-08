import { newElement } from './element';
import { diff, fixPlace } from './diff';

const VdObj = newElement('ul',{id: 'list'},[
    newElement('li',{class:'list-1',style:'color:red'},['lavie']),
    newElement('li',{class:'list-2'},['virtual dom']),
    newElement('li',{class:'list-3'},['React']),
    newElement('li',{class:'list-4'},['Vue']),
]);

const VdObj2 = newElement('ul',{id: 'list'},[
    newElement('li',{class:'tag-1',style:'color:green'},['text1']),
    newElement('li',{class:'tag-2'},['text2']),
    newElement('li',{class:'tag-3'},['text3']),
]);

const RealDom = VdObj.render();

const renderDom = function(element,target){
    target.appendChild(element)
}

function start(){
    renderDom(RealDom,document.body)
    setTimeout(() => {
        const diffs = diff(VdObj,VdObj2)
        fixPlace(RealDom,diffs)
    },2000) 
}

start()