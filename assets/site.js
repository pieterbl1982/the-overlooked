
(async()=>{
 const root=document.documentElement.dataset.root||'';
 const group=document.documentElement.dataset.group||'ALL';
 const stories=window.__STORIES__ || [];
 // Fair random order per new page load, stable for the duration of viewing.
 const randomize=arr=>{for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr};
 const selected=randomize(stories.filter(x=>group==='ALL'||x.group===group));
 const gallery=document.querySelector('#gallery');
 const count=document.querySelector('#count'); count.textContent=selected.length+' AUDIO STORIES';
 if(group!=='ALL'&&!selected.length){
  gallery.outerHTML='<div class="group-error"><b>IGM '+group+' — not published yet.</b><p>The 57 stories have been imported, but the A/B group membership still needs to be verified against the class lists. No works have been arbitrarily assigned.</p></div>';
  return;
 }
 const audio=document.querySelector('#audio');
 const player=document.querySelector('#player');
 const toggle=document.querySelector('#toggle');
 const seek=document.querySelector('#seek');
 const time=document.querySelector('#time');
 const title=document.querySelector('#player-title');
 const close=document.querySelector('#close');
 const playIcon=(playing)=>{toggle.textContent=playing?'Ⅱ':'▶'};
 function select(story){
  audio.pause();audio.src=root+story.audio;audio.load();
  title.textContent=story.title;
  player.classList.add('on');
  const p=audio.play(); if(p&&p.catch)p.catch(()=>{});
  playIcon(true);
 }
 for(const s of selected){
  const el=document.createElement('article');el.className='story';
  const button=document.createElement('button');button.className='art';button.setAttribute('aria-label','Listen: '+s.title);
  if(s.image){const pic=document.createElement('img');pic.src=root+s.image;pic.alt='Artwork for '+s.title;pic.loading='lazy';button.append(pic);}
  else {const nop=document.createElement('div');nop.className='nopicture';nop.textContent='Photograph not yet available';button.append(nop);}
  const sticker=document.createElement('span');sticker.className='sticker';sticker.textContent='▶';button.append(sticker);
  button.onclick=()=>select(s);
  const h=document.createElement('h3');h.textContent=s.title;
  el.append(button,h);gallery.append(el);
 }
 toggle.onclick=()=>{if(audio.paused)audio.play();else audio.pause()};
 audio.onplay=()=>playIcon(true);audio.onpause=()=>playIcon(false);
 audio.ontimeupdate=()=>{if(audio.duration){seek.value=Math.round(1000*audio.currentTime/audio.duration);time.textContent=format(audio.currentTime)+' / '+format(audio.duration)}};
 function format(n){return Math.floor(n/60)+':'+('0'+Math.floor(n%60)).slice(-2)}
 seek.oninput=()=>{if(audio.duration)audio.currentTime=audio.duration*seek.value/1000};
 close.onclick=()=>{audio.pause();player.classList.remove('on')};
})();
