import{j as o,U as n}from"./index.es-4002838d.js";import{L as p}from"./LayoutTemplateDecorator-9cc5e658.js";import m from"./PostPage.stories-689968e4.js";import"./AuthorPage-e1cd20f7.js";import"./NotFoundPage-0e88abc6.js";import"./SearchPage-231d5628.js";import{P as c}from"./PostPage-8cd215b4.js";import"./HomePage-64b8999e.js";import"./index-76fb7be0.js";import"./_commonjsHelpers-de833af9.js";import"./LayoutTemplate.stories-dccae5f9.js";import"./Header.stories-4e7ad938.js";import"./chunk-AY7I2SME-c7b6cf8a.js";import"./AutocompleteField.stories-32dcedd8.js";import"./CategoryIntroBlock-63ebe542.js";import"./index-e131923d.js";import"./extends-98964cd2.js";import"./index-8d47fad6.js";import"./Divider-c193e400.js";import"./ProgressBar-3379ea67.js";import"./SeparatorCircle-aa262d74.js";import"./ShareLinks-5adf3cbc.js";import"./constants-0b04ede2.js";import"./TutoTag-19d1d2c0.js";import"./NewsletterBlock-73630d3f.js";import"./assetHelper-ae8c4375.js";import"./NotFoundBlock-e037728e.js";import"./ContactBlock-52a83084.js";import"./HomeIntroBlock-0e5f2889.js";import"./CategoryEndingBlock-4e724064.js";import"./ContactBlock.stories-a4c9f464.js";const r=({content:e,...s})=>o.jsx(c,{...s,children:o.jsx(n,{as:"section",textSize:"s",dangerouslySetInnerHTML:{__html:e}})});try{r.displayName="ArticlePage",r.__docgenInfo={description:"",displayName:"ArticlePage",props:{contentType:{defaultValue:null,description:"",name:"contentType",required:!0,type:{name:"ContentTypeEnum.ARTICLE"}},content:{defaultValue:null,description:"",name:"content",required:!0,type:{name:"string"}},header:{defaultValue:null,description:"",name:"header",required:!0,type:{name:'Omit<PostHeaderProps, "contentType">'}},footer:{defaultValue:null,description:"",name:"footer",required:!0,type:{name:"PostFooterProps"}},contactBlock:{defaultValue:null,description:"",name:"contactBlock",required:!0,type:{name:'{ title: string; subtitle: string; description: string; link: { label: ReactNode; } & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "ref">; } & FlexProps'}},relatedPostList:{defaultValue:null,description:"",name:"relatedPostList",required:!0,type:{name:"RelatedPostListProps"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const U={title:"Pages/Article",component:r,args:{...m.args,content:`
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
        `},parameters:{layout:"full",viewport:{defaultViewport:"extraSmallScreen"}},decorators:[p]},d=e=>o.jsx(r,{...e}),t=d.bind({});var i,l,a;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:"args => <ArticlePage {...args} />",...(a=(l=t.parameters)==null?void 0:l.docs)==null?void 0:a.source}}};const $=["Overview"];export{t as Overview,$ as __namedExportsOrder,U as default};
//# sourceMappingURL=ArticlePage.stories-d52c65ed.js.map
