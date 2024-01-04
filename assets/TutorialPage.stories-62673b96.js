import{j as e,U as n,X as v,R as p}from"./index.es-f0b89c3e.js";import{L as P}from"./LayoutTemplateDecorator-a456322e.js";import{T as L,a as m}from"./TutorialSteps.stories-1f81e91d.js";import{C as H}from"./constants-0b04ede2.js";import b from"./PostPage.stories-6263f3d3.js";import"./AuthorPage-91b480f0.js";import"./NotFoundPage-8c0e2a59.js";import"./SearchPage-91e0a903.js";import{P as A}from"./PostPage-01010f07.js";import"./index-76fb7be0.js";import"./_commonjsHelpers-de833af9.js";import"./LayoutTemplate.stories-df1856c9.js";import"./chunk-AY7I2SME-c7b6cf8a.js";import"./AutocompleteField.stories-76cabd3b.js";import"./ArticleMetadata-f2d4bfe0.js";import"./index-e131923d.js";import"./extends-98964cd2.js";import"./index-8d47fad6.js";import"./Divider-5092ce65.js";import"./NewsletterBlock-9b755537.js";import"./assetHelper-ae8c4375.js";import"./NotFoundBlock-ffd4f72d.js";import"./ProgressBar-1ea7a18b.js";import"./SeparatorCircle-1d3a2de6.js";import"./ShareLinks-ccfe9056.js";import"./TutoTag-27f4ba8a.js";import"./NewsletterBlock.stories-47933064.js";const i=({steps:t,stepActive:T,content:f,previousLink:{label:a,...o}={},nextLink:{label:l,...s}={},...y})=>e.jsxs(A,{...y,className:"tutorial-page",children:[e.jsxs(n,{className:"tutorial-page__content-container",children:[e.jsx(L,{steps:t,stepActive:T,className:"tutorial-page__steps"}),e.jsx(n,{as:"section",textSize:"s",dangerouslySetInnerHTML:{__html:f}})]}),e.jsxs(v,{gap:"l",children:[a&&o&&e.jsx(p,{as:"a",mt:"l",variant:"secondary",...o,children:a}),l&&s&&e.jsx(p,{as:"a",mt:"l",...s,children:l})]})]});try{i.displayName="TutorialPage",i.__docgenInfo={description:"",displayName:"TutorialPage",props:{contentType:{defaultValue:null,description:"",name:"contentType",required:!0,type:{name:"ContentTypeEnum.TUTORIAL"}},steps:{defaultValue:null,description:"",name:"steps",required:!0,type:{name:'({ name: string; label: string; } & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref">)[]'}},stepActive:{defaultValue:null,description:"",name:"stepActive",required:!0,type:{name:"string | undefined"}},content:{defaultValue:null,description:"",name:"content",required:!0,type:{name:"string"}},previousLink:{defaultValue:null,description:"",name:"previousLink",required:!1,type:{name:'({ label: string; } & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref">)'}},nextLink:{defaultValue:null,description:"",name:"nextLink",required:!1,type:{name:'({ label: string; } & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref">)'}},header:{defaultValue:null,description:"",name:"header",required:!0,type:{name:'Omit<PostHeaderProps, "contentType">'}},footer:{defaultValue:null,description:"",name:"footer",required:!0,type:{name:"PostFooterProps"}},newsletterBlock:{defaultValue:null,description:"",name:"newsletterBlock",required:!0,type:{name:"NewsletterBlockProps"}},relatedPostList:{defaultValue:null,description:"",name:"relatedPostList",required:!0,type:{name:"RelatedPostListProps"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}var u,d;const Z={title:"Pages/Tutorial",component:i,args:{...b.args,contentType:H.TUTORIAL,steps:(u=m.args)==null?void 0:u.steps,stepActive:(d=m.args)==null?void 0:d.stepActive,previousLink:{label:"Précédent"},nextLink:{label:"Suivant"},content:`
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
        `},parameters:{layout:"full",viewport:{defaultViewport:"extraSmallScreen"}},decorators:[P]},x=t=>e.jsx(i,{...t}),r=x.bind({});var c,h,g;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:"args => <TutorialPage {...args} />",...(g=(h=r.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};const ee=["Overview"];export{r as Overview,ee as __namedExportsOrder,Z as default};
//# sourceMappingURL=TutorialPage.stories-62673b96.js.map
