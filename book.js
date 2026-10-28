(() => {
 const dialog=document.getElementById('book-reader'),image=document.getElementById('reader-image'),canvas=document.getElementById('reader-canvas'),viewport=document.getElementById('reader-viewport');
 const t=s=>window.PZ_I18N?.translate(s)||s;
 const w=(zh,ja,en)=>({zh,ja,en}[window.PZ_I18N?.lang||'zh']);
 let index=1,mode='spread',zoomed=false,returnFocus=null,oldOverflow='';
 const path=n=>'assets/16901/spread-'+String(n).padStart(2,'0');
 const total=window.PZ_BOOK.spreads.length;
 const thumbs=document.getElementById('reader-thumbs');
 for(let i=1;i<=total;i++){
   const button=document.createElement('button');button.type='button';button.dataset.spread=i;button.setAttribute('aria-label',w('第'+i+'组内页',i+'組目の見開き','Spread '+i));
   const thumb=document.createElement('img');thumb.src=path(i)+'-thumb.webp';thumb.alt='';thumb.loading='lazy';thumb.width=75;thumb.height=53;
   const num=document.createElement('span');num.textContent=String(i).padStart(2,'0');button.append(thumb,num);button.onclick=()=>{index=i;update();};thumbs.append(button);
 }
 function update(){
   image.src=path(index)+(zoomed?'.jpg':'.webp');image.alt=w('《16901公里》第'+index+'组公开内页','『16901キロ』公開見開き '+index,'16901 km · public preview spread '+index);
   document.getElementById('reader-original').href=path(index)+'.jpg';
   document.getElementById('reader-counter').textContent=String(index).padStart(2,'0')+' / '+total+' · '+w('原页面公开内页','元ページの公開見開き','Public preview from the original page');
   document.getElementById('reader-prev').disabled=index===1;document.getElementById('reader-next').disabled=index===total;
   canvas.className='reader-canvas mode-'+mode+(zoomed?' zoomed':'');
   document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
   const zoom=document.getElementById('reader-zoom');zoom.setAttribute('aria-pressed',String(zoomed));zoom.textContent=t(zoomed?'适应屏幕':'放大阅读');
   thumbs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-current',String(Number(b.dataset.spread)===index)));
   viewport.scrollTop=0;viewport.scrollLeft=0;
 }
 function open(n){index=Math.max(1,Math.min(total,Number(n)||1));mode='spread';zoomed=false;returnFocus=document.activeElement;oldOverflow=document.body.style.overflow;update();dialog.showModal();document.body.style.overflow='hidden';}
 document.querySelectorAll('[data-read]').forEach(button=>button.addEventListener('click',()=>open(button.dataset.read)));
 document.getElementById('reader-close').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{document.body.style.overflow=oldOverflow;returnFocus?.focus({preventScroll:true});});
 dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
 document.getElementById('reader-prev').onclick=()=>{if(index>1){index--;update();}};
 document.getElementById('reader-next').onclick=()=>{if(index<total){index++;update();}};
 document.querySelectorAll('[data-mode]').forEach(button=>button.onclick=()=>{mode=button.dataset.mode;update();});
 document.getElementById('reader-zoom').onclick=()=>{zoomed=!zoomed;update();};
 dialog.addEventListener('keydown',event=>{if(zoomed)return;if(event.key==='ArrowLeft'&&index>1){event.preventDefault();index--;update();}if(event.key==='ArrowRight'&&index<total){event.preventDefault();index++;update();}});
})();
