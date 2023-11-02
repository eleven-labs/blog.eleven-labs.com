import{j as e,U as n,q as v,z as p}from"./index.es-43e4d52f.js";import{L as P}from"./LayoutTemplateDecorator-afc7bc87.js";import{T as b,a as m}from"./TutorialSteps.stories-e764d387.js";import{C as x}from"./constants-0b04ede2.js";import _ from"./PostPage.stories-f667f952.js";import"./AuthorPage-88f1e9d9.js";import"./NotFoundPage-b76c499d.js";import"./SearchPage-3b469aa7.js";import{P as q}from"./PostPage-cd6d46d7.js";import"./index-76fb7be0.js";import"./_commonjsHelpers-de833af9.js";import"./LayoutTemplate.stories-d561f96e.js";import"./chunk-AY7I2SME-c7b6cf8a.js";import"./AutocompleteField.stories-03239179.js";import"./ArticleMetadata-d6a8d670.js";import"./index-e131923d.js";import"./extends-98964cd2.js";import"./index-8d47fad6.js";import"./Divider-2fbe3d1f.js";import"./NewsletterBlock-f4cbd3dd.js";import"./assetHelper-ae8c4375.js";import"./NotFoundBlock-5ac1e322.js";import"./ProgressBar-c7f75d54.js";import"./SeparatorCircle-52950513.js";import"./BackLink-ffbe155a.js";import"./ShareLinks-3743391e.js";import"./TutoTag-00d291b9.js";import"./BackLink.stories-ccee7ab9.js";import"./NewsletterBlock.stories-b7089740.js";const a=({steps:t,stepActive:f,content:y,previousLink:{label:i,...o}={},nextLink:{label:l,...s}={},...T})=>e.jsxs(q,{...T,className:"tutorial-page",children:[e.jsxs(n,{className:"tutorial-page__content-container",children:[e.jsx(b,{steps:t,stepActive:f,className:"tutorial-page__steps"}),e.jsx(n,{as:"section",textSize:"s",dangerouslySetInnerHTML:{__html:y}})]}),e.jsxs(v,{gap:"l",children:[i&&o&&e.jsx(p,{mt:"l",variant:"secondary",...o,children:i}),l&&s&&e.jsx(p,{mt:"l",...s,children:l})]})]});try{a.displayName="TutorialPage",a.__docgenInfo={description:"",displayName:"TutorialPage",props:{contentType:{defaultValue:null,description:"",name:"contentType",required:!0,type:{name:"ContentTypeEnum.TUTORIAL"}},steps:{defaultValue:null,description:"",name:"steps",required:!0,type:{name:'({ name: string; label: string; } & Omit<PropsOf<"a">, "ref" | "color"> & { as?: As<any> | undefined; })[]'}},stepActive:{defaultValue:null,description:"",name:"stepActive",required:!0,type:{name:"string | undefined"}},content:{defaultValue:null,description:"",name:"content",required:!0,type:{name:"string"}},previousLink:{defaultValue:null,description:"",name:"previousLink",required:!1,type:{name:'({ label: string; } & Omit<PropsOf<"a">, "ref" | "color"> & { as?: As<any>; })'}},nextLink:{defaultValue:null,description:"",name:"nextLink",required:!1,type:{name:'({ label: string; } & Omit<PropsOf<"a">, "ref" | "color"> & { as?: As<any>; })'}},backLink:{defaultValue:null,description:"",name:"backLink",required:!0,type:{name:"ReactNode"}},header:{defaultValue:null,description:"",name:"header",required:!0,type:{name:'Omit<PostHeaderProps, "contentType">'}},footer:{defaultValue:null,description:"",name:"footer",required:!0,type:{name:"PostFooterProps"}},newsletterBlock:{defaultValue:null,description:"",name:"newsletterBlock",required:!0,type:{name:"NewsletterBlockProps"}},relatedPostList:{defaultValue:null,description:"",name:"relatedPostList",required:!0,type:{name:"RelatedPostListProps"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}var u,d;const te={title:"Pages/Tutorial",component:a,args:{..._.args,contentType:x.TUTORIAL,steps:(u=m.args)==null?void 0:u.steps,stepActive:(d=m.args)==null?void 0:d.stepActive,previousLink:{label:"Précédent"},nextLink:{label:"Suivant"},content:`
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
        `},parameters:{layout:"full",viewport:{defaultViewport:"extraSmallScreen"}},decorators:[P]},k=t=>e.jsx(a,{...t}),r=k.bind({});var c,g,h;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:"args => <TutorialPage {...args} />",...(h=(g=r.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const re=["Overview"];export{r as Overview,re as __namedExportsOrder,te as default};
//# sourceMappingURL=TutorialPage.stories-f5086769.js.map
