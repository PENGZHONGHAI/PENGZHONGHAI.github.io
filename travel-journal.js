(() => {
 const M=window.PZ_MONTHS,lang=window.PZ_I18N.lang,t=window.PZ_I18N.translate,w=(zh,ja,en)=>({zh,ja,en}[lang]);
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 const params=new URLSearchParams(location.search),pref=params.get('pref'),province=params.get('province');
 const form=document.getElementById('archive-filters'),year=document.getElementById('year-filter'),country=document.getElementById('country-filter'),search=document.getElementById('place-filter');
 M.unique(M.data.records.flatMap(r=>r.months.map(m=>m.slice(0,4)))).forEach(y=>year.append(new Option(y,y)));
 M.unique(M.data.records.map(r=>r.country)).forEach(c=>country.append(new Option(t(c),c)));
 let admin=pref||province;if(admin){search.value=t(admin);if(pref)country.value='日本';}
 function render(){
   const q=search.value.trim().toLocaleLowerCase();
   const selected=M.data.records.filter(r=>(!country.value||country.value===r.country)&&(!year.value||r.months.some(m=>m.startsWith(year.value+'-')))&&(!q||[...Object.values(r.name),r.country,t(r.country),r.admin||'',t(r.admin||''),...r.relatedAdmins,...r.relatedAdmins.map(t)].some(s=>s.toLocaleLowerCase().includes(q))));
   selected.sort((a,b)=>a.months[0].localeCompare(b.months[0])||a.id.localeCompare(b.id));
   const host=document.getElementById('archive-records');host.replaceChildren();
   document.getElementById('archive-count').textContent=w('已更新地点列表','訪問先の一覧を更新しました','Place list updated');
   if(!selected.length){host.append(el('p','archive-empty',w('没有匹配的年月记录。','該当する訪問年月はありません。','No matching visit months.')));return;}
   selected.forEach(r=>{
     const block=el('details','month-archive-place');block.id=r.id;block.open=!!(year.value||country.value||q);const heading=el('summary','',r.name[lang]);block.append(heading);
     const location=[t(r.country),...(r.admin?[t(r.admin)]:[]),...(r.kind==='cross-region'?r.relatedAdmins.map(t):[])];block.append(el('p','',location.join(' / ')));
     if(r.kind==='cross-region')block.append(el('p','',w('跨县景点；不指定具体到访侧。','県境の地域。訪問した県側は特定していません。','Area spanning prefectures; the side visited is unspecified.')));
     block.append(M.groups(year.value?r.months.filter(m=>m.startsWith(year.value+'-')):r.months));
     if(r.admin){const a=el('a','',w('在地图中查看 →','地図で見る →','View on map →'));a.href='explore.html?lang='+lang+'&view='+(r.country==='日本'?'japan&pref=':'china&province=')+encodeURIComponent(r.admin);block.append(a);}
     M.appendProject(block,r.admin||r.country);host.append(block);
   });
 }
 form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',render);form.addEventListener('change',render);form.addEventListener('reset',()=>setTimeout(render,0));render();
})();
