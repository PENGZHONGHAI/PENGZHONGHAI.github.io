(() => {
 const data=window.PZ_CHINA_MAP,T=window.PZ_TRAVEL,NS='http://www.w3.org/2000/svg';
 const t=s=>window.PZ_I18N?.translate(s)||s,w=(zh,ja,en)=>({zh,ja,en}[window.PZ_I18N?.lang||'zh']);
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
 const short=s=>s.replace(/特别行政区|壮族自治区|回族自治区|维吾尔自治区|自治区|省|市/g,'');
 function open(){
   currentCountry='中国';const transition=document.getElementById('zoom-transition');transition.classList.add('active');
   setTimeout(()=>{
     document.querySelector('.hero').style.display='none';document.querySelector('.destinations').style.display='none';document.getElementById('country-view').hidden=false;
     document.getElementById('country-name').textContent=t('中国');document.getElementById('country-description').textContent=w('点击省级地区，查看到访年月、具体地点与影像。','省級地域を選んで、訪問年月・場所・写真と動画を表示。','Select a province-level region to see visit months, places and media.');
     const map=document.getElementById('country-map'),list=document.getElementById('country-places');map.replaceChildren();list.replaceChildren();map.setAttribute('viewBox',data.viewBox);map.setAttribute('aria-label',w('中国省级地区旅行地图','中国省級地域の旅の地図','China province-level travel map'));map.dataset.country='china';
     data.regions.forEach(region=>{
       const rows=region.name?window.PZ_MONTHS.byAdmin(region.name,'中国'):[],path=document.createElementNS(NS,'path');path.setAttribute('d',region.path);path.setAttribute('class',region.name?'china-region '+(rows.length?'recorded':'no-record'):'china-boundary-detail');
       if(region.name){path.dataset.province=region.name;path.setAttribute('tabindex','0');path.setAttribute('role','button');path.setAttribute('aria-label',t(region.name));const title=document.createElementNS(NS,'title');title.textContent=t(region.name);path.append(title);const select=()=>openVisitDate(region.name);path.addEventListener('click',select);path.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}});}
       map.append(path);
     });
     // Labels use source centroids; the smallest coastal regions have short leaders.
     const special={'北京市':[512,165],'天津市':[553,198],'上海市':[610,344],'香港特别行政区':[535,469],'澳门特别行政区':[466,492]};
     data.regions.filter(r=>r.name&&r.center).forEach(region=>{
       const g=document.createElementNS(NS,'g');g.setAttribute('class','china-map-label');g.dataset.province=region.name;const [x,y]=special[region.name]||region.center;
       if(special[region.name]){const line=document.createElementNS(NS,'path');line.setAttribute('d',`M${region.center}L${x},${y}`);g.append(line);}
       const text=document.createElementNS(NS,'text');text.setAttribute('x',x);text.setAttribute('y',y);text.setAttribute('text-anchor','middle');text.textContent=(window.PZ_I18N?.lang||'zh')==='zh'?short(region.name):t(region.name);g.append(text);g.addEventListener('click',()=>openVisitDate(region.name));map.append(g);
     });
     data.regions.filter(r=>r.name).forEach(region=>{
       const rows=window.PZ_MONTHS.byAdmin(region.name,'中国'),months=window.PZ_MONTHS.months(rows);
       const b=el('button','country-place '+(rows.length?'has-record':'pending-record'));b.dataset.province=region.name;b.append(el('span','pref-name',t(region.name)));
       b.append(el('small','pref-dates',window.PZ_MONTHS.unique(months.map(m=>m.slice(0,4))).join(' · ')||w('年月待补','年月未記入','Months pending')));
       b.onclick=()=>openVisitDate(region.name);list.append(b);
     });
     let summary=document.getElementById('pref-record-summary');if(!summary){summary=el('p','record-summary');summary.id='pref-record-summary';list.before(summary);}
     summary.textContent=w('森林绿：已有到访年月；灰色：本次清单中尚无年月。点击地区按年份查看。','緑：訪問年月あり。灰：今回のリストでは年月未記入。地域を選ぶと年別に表示します。','Green: confirmed visit months. Grey: no month in this list. Select a region to browse by year.');
     const note=document.querySelector('.country-note');note.replaceChildren(document.createTextNode(w('省级边界已保存在网站本地。地图来源：','省級境界はサイト内に保存。地図出典：','Province-level boundaries stored locally. Map source: ')));const a=el('a','', 'DataV.GeoAtlas');a.href='https://datav.aliyun.com/portal/school/atlas/area_selector';a.target='_blank';a.rel='noopener';note.append(a);
     window.scrollTo(0,0);requestAnimationFrame(()=>transition.classList.remove('active'));
   },300);
 }
 window.PZ_CHINA_UI={open};

})();
