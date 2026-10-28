(() => {
 const t=s=>window.PZ_I18N?.translate(s)||s,lang=()=>window.PZ_I18N?.lang||'zh',M=window.PZ_MONTHS;
 const w=(zh,ja,en)=>({zh,ja,en}[lang()]);
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
 function decorate(){
   const map=document.getElementById('country-map');map.dataset.country='japan';map.setAttribute('aria-label',t('日本47个都道府县地图'));
   document.querySelectorAll('.country-place').forEach((button,i)=>{
     const name=window.PZ_JAPAN_MAP.places[i].name,months=M.unique([...M.months(M.byAdmin(name,'日本')),...M.local(name,'日本')]);
     button.dataset.place=name;button.replaceChildren(el('span','pref-name',t(name)));
     button.append(el('small','pref-dates',months.length?M.unique(months.map(m=>m.slice(0,4))).join(' · '):w('已到访 · 年月待补','訪問済み · 年月未記入','Visited · months pending')));
     button.title=t(name)+' · '+(months.map(m=>m.replace('-','.')).join(' / ')||w('到访年月待补','訪問年月未記入','Visit months pending'));
   });
   let summary=document.getElementById('pref-record-summary');if(!summary){summary=el('p','record-summary');summary.id='pref-record-summary';document.getElementById('country-places').before(summary);}
   summary.textContent=w('日本47都道府县全部到访。点击地区，按年份查看到访年月与具体地点。','47都道府県すべて訪問済み。地域を選ぶと、訪問年月と訪問先を年別に表示します。','All 47 prefectures visited. Select a region to see visit months by year and the places visited.');
   map.querySelectorAll('path[data-place]').forEach(path=>{path.querySelectorAll('title').forEach(t=>t.remove());const months=M.unique([...M.months(M.byAdmin(path.dataset.place,'日本')),...M.local(path.dataset.place,'日本')]);const title=document.createElementNS('http://www.w3.org/2000/svg','title');title.textContent=t(path.dataset.place)+' · '+(months.map(m=>m.replace('-','.')).join(' / ')||w('已到访 · 年月待补','訪問済み · 年月未記入','Visited · months pending'));path.append(title);});
 }
 function showHistory(name,country='日本'){window.PZ_REGION_RECORDS.render(name,country);}
 const link=el('a','travel-archive-link',w('到访年月档案 →','訪問年月アーカイブ →','Visit month archive →'));link.href='travels.html?lang='+lang();document.querySelector('.hint').after(link);document.querySelector('.country-sidebar').append(link.cloneNode(true));
 window.PZ_MAP_RECORDS={decorate,showHistory};

})();
