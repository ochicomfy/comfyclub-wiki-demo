(() => {
 const root=document.documentElement, media=matchMedia('(prefers-color-scheme: dark)');
 let saved=null; try{saved=localStorage.getItem('comfyclub-theme')}catch(_){}
 if(!['light','dark'].includes(saved))saved=null;
 const buttons=[...document.querySelectorAll('.theme-toggle,.floating-theme-toggle')];
 function apply(theme){root.dataset.theme=theme;buttons.forEach(b=>{b.textContent=theme==='dark'?'☀':'☾';b.setAttribute('aria-label',theme==='dark'?'ライトモードに切り替える':'ダークモードに切り替える');b.title=b.getAttribute('aria-label')})}
 apply(saved||(media.matches?'dark':'light'));
 buttons.forEach(b=>b.addEventListener('click',()=>{saved=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('comfyclub-theme',saved)}catch(_){}apply(saved)}));
 media.addEventListener('change',e=>{if(!saved)apply(e.matches?'dark':'light')});
 const q=document.querySelector('#q'),kind=document.querySelector('#kind'),items=[...document.querySelectorAll('.item')];
 const grid=document.querySelector('#itemGrid'),groups=[];
 [...kind.options].filter(option=>option.value!=='all').forEach((option,index)=>{
  const members=items.filter(item=>item.dataset.kind===option.value);
  if(!members.length)return;
  const heading=document.createElement('h3');heading.className='item-group-heading';heading.id='item-group-'+index;
  grid.append(heading,...members);groups.push({heading,members,label:option.value});
 });
 const norm=t=>t.normalize('NFKC').toLocaleLowerCase('ja'), texts=items.map(x=>norm(x.dataset.text+' '+x.textContent));
 function run(){const terms=norm(q.value).trim().split(/\s+/).filter(Boolean);let n=0;items.forEach((x,i)=>{const ok=(kind.value==='all'||x.dataset.kind===kind.value)&&terms.every(t=>texts[i].includes(t));x.hidden=!ok;if(ok)n++});groups.forEach(group=>{const count=group.members.filter(item=>!item.hidden).length;group.heading.hidden=count===0||kind.value!=='all';group.heading.textContent=group.label+'（'+count+'件）'});document.querySelector('#empty').hidden=n>0;document.querySelector('#resultCount').textContent=`${n}件のアイテム`}
 q.addEventListener('input',run);kind.addEventListener('change',run);run();
 const links=[...document.querySelectorAll('.nav a,.mobile-bottom a')];
 function mark(id){links.forEach(a=>{if(a.hash==='#'+id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}
 mark(location.hash.slice(1)||'items');addEventListener('hashchange',()=>mark(location.hash.slice(1)));
 const sections=['items','events','about'].map(id=>document.getElementById(id));
 let queued=false;
 function updateNav(){queued=false;const boundary=innerWidth<=520?80:150;let active=sections[0].id;sections.forEach(section=>{if(section.getBoundingClientRect().top<=boundary)active=section.id});if(scrollY+innerHeight>=document.documentElement.scrollHeight-3)active='about';mark(active)}
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateNav)}},{passive:true});
 addEventListener('resize',updateNav);updateNav();
})();
