(() => {
 const dialog=document.querySelector('#design-lightbox');if(!dialog)return;let focus,overflow;
 document.querySelectorAll('[data-design-image]').forEach(b=>b.onclick=()=>{focus=b;overflow=document.body.style.overflow;const copy=b.cloneNode(true);copy.removeAttribute('data-design-image');copy.removeAttribute('aria-label');copy.disabled=true;document.querySelector('#design-lightbox-content').replaceChildren(copy);document.querySelector('#design-lightbox-caption').textContent=b.closest('figure').querySelector('figcaption').textContent;dialog.showModal();document.body.style.overflow='hidden';});document.querySelector('#design-close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{document.body.style.overflow=overflow||'';focus?.focus({preventScroll:true});});
})();
