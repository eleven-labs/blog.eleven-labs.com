import{a as p,U as d}from"./index.es-cf1dcd79.js";var l={},f={get exports(){return l},set exports(s){l=s}};/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/(function(s){(function(){var i={}.hasOwnProperty;function t(){for(var a=[],n=0;n<arguments.length;n++){var e=arguments[n];if(e){var r=typeof e;if(r==="string"||r==="number")a.push(e);else if(Array.isArray(e)){if(e.length){var c=t.apply(null,e);c&&a.push(c)}}else if(r==="object"){if(e.toString!==Object.prototype.toString&&!e.toString.toString().includes("[native code]")){a.push(e.toString());continue}for(var o in e)i.call(e,o)&&e[o]&&a.push(o)}}}return a.join(" ")}s.exports?(t.default=t,s.exports=t):window.classNames=t})()})(f);const v=l;const u=({size:s="s",...i})=>p(d,{...i,as:"hr",className:v("divider",{[`divider--${s}`]:s},i.className)});try{u.displayName="Divider",u.__docgenInfo={description:"",displayName:"Divider",props:{as:{defaultValue:null,description:"",name:"as",required:!1,type:{name:"As<any>"}},size:{defaultValue:{value:"s"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"s"'},{value:'"m"'},{value:'"l"'}]}}}}}catch{}export{u as D,v as c};
//# sourceMappingURL=Divider-1a540792.js.map