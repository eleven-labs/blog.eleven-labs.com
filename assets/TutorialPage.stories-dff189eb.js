import{j as e,U as s,X as L,R as p}from"./index.es-4002838d.js";import{L as P}from"./LayoutTemplateDecorator-9cc5e658.js";import{T as v,a as m}from"./TutorialSteps.stories-a49f6c09.js";import{C as H}from"./constants-0b04ede2.js";import A from"./PostPage.stories-689968e4.js";import"./AuthorPage-e1cd20f7.js";import"./NotFoundPage-0e88abc6.js";import"./SearchPage-231d5628.js";import{P as b}from"./PostPage-8cd215b4.js";import"./HomePage-64b8999e.js";import"./index-76fb7be0.js";import"./_commonjsHelpers-de833af9.js";import"./LayoutTemplate.stories-dccae5f9.js";import"./Header.stories-4e7ad938.js";import"./chunk-AY7I2SME-c7b6cf8a.js";import"./AutocompleteField.stories-32dcedd8.js";import"./CategoryIntroBlock-63ebe542.js";import"./index-e131923d.js";import"./extends-98964cd2.js";import"./index-8d47fad6.js";import"./Divider-c193e400.js";import"./ProgressBar-3379ea67.js";import"./SeparatorCircle-aa262d74.js";import"./ShareLinks-5adf3cbc.js";import"./TutoTag-19d1d2c0.js";import"./NewsletterBlock-73630d3f.js";import"./assetHelper-ae8c4375.js";import"./NotFoundBlock-e037728e.js";import"./ContactBlock-52a83084.js";import"./HomeIntroBlock-0e5f2889.js";import"./CategoryEndingBlock-4e724064.js";import"./ContactBlock.stories-a4c9f464.js";const i=({steps:t,stepActive:T,content:f,previousLink:{label:o,...a}={},nextLink:{label:l,...n}={},...y})=>e.jsxs(b,{...y,className:"tutorial-page",children:[e.jsxs(s,{className:"tutorial-page__content-container",children:[e.jsx(v,{steps:t,stepActive:T,className:"tutorial-page__steps"}),e.jsx(s,{as:"section",textSize:"s",dangerouslySetInnerHTML:{__html:f}})]}),e.jsxs(L,{gap:"l",children:[o&&a&&e.jsx(p,{as:"a",mt:"l",variant:"secondary",...a,children:o}),l&&n&&e.jsx(p,{as:"a",mt:"l",...n,children:l})]})]});try{i.displayName="TutorialPage",i.__docgenInfo={description:"",displayName:"TutorialPage",props:{contentType:{defaultValue:null,description:"",name:"contentType",required:!0,type:{name:"ContentTypeEnum.TUTORIAL"}},steps:{defaultValue:null,description:"",name:"steps",required:!0,type:{name:'({ name: string; label: string; } & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref">)[]'}},stepActive:{defaultValue:null,description:"",name:"stepActive",required:!0,type:{name:"string | undefined"}},content:{defaultValue:null,description:"",name:"content",required:!0,type:{name:"string"}},previousLink:{defaultValue:null,description:"",name:"previousLink",required:!1,type:{name:'({ label: string; } & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref">)'}},nextLink:{defaultValue:null,description:"",name:"nextLink",required:!1,type:{name:'({ label: string; } & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref">)'}},header:{defaultValue:null,description:"",name:"header",required:!0,type:{name:'Omit<PostHeaderProps, "contentType">'}},footer:{defaultValue:null,description:"",name:"footer",required:!0,type:{name:"PostFooterProps"}},contactBlock:{defaultValue:null,description:"",name:"contactBlock",required:!0,type:{name:'{ title: string; subtitle: string; description: string; link: { label: ReactNode; } & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref">; } & FlexProps'}},relatedPostList:{defaultValue:null,description:"",name:"relatedPostList",required:!0,type:{name:"RelatedPostListProps"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}var u,c;const oe={title:"Pages/Tutorial",component:i,args:{...A.args,contentType:H.TUTORIAL,steps:(u=m.args)==null?void 0:u.steps,stepActive:(c=m.args)==null?void 0:c.stepActive,previousLink:{label:"Précédent"},nextLink:{label:"Suivant"},content:`
              <h1>Heading level 1</h1>
              <h2>Heading level 2</h2>
              <h3>Heading level 3</h3>
              <h4>Heading level 4</h4>
              <h5>Heading level 5</h5>
              <h6>Heading level 6</h6>
              <br />
              <p>I really like using Markdown.</p>
              <p>This is the first line.<br>And this is the second line.</p>
              <p>I just love <strong>bold text</strong>.</p>
              <p>Italicized text is the <em>cat's meow</em>.</p>
              <blockquote>
                <p>Dorothy followed her through many of the beautiful rooms in her castle.</p>
              </blockquote>
              <ul>
                <li>First item</li>
                <li>Second item</li>
                <li>Third item</li>
                <li>Fourth item</li>
              </ul>
              <ol>
                <li>First item</li>
                <li>Second item</li>
                <li>Third item</li>
                <li>Fourth item</li>
              </ol>
              <img src="https://eleven-labs.com/static/images/planets/astro-donut.png" alt="astro donut" />
              <a href="https://blog.eleven-labs.com/">Blog Eleven Labs</a>
              <pre>
                <code class="language-typescript">const hello = (name: string = 'world') => \`hello \${name} !\`;</code>
              </pre>
              <div class="admonition note">
                <p class="admonition-title">Title</p>
                Lorem ipsum
              </div>
        `},parameters:{layout:"full",viewport:{defaultViewport:"extraSmallScreen"}},decorators:[P]},x=t=>e.jsx(i,{...t}),r=x.bind({});var d,h,g;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:"args => <TutorialPage {...args} />",...(g=(h=r.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};const ae=["Overview"];export{r as Overview,ae as __namedExportsOrder,oe as default};
//# sourceMappingURL=TutorialPage.stories-dff189eb.js.map
