/* Canonical month precision only. Legacy trip records and media IDs are untouched. */
(() => {
 const data=window.PZ_VISIT_MONTHS_DATA,lang=window.PZ_I18N?.lang||'zh';
 const w=(zh,ja,en)=>({zh,ja,en}[lang]),t=s=>window.PZ_I18N?.translate(s)||s;
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 const unique=values=>[...new Set(values)].sort();
 const valid=value=>/^\d{4}-(0[1-9]|1[0-2])$/.test(value);
 const countryName=name=>name==='香港'?'中国香港':name;
 const byAdmin=(name,country)=>data.records.filter(r=>r.admin===name&&(country==='中国'?['中国','中国香港','台湾'].includes(r.country):r.country===country));
 const byCountry=name=>data.records.filter(r=>r.country===countryName(name));
 const crosses=name=>data.records.filter(r=>r.kind==='cross-region'&&r.relatedAdmins.includes(name));
 function local(name,country){try{return JSON.parse(localStorage.getItem('pz_visit_months:'+country+':'+name)||'[]').filter(valid);}catch{return [];}}
 function months(records){return unique(records.flatMap(r=>r.months));}
 function groups(values){
   const dl=el('dl','visit-month-groups');
   for(const year of unique(values.map(m=>m.slice(0,4)))){
     const row=el('div','visit-month-year'),dt=el('dt','',year),dd=el('dd');
     values.filter(m=>m.startsWith(year+'-')).forEach(m=>{const n=Number(m.slice(5));const text=lang==='en'?new Intl.DateTimeFormat('en',{month:'short',timeZone:'UTC'}).format(new Date(Date.UTC(2000,n-1,1))):n+w('月','月','');const time=el('time','',text);time.dateTime=m;dd.append(time);});row.append(dt,dd);dl.append(row);
   }
   return dl;
 }
 function recordBlock(record){const section=el('section','visit-month-place');section.append(el('h4','',record.name[lang]),groups(record.months));return section;}
 const projectLinks={滋贺县:[['琵琶湖一周','琵琶湖一周','Around Lake Biwa'],'biwako.html'],浙江省:[['摄影与海报设计','写真とポスターデザイン','Photography and poster design'],'posters.html'],澳大利亚:[['16901公里','16901キロ','16,901 km'],'16901.html'],埃及:[['埃及影像专题','エジプトの映像特集','Across Egypt'],'egypt.html'],越南:[['越南影像专题','ベトナムの映像特集','Across Vietnam'],'vietnam.html']};
 function appendProject(host,key){const p=projectLinks[key];if(!p)return;const a=el('a','month-project-link',p[0][{zh:0,ja:1,en:2}[lang]]+' ↗');a.href=p[1]+'?lang='+lang;host.append(a);}
 function render(host,name,country='日本',isCountry=false){
   host.replaceChildren();host.className='visit-month-panel';
   const records=isCountry?byCountry(name):byAdmin(name,country),extra=isCountry?[]:local(name,country),all=unique([...months(records),...extra]);
   host.append(el('h3','',w('到访年月','訪問年月','Visited')));
   if(all.length)host.append(groups(all));else host.append(el('p','month-pending',country==='日本'&&!isCountry?w('已确认到访，年月待补。','訪問済み。年月は未記入です。','Visited; year and month not yet recorded.'):w('到访年月待补，不推测具体时间。','訪問年月は未記入です。時期の推測はしていません。','Visit months have not been recorded. No dates have been assumed.')));
   if(records.length>1){
     host.append(el('p','month-explanation',isCountry?w('按地点保留原始年月。','場所ごとの年月を残しています。','Original months are retained for each place.'):w('上方汇总本地区及已确认下属地点的年月；下方保留各地点原始记录。','上は地域内の訪問年月のまとめです。下には各場所の元の年月を残しています。','The overview combines this region and its confirmed places. The original months for each place appear below.')));
     const details=el('details','visit-place-details');details.append(el('summary','',w('按地点查看','場所別に見る','Browse by place')));records.forEach(r=>details.append(recordBlock(r)));host.append(details);
   }else if(records.length===1&&records[0].kind!=='admin'&&records[0].kind!=='country'){
     host.append(el('p','month-explanation',w('对应地点：','訪問先：','Place: ')+records[0].name[lang]));
   }
   if(extra.length){const p=el('p','month-explanation',w('含当前浏览器补充的年月。','このブラウザで追加した年月を含みます。','Includes months added in this browser.'));host.append(p);}
   if(!isCountry){const related=crosses(name);if(related.length){const cross=el('section','cross-region-visits');cross.append(el('h4','',w('相关跨县景点','関連する県境の地域','Related areas spanning prefectures')),el('p','month-explanation',w('以下年月只记录景点，不表示已确认到访本县一侧。','以下は地域自体の訪問年月です。この県側を訪れたと確定した記録ではありません。','These months belong to the geographic area. They do not confirm a visit to this prefecture’s side.')));related.forEach(r=>{cross.append(recordBlock(r));cross.append(el('p','month-related-admins',r.relatedAdmins.map(t).join(' / ')));});host.append(cross);}}
   appendProject(host,isCountry?name:name);
 }
 function openCountry(name){
   let d=document.getElementById('country-month-dialog');if(!d){d=el('dialog','country-month-dialog');d.id='country-month-dialog';d.setAttribute('aria-labelledby','country-month-title');const close=el('button','month-dialog-close','×');close.type='button';close.setAttribute('aria-label',w('关闭','閉じる','Close'));close.onclick=()=>d.close();const title=el('h2');title.id='country-month-title';const body=el('div');body.id='country-month-body';d.append(close,title,body);document.body.append(d);}
   d.querySelector('h2').textContent=t(name);render(d.querySelector('#country-month-body'),name,countryName(name),true);
   if(name==='美国')d.querySelector('#country-month-body').append(el('p','month-explanation',w('曾经生活过；66号公路自驾项目策划中。','居住経験あり。ルート66ドライブを計画中。','Previously lived here. A Route 66 road trip is in planning.')));
   d.showModal();d.scrollTop=0;
 }
 window.PZ_MONTHS={data,byAdmin,byCountry,crosses,months,unique,groups,render,local,valid,openCountry,appendProject};
})();
