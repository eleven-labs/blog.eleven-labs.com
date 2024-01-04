import{a as S}from"./chunk-AY7I2SME-c7b6cf8a.js";import n,{AutocompleteFieldWithResult as E,AutocompleteFieldWithNoResult as I}from"./AutocompleteField.stories-29024012.js";import{j as e,X as m,U as l,_ as P,g as p,R as W}from"./index.es-4002838d.js";import{c as q}from"./index-e131923d.js";import{b as B,d as C,B as D}from"./CategoryIntroBlock-7d6c196d.js";import"./Divider-c193e400.js";import"./ProgressBar-3379ea67.js";import"./SeparatorCircle-aa262d74.js";import"./TutoTag-19d1d2c0.js";import"./NewsletterBlock-73630d3f.js";import"./NotFoundBlock-e037728e.js";import"./ContactBlock-52a83084.js";import"./HomeIntroBlock-0e5f2889.js";import"./CategoryEndingBlock-4e724064.js";const s=({homeLink:i,categories:v,hasTutorial:j,tutorialLink:{label:x,...N},contactLink:{label:O,...k},autocomplete:w,onToggleMenu:u,menuIsOpen:c=!1})=>e.jsxs(m,{as:"header",justifyContent:"between",alignItems:"center",bg:"white",p:"m",className:"header",children:[e.jsx(l,{as:"a",...i,color:"navy",children:e.jsx(P,{name:"blog",className:"header__logo"})}),e.jsxs(l,{className:q("header__menu",{"header__menu--is-open":c}),children:[v.map(({label:F,isActive:J,...V},R)=>e.jsx(p,{as:"a",...V,"data-internal-link":"category",className:"header__menu-item",children:F},R)),j&&e.jsxs(e.Fragment,{children:[e.jsx(l,{className:"header__separator"}),e.jsx(p,{as:"a",...N,"data-internal-link":"category",className:"header__menu-item",children:x})]}),e.jsx(m,{justifyContent:"center",alignItems:"center",mt:"m",hiddenAbove:"md",children:e.jsx(W,{as:"a",...k,children:O})})]}),e.jsx(B,{hiddenBelow:"md",...w}),c?e.jsx(C,{hiddenAbove:"md",onClick:u}):e.jsx(D,{hiddenAbove:"md",onClick:u})]});try{s.displayName="Header",s.__docgenInfo={description:"",displayName:"Header",props:{homeLink:{defaultValue:null,description:"",name:"homeLink",required:!0,type:{name:'Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref">'}},categories:{defaultValue:null,description:"",name:"categories",required:!0,type:{name:'({ label: ReactNode; isActive?: boolean | undefined; } & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref">)[]'}},hasTutorial:{defaultValue:null,description:"",name:"hasTutorial",required:!0,type:{name:"boolean"}},tutorialLink:{defaultValue:null,description:"",name:"tutorialLink",required:!0,type:{name:'{ label: ReactNode; } & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref">'}},contactLink:{defaultValue:null,description:"",name:"contactLink",required:!0,type:{name:'{ label: ReactNode; } & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref">'}},autocomplete:{defaultValue:null,description:"",name:"autocomplete",required:!0,type:{name:"AutocompleteFieldProps"}},onToggleMenu:{defaultValue:null,description:"",name:"onToggleMenu",required:!0,type:{name:"() => void"}},menuIsOpen:{defaultValue:{value:"false"},description:"",name:"menuIsOpen",required:!1,type:{name:"boolean"}}}}}catch{}const X={title:"Templates/LayoutTemplate/Header",component:s,args:{homeLink:{href:"#"},categories:[{isActive:!0,label:"Tous les articles",href:"#"},{label:"Javascript",href:"#"},{label:"PHP",href:"#"},{label:"Agile",href:"#"},{label:"Architecture",href:"#"},{label:"Bonnes pratiques",href:"#"}],hasTutorial:!0,tutorialLink:{label:"Tutoriels",href:"#"},contactLink:{label:"Nous contacter",href:"#"},autocomplete:n.args,onToggleMenu:S("toggleMenu")},parameters:{layout:"full",viewport:{defaultViewport:"extraSmallScreen"}}},$=X,t={},r={args:{menuIsOpen:!0}},a={args:{autocomplete:{...n.args,...E.args}},parameters:{viewport:{defaultViewport:"full"}}},o={args:{autocomplete:{...n.args,...I.args}},parameters:{viewport:{defaultViewport:"full"}}};var d,h,f;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:"{}",...(f=(h=t.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var g,A,b;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    menuIsOpen: true
  }
}`,...(b=(A=r.parameters)==null?void 0:A.docs)==null?void 0:b.source}}};var _,L,H;a.parameters={...a.parameters,docs:{...(_=a.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    autocomplete: ({
      ...AutocompleteFieldStories.default.args,
      ...AutocompleteFieldStories.AutocompleteFieldWithResult.args
    } as HeaderProps['autocomplete'])
  },
  parameters: {
    viewport: {
      defaultViewport: 'full'
    }
  }
}`,...(H=(L=a.parameters)==null?void 0:L.docs)==null?void 0:H.source}}};var T,M,y;o.parameters={...o.parameters,docs:{...(T=o.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    autocomplete: ({
      ...AutocompleteFieldStories.default.args,
      ...AutocompleteFieldStories.AutocompleteFieldWithNoResult.args
    } as HeaderProps['autocomplete'])
  },
  parameters: {
    viewport: {
      defaultViewport: 'full'
    }
  }
}`,...(y=(M=o.parameters)==null?void 0:M.docs)==null?void 0:y.source}}};const z=["Overview","WithMenuIsOpen","WithAutocompleteIsOpen","WithAutocompleteAndResultNotFound"],ie=Object.freeze(Object.defineProperty({__proto__:null,Overview:t,WithAutocompleteAndResultNotFound:o,WithAutocompleteIsOpen:a,WithMenuIsOpen:r,__namedExportsOrder:z,default:$},Symbol.toStringTag,{value:"Module"}));export{s as H,ie as a,$ as m};
//# sourceMappingURL=Header.stories-ee69e389.js.map
