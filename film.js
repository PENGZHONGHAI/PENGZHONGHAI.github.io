(() => {
const dialog=document.querySelector('#film-lightbox');if(!dialog)return;
let trigger,overflow;
document.querySelectorAll('[data-film]').forEach(button=>button.addEventListener('click',()=>{trigger=button;overflow=document.body.style.overflow;const img=dialog.querySelector('img');img.src=button.dataset.film;img.alt=button.querySelector('img').alt;dialog.querySelector('p').textContent=img.alt;dialog.showModal();document.body.style.overflow='hidden';}));
dialog.querySelector('.film-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.style.overflow=overflow||'';trigger?.focus({preventScroll:true});});
})();
