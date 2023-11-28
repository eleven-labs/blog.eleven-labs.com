import{j as o,U as n}from"./index.es-43e4d52f.js";import{L as p}from"./LayoutTemplateDecorator-71739f70.js";import m from"./PostPage.stories-a8537877.js";import"./AuthorPage-e9078883.js";import"./NotFoundPage-b5964bc7.js";import"./SearchPage-168fc7c7.js";import{P as d}from"./PostPage-05c7daed.js";import"./index-76fb7be0.js";import"./_commonjsHelpers-de833af9.js";import"./LayoutTemplate.stories-b753021d.js";import"./chunk-AY7I2SME-c7b6cf8a.js";import"./AutocompleteField.stories-776c222e.js";import"./ArticleMetadata-43824a17.js";import"./index-e131923d.js";import"./extends-98964cd2.js";import"./index-8d47fad6.js";import"./Divider-2fbe3d1f.js";import"./NewsletterBlock-f4cbd3dd.js";import"./assetHelper-ae8c4375.js";import"./constants-0b04ede2.js";import"./NotFoundBlock-5ac1e322.js";import"./ProgressBar-c7f75d54.js";import"./SeparatorCircle-52950513.js";import"./BackLink-ffbe155a.js";import"./ShareLinks-3743391e.js";import"./TutoTag-d8b13573.js";import"./BackLink.stories-ccee7ab9.js";import"./NewsletterBlock.stories-b7089740.js";const r=({content:e,...s})=>o.jsx(d,{...s,children:o.jsx(n,{as:"section",textSize:"s",dangerouslySetInnerHTML:{__html:e}})});try{r.displayName="ArticlePage",r.__docgenInfo={description:"",displayName:"ArticlePage",props:{contentType:{defaultValue:null,description:"",name:"contentType",required:!0,type:{name:"ContentTypeEnum.ARTICLE"}},content:{defaultValue:null,description:"",name:"content",required:!0,type:{name:"string"}},backLink:{defaultValue:null,description:"",name:"backLink",required:!0,type:{name:"ReactNode"}},header:{defaultValue:null,description:"",name:"header",required:!0,type:{name:'Omit<PostHeaderProps, "contentType">'}},footer:{defaultValue:null,description:"",name:"footer",required:!0,type:{name:"PostFooterProps"}},newsletterBlock:{defaultValue:null,description:"",name:"newsletterBlock",required:!0,type:{name:"NewsletterBlockProps"}},relatedPostList:{defaultValue:null,description:"",name:"relatedPostList",required:!0,type:{name:"RelatedPostListProps"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const C={title:"Pages/Article",component:r,args:{...m.args,content:`
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
        `},parameters:{layout:"full",viewport:{defaultViewport:"extraSmallScreen"}},decorators:[p]},c=e=>o.jsx(r,{...e}),t=c.bind({});var i,l,a;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:"args => <ArticlePage {...args} />",...(a=(l=t.parameters)==null?void 0:l.docs)==null?void 0:a.source}}};const D=["Overview"];export{t as Overview,D as __namedExportsOrder,C as default};
//# sourceMappingURL=ArticlePage.stories-755f84f7.js.map
