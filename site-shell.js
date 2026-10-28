(() => {
 const header=document.querySelector('header.site-header'),toggle=header?.querySelector('.menu-toggle');
 function close(){header?.classList.remove('menu-open');toggle?.setAttribute('aria-expanded','false');}
 toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));header.classList.toggle('menu-open',open);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&header?.classList.contains('menu-open')){close();toggle.focus();}});
 header?.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',close));
 const key='pz-language-scroll:'+location.pathname;
 try{const value=JSON.parse(sessionStorage.getItem(key)||'null');if(value&&Date.now()-value.time<30000){requestAnimationFrame(()=>{scrollTo(0,value.y);sessionStorage.removeItem(key);});}}catch{}
 document.querySelectorAll('.language-switch a').forEach(a=>a.addEventListener('click',()=>{try{sessionStorage.setItem(key,JSON.stringify({y:scrollY,time:Date.now()}));}catch{}}));
})();
