/* The URL is the source of truth for map navigation and language changes. */
(() => {
 let restoring=false,booting=true;
 function links(){window.PZ_I18N?.refreshLinks();}
 function write(values,replace=false){if(restoring||booting)return;const u=new URL(location.href);['view','pref','province','country'].forEach(k=>u.searchParams.delete(k));Object.entries(values).forEach(([k,v])=>{if(v)u.searchParams.set(k,v);});if(u.href!==location.href)history[replace?'replaceState':'pushState']({},'',u);links();}
 const baseChoose=choose,baseChina=window.PZ_CHINA_UI.open,baseVisit=openVisitDate,baseCountry=window.PZ_MONTHS.openCountry;
 choose=function(name){if(name==='日本')write({view:'japan'});return baseChoose(name);};
 window.PZ_CHINA_UI.open=function(){write({view:'china'});return baseChina();};
 openVisitDate=function(name){write(currentCountry==='中国'?{view:'china',province:name}:{view:'japan',pref:name});return baseVisit(name);};
 window.PZ_MONTHS.openCountry=function(name){write({country:name});const result=baseCountry(name),d=document.querySelector('#country-month-dialog');if(!d.dataset.stateBound){d.dataset.stateBound='true';d.addEventListener('close',()=>{if(!restoring)write({},true);});}return result;};
 document.querySelector('#visit-dialog').addEventListener('close',()=>{if(!restoring)write({view:currentCountry==='中国'?'china':'japan'},true);});
 document.querySelector('#back-world').addEventListener('click',()=>write({}));
 function restore(){restoring=true;document.querySelectorAll('dialog[open]').forEach(d=>d.close());const q=new URLSearchParams(location.search);const view=q.get('view');
  if(view==='japan'||view==='china'){
   if(view==='japan')baseChoose('日本');else baseChina();
   const name=q.get(view==='japan'?'pref':'province');
   if(name){const known=view==='japan'?window.PZ_JAPAN_MAP.places.some(p=>p.name===name):window.PZ_CHINA_MAP.regions.some(p=>p.name===name);if(known)setTimeout(()=>baseVisit(name),360);}
  }else{document.querySelector('#country-view').hidden=true;document.querySelector('.hero').style.display='';document.querySelector('.destinations').style.display='';document.querySelectorAll('[data-name]').forEach(e=>e.classList.remove('active'));if(q.get('country'))baseCountry(q.get('country'));}
  links();setTimeout(()=>{restoring=false;booting=false;},450);
 }
 addEventListener('popstate',restore);restore();
})();
