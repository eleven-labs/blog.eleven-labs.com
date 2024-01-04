import{j as o,U as n}from"./index.es-f0b89c3e.js";import{L as p}from"./LayoutTemplateDecorator-a456322e.js";import m from"./PostPage.stories-6263f3d3.js";import"./AuthorPage-91b480f0.js";import"./NotFoundPage-8c0e2a59.js";import"./SearchPage-91e0a903.js";import{P as d}from"./PostPage-01010f07.js";import"./index-76fb7be0.js";import"./_commonjsHelpers-de833af9.js";import"./LayoutTemplate.stories-df1856c9.js";import"./chunk-AY7I2SME-c7b6cf8a.js";import"./AutocompleteField.stories-76cabd3b.js";import"./ArticleMetadata-f2d4bfe0.js";import"./index-e131923d.js";import"./extends-98964cd2.js";import"./index-8d47fad6.js";import"./Divider-5092ce65.js";import"./NewsletterBlock-9b755537.js";import"./assetHelper-ae8c4375.js";import"./constants-0b04ede2.js";import"./NotFoundBlock-ffd4f72d.js";import"./ProgressBar-1ea7a18b.js";import"./SeparatorCircle-1d3a2de6.js";import"./ShareLinks-ccfe9056.js";import"./TutoTag-27f4ba8a.js";import"./NewsletterBlock.stories-47933064.js";const r=({content:e,...s})=>o.jsx(d,{...s,children:o.jsx(n,{as:"section",textSize:"s",dangerouslySetInnerHTML:{__html:e}})});try{r.displayName="ArticlePage",r.__docgenInfo={description:"",displayName:"ArticlePage",props:{contentType:{defaultValue:null,description:"",name:"contentType",required:!0,type:{name:"ContentTypeEnum.ARTICLE"}},content:{defaultValue:null,description:"",name:"content",required:!0,type:{name:"string"}},header:{defaultValue:null,description:"",name:"header",required:!0,type:{name:'Omit<PostHeaderProps, "contentType">'}},footer:{defaultValue:null,description:"",name:"footer",required:!0,type:{name:"PostFooterProps"}},newsletterBlock:{defaultValue:null,description:"",name:"newsletterBlock",required:!0,type:{name:"NewsletterBlockProps"}},relatedPostList:{defaultValue:null,description:"",name:"relatedPostList",required:!0,type:{name:"RelatedPostListProps"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const R={title:"Pages/Article",component:r,args:{...m.args,content:`
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
        `},parameters:{layout:"full",viewport:{defaultViewport:"extraSmallScreen"}},decorators:[p]},c=e=>o.jsx(r,{...e}),t=c.bind({});var i,l,a;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:"args => <ArticlePage {...args} />",...(a=(l=t.parameters)==null?void 0:l.docs)==null?void 0:a.source}}};const z=["Overview"];export{t as Overview,z as __namedExportsOrder,R as default};
//# sourceMappingURL=ArticlePage.stories-d846b751.js.map
