/** Route-aware search/social metadata; no domain is invented before launch. */
function LocalSeo() {
  const h=g.createElement;
  const path=Qt().pathname.replace(/\/$/,'')||'/';
  const meta=localSeoRoutes[path]||localSeoRoutes['/404'];
  const url=localPublication.url?localPublication.url+(meta.canonical||path):'';
  return h(XA,null,
    h('title',null,meta.title),h('meta',{name:'description',content:meta.description}),
    h('meta',{name:'robots',content:url&&!meta.noindex?'index,follow,max-image-preview:large':'noindex,follow'}),
    url&&h('link',{rel:'canonical',href:url}),
    h('meta',{property:'og:type',content:meta.type||'website'}),h('meta',{property:'og:locale',content:localPublication.locale}),h('meta',{property:'og:site_name',content:localPublication.name}),
    h('meta',{property:'og:title',content:meta.title}),h('meta',{property:'og:description',content:meta.description}),
    url&&h('meta',{property:'og:url',content:url}),
    localPublication.url&&h('meta',{property:'og:image',content:localPublication.url+localPublication.socialImage}),
    localPublication.url&&h('meta',{property:'og:image:type',content:'image/png'}),localPublication.url&&h('meta',{property:'og:image:width',content:'1200'}),localPublication.url&&h('meta',{property:'og:image:height',content:'630'}),localPublication.url&&h('meta',{property:'og:image:alt',content:localPublication.socialImageAlt}),
    meta.schema&&h('script',{type:'application/ld+json'},JSON.stringify(meta.schema)),
    h('meta',{name:'twitter:card',content:'summary_large_image'}),h('meta',{name:'twitter:title',content:meta.title}),h('meta',{name:'twitter:description',content:meta.description}),
    localPublication.url&&h('meta',{name:'twitter:image',content:localPublication.url+localPublication.socialImage}),localPublication.url&&h('meta',{name:'twitter:image:alt',content:localPublication.socialImageAlt}));
}
