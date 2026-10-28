(() => {
  const url = new URL(location.href);
  const lang = ['zh','ja','en'].includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : 'zh';
  document.documentElement.lang = {zh:'zh-CN',ja:'ja',en:'en'}[lang];
  const dict = new Map((window.PZ_TRANSLATIONS || '').trim().split('\n').filter(Boolean).map(row => { const [zh,ja,en] = row.split('|'); return [zh,{ja,en}]; }));
  const prefs = [
    ['北海道','北海道','Hokkaido'],['青森县','青森県','Aomori'],['岩手县','岩手県','Iwate'],['宫城县','宮城県','Miyagi'],['秋田县','秋田県','Akita'],['山形县','山形県','Yamagata'],['福岛县','福島県','Fukushima'],['茨城县','茨城県','Ibaraki'],['栃木县','栃木県','Tochigi'],['群马县','群馬県','Gunma'],['埼玉县','埼玉県','Saitama'],['千叶县','千葉県','Chiba'],['东京都','東京都','Tokyo'],['神奈川县','神奈川県','Kanagawa'],['新潟县','新潟県','Niigata'],['富山县','富山県','Toyama'],['石川县','石川県','Ishikawa'],['福井县','福井県','Fukui'],['山梨县','山梨県','Yamanashi'],['长野县','長野県','Nagano'],['岐阜县','岐阜県','Gifu'],['静冈县','静岡県','Shizuoka'],['爱知县','愛知県','Aichi'],['三重县','三重県','Mie'],['滋贺县','滋賀県','Shiga'],['京都府','京都府','Kyoto'],['大阪府','大阪府','Osaka'],['兵库县','兵庫県','Hyogo'],['奈良县','奈良県','Nara'],['和歌山县','和歌山県','Wakayama'],['鸟取县','鳥取県','Tottori'],['岛根县','島根県','Shimane'],['冈山县','岡山県','Okayama'],['广岛县','広島県','Hiroshima'],['山口县','山口県','Yamaguchi'],['德岛县','徳島県','Tokushima'],['香川县','香川県','Kagawa'],['爱媛县','愛媛県','Ehime'],['高知县','高知県','Kochi'],['福冈县','福岡県','Fukuoka'],['佐贺县','佐賀県','Saga'],['长崎县','長崎県','Nagasaki'],['熊本县','熊本県','Kumamoto'],['大分县','大分県','Oita'],['宫崎县','宮崎県','Miyazaki'],['鹿儿岛县','鹿児島県','Kagoshima'],['冲绳县','沖縄県','Okinawa']
  ];
  prefs.forEach(([zh,ja,en]) => dict.set(zh,{ja,en}));
  const fragments = {
    ' 已保存':{ja:' 保存しました',en:' saved'},'日期已清空':{ja:'日付を削除しました',en:'Date cleared'},'：未来探索计划':{ja:'：今後の旅の計画',en:': future travel plan'},'：旅行档案内容待补充':{ja:'：旅の記録は準備中です',en:': travel record coming soon'}
  };
  function translate(s) {
    if (lang==='zh') return s;
    const text=s.trim();
    if(dict.has(text)) return s.replace(text,dict.get(text)[lang]);
    const poster=/^海报设计作品 (\d+)$/.exec(text);if(poster)return (lang==='ja'?'ポスター作品':'Poster design ')+poster[1];
    const bookPage=/^《再见，明明》第(\d+)页$/.exec(text);if(bookPage)return lang==='ja'?'『再见，明明』'+bookPage[1]+'ページ':'Goodbye, Mingming · Page '+bookPage[1];
    if(text.endsWith('主视觉')){const title=text.slice(0,-3);return (dict.get(title)?.[lang]||title)+(lang==='ja'?'・メインビジュアル':' · Hero image');}
    if(text.startsWith('选择') && dict.has(text.slice(2))) return (lang==='ja'?'選択：':'Select ')+dict.get(text.slice(2))[lang];
    if(/^\d{4}(?:—\d{4})?年?$/.test(text)) return lang==='en' ? s.replace('年','') : s;
    if(/^(\d{4})(?:年)?—?至今(?: \/ VISUAL RECORD)?$/.test(text)) return s.replace(/年?—?至今/,lang==='ja'?'—現在':'—present');
    // Titles combine a page name with the site name.
    if(text.includes(' — PENGZHONGHAI')) return s.replace(text.split(' — ')[0],dict.get(text.split(' — ')[0])?.[lang]||text.split(' — ')[0]);
    if(text==='PENGZHONGHAI — 经历与创作') return 'PENGZHONGHAI — '+dict.get('经历与创作')[lang];
    let out=s;
    for(const [key,value] of Object.entries(fragments)) if(out.includes(key)) out=out.replace(key,value[lang]);
    if(out!==s) for(const [zh,ja,en] of [...prefs,['南极洲','南極','Antarctica'],['北极地区','北極圏','Arctic'],['中国香港','香港（中国）','Hong Kong, China'],['韩国','韓国','South Korea'],['卡塔尔','カタール','Qatar']]) out=out.replace(zh,lang==='ja'?ja:en);
    return out;
  }
  function visit(node) {
    if(node.nodeType===Node.TEXT_NODE) {
      if(node.parentElement?.closest('script,style,.language-switch'))return;
      const next=translate(node.nodeValue); if(next!==node.nodeValue)node.nodeValue=next;
    } else if(node.nodeType===Node.ELEMENT_NODE) {
      if(node.matches('script,style,.language-switch'))return;
      ['aria-label','title','alt','placeholder'].forEach(attr=>{if(node.hasAttribute(attr)){const val=node.getAttribute(attr);const translated=translate(val);if(translated!==val)node.setAttribute(attr,translated);}});
      [...node.childNodes].forEach(visit);
    }
  }
  function links() {
    document.querySelectorAll('.language-switch a').forEach(a=>{const target=new URL(location.href);target.searchParams.set('lang',a.dataset.lang);a.href=target.pathname+target.search+target.hash;a.setAttribute('aria-current',String(a.dataset.lang===lang));});
    document.querySelectorAll('a[href]').forEach(a=>{if(a.closest('.language-switch'))return; const target=new URL(a.getAttribute('href'),location.href);if(target.origin===location.origin&&/\.html$/.test(target.pathname)){target.searchParams.set('lang',lang);a.href=target.pathname+target.search+target.hash;}});
  }
  visit(document.documentElement);links();
  document.querySelectorAll('meta[name=description],meta[property="og:description"]').forEach(el=>el.content=translate(el.content));
  const observer=new MutationObserver(records=>{observer.disconnect();for(const record of records){if(record.type==='characterData')visit(record.target);else record.addedNodes.forEach(visit);} observer.observe(document.body,{childList:true,subtree:true,characterData:true});});
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  document.querySelectorAll('meta[property="og:title"]').forEach(el=>el.content=translate(el.content));
  window.PZ_I18N={lang,translate,refreshLinks:links};
})();
