(() => {
 const t=s=>window.PZ_I18N?.translate(s)||s;
 const w=(zh,ja,en)=>({zh,ja,en}[window.PZ_I18N?.lang||'zh']);
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 let database,token=0,urls=[];
 function db(){if(!database)database=new Promise((resolve,reject)=>{const request=indexedDB.open('pz-travel-media',2);request.onupgradeneeded=()=>{const store=request.result.objectStoreNames.contains('media')?request.transaction.objectStore('media'):request.result.createObjectStore('media',{keyPath:'id'});if(!store.indexNames.contains('region'))store.createIndex('region','region');};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});return database;}
 async function mediaFor(region){const d=await db();return new Promise((resolve,reject)=>{const req=d.transaction('media').objectStore('media').index('region').getAll(IDBKeyRange.only(region));req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
 async function store(files){const d=await db();return new Promise((resolve,reject)=>{const tx=d.transaction('media','readwrite');files.forEach(f=>tx.objectStore('media').put(f));tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
 async function remove(id){const d=await db();return new Promise((resolve,reject)=>{const tx=d.transaction('media','readwrite');tx.objectStore('media').delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
 function date(r){if(!r.year)return `${r.date} · ${t('年份待确认')}`;return `${r.year} · ${r.date&&r.date!=='?'&&!r.uncertainYear?r.date.replaceAll('-','–'):t('月日待补')}`;}
 function render(name,country='日本'){
   document.querySelectorAll('#visit-dialog .month-media-details').forEach(d=>{const h=d.querySelector('#pref-history');if(h)d.before(h);d.remove();});
   const active=++token;urls.forEach(URL.revokeObjectURL);urls=[];
   const dialog=document.getElementById('visit-dialog');dialog.dataset.region=name;dialog.dataset.country=country;
   let host=document.getElementById('pref-history');if(!host){host=el('section','pref-history');host.id='pref-history';dialog.querySelector('label').before(host);}host.replaceChildren();
   const rows=country==='中国'?window.PZ_TRAVEL.forProvince(name):window.PZ_TRAVEL.forPrefecture(name);
   const key=country+':'+name;
   const monthHost=el('section');host.before(monthHost);dialog.querySelectorAll('.visit-month-panel').forEach(e=>e.remove());window.PZ_MONTHS.render(monthHost,name,country);
   host.append(el('h3','',w('本地区影像与原始地点资料','地域の写真・動画と元の訪問先資料','Regional media and original place material')));
   const status=el('p','media-storage-note',w('图片和视频保存在当前浏览器；不会自动同步到其他设备。','写真と動画はこのブラウザに保存され、他の端末には同期されません。','Photos and videos stay in this browser and do not sync to other devices.'));host.append(status);
   if(!dialog.querySelector('.region-dialog-close')){const close=el('button','region-dialog-close','×');close.type='button';close.setAttribute('aria-label',w('关闭','閉じる','Close'));close.onclick=()=>dialog.close('cancel');dialog.querySelector('form').prepend(close);}
   const table=el('table','region-table'),thead=el('thead'),head=el('tr');
   const labels=[w('具体地点','訪問先','Places'),w('备注','メモ','Notes'),w('图片／视频','写真・動画','Photos / video')];
   labels.forEach(label=>head.append(el('th','',label)));thead.append(head);table.append(thead);const body=el('tbody');table.append(body);
   const galleries=new Map();
   const makeMediaCell=(recordId)=>{
     const container=el('div','record-media');const gallery=el('div','media-gallery');galleries.set(recordId,gallery);container.append(gallery);
     const add=el('button','media-add',w('+ 添加图片／视频','+ 写真・動画を追加','+ Add photos / video'));add.type='button';
     const input=el('input');input.type='file';input.accept='image/*,video/*';input.multiple=true;input.hidden=true;container.append(input,add);
     add.onclick=()=>input.click();
     input.onchange=async()=>{
       const files=[...input.files];if(!files.length)return;
       add.disabled=true;add.textContent=w('正在保存…','保存中…','Saving…');
       try{
         const current=await mediaFor(key),newFiles=[];
         for(const file of files){
           if(!/^(image|video)\//.test(file.type))throw new Error(w('请选择图片或视频文件。','画像・動画ファイルを選択してください。','Please choose image or video files.'));
           if(current.some(m=>m.recordId===recordId&&m.name===file.name&&m.size===file.size&&m.modified===file.lastModified))continue;
           newFiles.push({id:crypto.randomUUID?.()||Date.now()+'-'+Math.random().toString(36).slice(2),region:key,recordId,name:file.name,size:file.size,modified:file.lastModified,type:file.type,blob:file,createdAt:Date.now()});
         }
         await store(newFiles);if(token===active)await fillGalleries();
         status.textContent=w('已保存在当前浏览器。请保留原始文件；清除网站数据会移除这些影像。','このブラウザに保存しました。元ファイルは保管してください。サイトデータを消すと削除されます。','Saved in this browser. Keep your original files; clearing site data removes these copies.');
       }catch(error){status.textContent=w('保存未成功：','保存できませんでした：','Could not save: ')+(error.message||w('存储空间不足或浏览器不允许保存。','容量不足、または保存が許可されていません。','Storage is full or unavailable.'));}
       finally{input.value='';add.disabled=false;add.textContent=w('+ 添加图片／视频','+ 写真・動画を追加','+ Add photos / video');}
     };
     return container;
   };
   rows.forEach(r=>{
     const row=el('tr');[t(r.place),r.note?t(r.note):'—'].forEach((text,i)=>{const td=el('td','',text);td.dataset.label=labels[i];row.append(td);});
     const td=el('td');td.dataset.label=labels[2];td.append(makeMediaCell(r.id));row.append(td);body.append(row);
   });
   if(rows.length)host.append(table);
   const general=el('section','region-general-media');general.append(el('h4','',w('本地区的其他影像','この地域のその他の写真・動画','Other media from this region')),makeMediaCell('region'));host.append(general);
   const link=el('a','history-link',w('在旅行总览中查看 →','旅の全記録で見る →','View in travel journal →'));link.href='travels.html?lang='+(window.PZ_I18N?.lang||'zh')+'&'+(country==='中国'?'province':'pref')+'='+encodeURIComponent(name);host.append(link);
   if(name==='滋贺县'&&country==='日本'){const project=el('a','',w('琵琶湖一周 · 影像专题 →','琵琶湖一周・映像特集 →','Around Lake Biwa · visual story →'));project.href='biwako.html?lang='+(window.PZ_I18N?.lang||'zh');project.style.cssText='display:block;margin-top:12px';host.append(project);}
   dialog.querySelector('.kicker').textContent=country==='中国'?'CHINA / TRAVEL RECORD':'JAPAN / TRAVEL RECORD';
   dialog.querySelector('form>p:not(.kicker)').textContent=w('按已确认清单展示年月；未提供的时间不作推测。','確認済みリストの年月を表示しています。未記入の時期は推測しません。','Year and month from the confirmed list. Missing months are not inferred.');
   const details=el('details','month-media-details');details.append(el('summary','',w('查看本地区影像与地点资料','地域の写真・動画と訪問先資料を見る','View regional media and place material')));host.before(details);details.append(host);
   async function fillGalleries(){
     const media=await mediaFor(key);if(active!==token)return;
     urls.forEach(URL.revokeObjectURL);urls=[];
     for(const [recordId,gallery] of galleries){
       gallery.replaceChildren();
       media.filter(m=>m.recordId===recordId).forEach(m=>{
         const item=el('figure','media-item');const src=URL.createObjectURL(m.blob);urls.push(src);
         const preview=el(m.type.startsWith('video/')?'video':'img');preview.src=src;
         if(preview.tagName==='VIDEO'){preview.controls=true;preview.preload='metadata';}else{preview.alt=m.name;preview.loading='lazy';}
         const caption=el('figcaption','',m.name);const del=el('button','media-remove',w('移除','削除','Remove'));del.type='button';del.onclick=async()=>{if(!confirm(w('移除当前浏览器保存的这份影像？原始文件不会受影响。','このブラウザの写真・動画を削除しますか？元ファイルには影響しません。','Remove this browser copy? Your original file will not be affected.')))return;try{await remove(m.id);await fillGalleries();}catch(e){status.textContent=w('移除失败，请重试。','削除できませんでした。','Could not remove; please try again.');}};
         item.append(preview,caption,del);gallery.append(item);
       });
     }
   }
   fillGalleries().catch(()=>{status.textContent=w('当前浏览器不允许保存影像；旅行记录仍可查看。','このブラウザでは写真・動画を保存できません。記録は閲覧できます。','Media storage is unavailable in this browser. Travel records can still be viewed.');});
 }
 window.PZ_REGION_RECORDS={render};
})();
