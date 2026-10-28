(() => {
 const stops=window.PZ_AU_ROUTE||[],lang=window.PZ_I18N?.lang||'zh';
 const text=(zh,ja,en)=>({zh,ja,en}[lang]);
 const formatDate=s=>lang==='zh'?s:s.replace(/(\d{2})\.(\d{2})/g,(_,m,d)=>lang==='ja'?Number(m)+'月'+Number(d)+'日':Number(d)+' '+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(m)-1]);
 function select(id){const stop=stops.find(s=>s.id===id);if(!stop)return;document.querySelector('#route-stop-name').textContent=stop[lang];document.querySelector('#route-stop-date').textContent=formatDate(stop.date);document.querySelector('#route-stop-note').textContent=stop.note[{zh:0,ja:1,en:2}[lang]];document.querySelectorAll('[data-stop]').forEach(el=>{const current=el.dataset.stop===id;el.classList.toggle('is-selected',current);if(el.tagName==='BUTTON')el.setAttribute('aria-pressed',String(current));});}
 document.querySelectorAll('[data-stop]').forEach(el=>{el.addEventListener('click',()=>select(el.dataset.stop));if(el.tagName.toLowerCase()==='g')el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(el.dataset.stop);}});});
 stops.forEach(stop=>{const el=document.querySelector('g[data-stop="'+stop.id+'"]');el?.setAttribute('aria-label',stop[lang]);const label=el?.querySelector('.route-place');if(label)label.textContent=stop[lang];const date=el?.querySelector('.route-date');if(date)date.textContent=formatDate(stop.date);});
 if(stops.length)select(stops[0].id);
})();
