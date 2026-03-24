gsap.registerPlugin(ScrollTrigger);

/* ═══════════════ CURSOR ═══════════════ */
const isTouchDevice = window.matchMedia('(hover:none) and (pointer:coarse)').matches;
if (!isTouchDevice) {
  const cur  = document.getElementById('cur');
  const curR = document.getElementById('curR');
  let tx=0,ty=0,rx=0,ry=0;
  function cursorTick(){
    rx += (tx-rx)*0.1; ry += (ty-ry)*0.1;
    cur.style.transform  = `translate3d(${tx}px,${ty}px,0) translate(-50%,-50%)`;
    curR.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
    requestAnimationFrame(cursorTick);
  }
  cursorTick();
  document.addEventListener('mousemove', e=>{ tx=e.clientX; ty=e.clientY; }, {passive:true});
  document.querySelectorAll('a, button').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ cur.style.width='4px'; cur.style.height='4px'; curR.style.width='50px'; curR.style.height='50px'; });
    el.addEventListener('mouseleave',()=>{ cur.style.width='8px'; cur.style.height='8px'; curR.style.width='32px'; curR.style.height='32px'; });
  });
}

/* ═══════════════ DRAWER ═══════════════ */
let drawerOpen = false;
function openDrawer(){
  drawerOpen = true;
  document.body.style.overflow = 'hidden';
  document.getElementById('drawer-overlay').classList.add('open');
  gsap.to('#drawer', { x:0, duration:.55, ease:'power3.out' });
  gsap.fromTo('.drawer-nav li', { x:-20, opacity:0 }, { x:0, opacity:1, duration:.4, stagger:.07, ease:'power2.out', delay:.2 });
}
function closeDrawer(){
  drawerOpen = false;
  document.body.style.overflow = '';
  document.getElementById('drawer-overlay').classList.remove('open');
  gsap.to('#drawer', { x:'-100%', duration:.45, ease:'power3.in' });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawerOpen) closeDrawer(); });

/* ═══════════════ SYNC INTRO VIDEOS ═══════════════ */
(function(){
  const vids = document.querySelectorAll('.ipanel-video');
  if (vids.length >= 2){
    vids[0].addEventListener('canplay',()=>{ if(vids[1].readyState>=2) vids[1].currentTime=vids[0].currentTime; },{once:true});
    vids[1].addEventListener('canplay',()=>{ if(vids[0].readyState>=2) vids[1].currentTime=vids[0].currentTime; },{once:true});
  }
})();

/* ═══════════════ PRELOADER COUNTER ═══════════════ */
(function(){
  function mkTrack(id,vals){
    const t=document.getElementById(id);
    vals.forEach(v=>{ const s=document.createElement('span'); s.textContent=v; t.appendChild(s); });
    return t;
  }
  const TH=mkTrack('dth',['0','1']);
  const TT=mkTrack('dtt',['0','1','2','3','4','5','6','7','8','9']);
  const TO=mkTrack('dto',['0','1','2','3','4','5','6','7','8','9']);
  [TH,TT,TO].forEach(t=>{ t.style.transition='transform 0.12s cubic-bezier(0.25,0.46,0.45,0.94)'; });
  const setY=(t,i)=>{ t.style.transform=`translateY(${-(i*(window.innerWidth<768?80:130))}px)`; };
  gsap.to('#preLogo',{opacity:1,duration:.5,delay:.3,ease:'power2.out'});
  gsap.to('#preBar', {width:'100%',duration:3.4,delay:.2,ease:'none'});
  const DUR=3400, t0=performance.now()+200;
  const ease3=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
  let lH=-1,lT=-1,lO=-1;
  (function frame(now){
    const p=Math.min(Math.max(0,(now-t0)/DUR),1);
    const v=Math.round(ease3(p)*100);
    const H=Math.floor(v/100),T=Math.floor((v%100)/10),O=v%10;
    if(H!==lH){setY(TH,H);lH=H;}
    if(T!==lT){setY(TT,T);lT=T;}
    if(O!==lO){setY(TO,O);lO=O;}
    if(p<1){ requestAnimationFrame(frame); }
    else { setY(TH,1);setY(TT,0);setY(TO,0); setTimeout(exitPreloader,600); }
  })(performance.now());
})();

/* ════════════════════════════════════════
   PHASE 1 — PRELOADER EXIT
════════════════════════════════════════ */
function exitPreloader(){
  const tl = gsap.timeline({ defaults:{ ease:'power3.inOut' } });

  tl.to('#preloader', { xPercent:-100, duration:1.0 });
  tl.to('#ipanelL', { translateY:'0%', duration:1.1, ease:'power3.out' }, '-=0.2');
  tl.to('#ipanelR', { translateY:'0%', duration:1.1, ease:'power3.out' }, '-=0.85');
  tl.to('#divider', { scaleY:1, duration:0.5, ease:'power2.out' }, '-=0.5');
  tl.to('#panel-logo', { opacity:1, duration:0.55, ease:'power2.out' }, '-=0.3');
  tl.to('#labelLuxury', { opacity:1, y:0, duration:0.55, ease:'power2.out' }, '-=0.2');
  tl.to('#labelClassic', { opacity:1, y:0, duration:0.55, ease:'power2.out' }, '-=0.35');



  tl.call(()=>{
    gsap.to('#enter-arrow', { y:6, repeat:-1, yoyo:true, duration:0.8, ease:'power1.inOut' });
  });

  tl.call(()=>{
    document.getElementById('intro').classList.add('clickable');
    document.getElementById('ipanelL').classList.add('interactive');
    document.getElementById('ipanelR').classList.add('interactive');
    document.getElementById('intro').addEventListener('click', handlePanelClick, { once:true });
  });
}

/* ════════════════════════════════════════
   PHASE 2 — PANEL CLICK → RING → BLACK BG → REVEAL
════════════════════════════════════════ */
function handlePanelClick(){
  document.getElementById('intro').classList.remove('clickable');
  document.getElementById('intro').style.pointerEvents = 'none';

 
  gsap.to(['#labelLuxury','#labelClassic'], { opacity:0, y:-8, duration:0.3 });
  gsap.to('#divider', { opacity:0, duration:0.3 });
  gsap.to('#panel-logo', { opacity:0, duration:0.25 });

  gsap.to('#entry-ring', { opacity:1, duration:0.35, ease:'power2.out' });

  const erProgress = document.getElementById('erProgress');
  const erFill     = document.getElementById('erFill');

  gsap.set(erProgress, { strokeDashoffset: 452.4 });
  gsap.set(erFill,     { opacity: 0 });

  const ringTl = gsap.timeline({ onComplete: revealSite });

  ringTl.to(erProgress, {
    strokeDashoffset: 0,
    duration: 1.0,
    ease: 'power2.inOut'
  });

  ringTl.to(erFill, {
    opacity: 1,
    duration: 0.35,
    ease: 'power2.out'
  }, 0.75);

  ringTl.to({}, { duration: 0.3 });
}

/* ════════════════════════════════════════
   PHASE 3 — SITE REVEAL
════════════════════════════════════════ */
function revealSite(){
  const VW = window.innerWidth;
  const VH = window.innerHeight;

  const tl = gsap.timeline({ defaults:{ ease:'power3.inOut' } });

  tl.call(()=>{
    const ring = document.getElementById('entry-ring');
    ring.style.position  = 'fixed';
    ring.style.transform = 'translate(-50%, -50%)';
  });

  tl.to('#ipanelL',    { xPercent:-100, duration:0.95 }, 0.05);
  tl.to('#ipanelR',    { xPercent:100,  duration:0.95 }, 0.05);
  tl.to('#entry-ring', { x: -(VW), duration: 0.95, ease: 'power3.inOut' }, 0.05);
  tl.to('#white-cover', { opacity:0, duration:0.6, ease:'power2.out' }, 0.05);

  tl.call(()=>{
    ['#intro','#divider','#panel-logo','#preloader','#entry-ring','#enter-hint','#enter-arrow']
      .forEach(s=>{ const el=document.querySelector(s); if(el) el.style.display='none'; });
    setTimeout(()=>{
      const wc = document.getElementById('white-cover');
      if(wc) wc.style.display='none';
    }, 700);
  });

  tl.to('#nav', { opacity:1, duration:0.5, ease:'power2.out' }, 0.6);
  tl.fromTo('#heroTxt', { opacity:0, y:22 }, { opacity:1, y:0, duration:0.8, ease:'power2.out' }, 0.7);
  tl.call(()=>{ buildScrollScene(); });
}

/* ═══════════════ SCROLL SCENE ═══════════════ */
function buildScrollScene(){
  const isTabletOrSmaller = window.innerWidth <= 1024;
  if (isTabletOrSmaller) {
    gsap.set('#hero', { clearProps:'all' });
    gsap.set('#card-l', { clearProps:'all' });
    gsap.set('#card-r', { clearProps:'all' });
    ScrollTrigger.create({
      trigger:'#scene-wrap', start:'top+=50 top',
      onEnter:()=>document.getElementById('nav').classList.add('light'),
      onLeaveBack:()=>document.getElementById('nav').classList.remove('light'),
    });
    gsap.to('#heroTxt',{
      scrollTrigger:{trigger:'#scene-wrap',start:'top top',end:'50% top',scrub:1},
      opacity:0, y:-20
    });
    return;
  }
  const VW=window.innerWidth, VH=window.innerHeight;
  const GAP=16;
  const CARD_W=(VW-GAP*4)/3;
  const CARD_TOP=80;
  const CARD_H=VH-CARD_TOP-24;
  const leftFinalX=GAP;
  const centerFinalX=GAP+CARD_W+GAP;
  const rightFinalX=GAP+CARD_W+GAP+CARD_W+GAP;
  gsap.set('#card-l',{position:'absolute',top:CARD_TOP,left:leftFinalX+85,width:CARD_W-75,height:CARD_H,yPercent:110,opacity:1,borderRadius:0,zIndex:2});
  gsap.set('#card-r',{position:'absolute',top:CARD_TOP,left:rightFinalX-55,width:CARD_W-65,height:CARD_H,yPercent:110,opacity:1,borderRadius:0,zIndex:2});
  const scrollTl=gsap.timeline({
    scrollTrigger:{
      trigger:'#scene-wrap',start:'top top',end:'bottom bottom',
      scrub:0.8, fastScrollEnd:true, preventOverlaps:true,
    }
  });
  scrollTl.to('#hero',{top:CARD_TOP,left:centerFinalX+20,width:CARD_W-85,height:CARD_H,borderRadius:0,ease:'power2.inOut'},0);
  scrollTl.to('#heroTxt',{opacity:0,duration:.25,ease:'power2.in'},0);
  scrollTl.to('#cardTxt',{opacity:1,duration:.2,ease:'power2.out'},0.42);
  scrollTl.to('#card-l',{yPercent:0,ease:'power2.inOut'},0.28);
  scrollTl.to('#card-r',{yPercent:0,ease:'power2.inOut'},0.28);
  ScrollTrigger.create({
    trigger:'#scene-wrap',start:'top+=150 top',
    onEnter:()=>document.getElementById('nav').classList.add('light'),
    onLeaveBack:()=>document.getElementById('nav').classList.remove('light'),
  });
}

/* ═══════════════ SECTION REVEALS ═══════════════ */
function observeOnce(els,animFn){
  const observer=new IntersectionObserver((entries,obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ animFn(entry.target); obs.unobserve(entry.target); }
    });
  },{threshold:0.1});
  els.forEach(el=>observer.observe(el));
}
observeOnce([document.getElementById('catH')],el=>{ gsap.to(el,{opacity:1,y:0,duration:.7,ease:'power2.out'}); });
observeOnce(Array.from(document.querySelectorAll('.cat')),(el)=>{
  const i=Array.from(el.parentNode.children).indexOf(el);
  gsap.to(el,{opacity:1,y:0,duration:.55,delay:(i%4)*.09,ease:'power2.out'});
});
observeOnce(Array.from(document.querySelectorAll('.fi')),(el)=>{
  const i=Array.from(el.parentNode.children).indexOf(el);
  gsap.to(el,{opacity:1,x:0,duration:.65,delay:i*.07,ease:'power2.out'});
});
observeOnce([document.getElementById('arrivH')],el=>{ gsap.to(el,{opacity:1,y:0,duration:.7,ease:'power2.out'}); });
observeOnce(Array.from(document.querySelectorAll('.prod')),(el)=>{
  const i=Array.from(el.parentNode.children).indexOf(el);
  gsap.to(el,{opacity:1,y:0,duration:.55,delay:(i%4)*.09,ease:'power2.out'});
});

/* ═══════════════ FALL SCROLL ═══════════════ */
function scrollFall(d){
  document.getElementById('fallStrip').scrollBy({left:d*360,behavior:'smooth'});
}

/* ═══════════════ FALL STRIP GAP HOVER ═══════════════ */
(function(){
  const strip = document.getElementById('fallStrip');
  const cards = strip.querySelectorAll('.fi');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => strip.classList.add('gap-active'));
    card.addEventListener('mouseleave', () => strip.classList.remove('gap-active'));
  });
})();

/* ═══════════════ FB1 VIDEO CONTROLS ═══════════════ */
(function(){
  const card    = document.getElementById('fb1Card');
  const vid     = document.getElementById('fb1Video');
  const bar     = document.getElementById('fb1ProgressBar');
  const timeEl  = document.getElementById('fb1Time');
  const playIcon = document.getElementById('fb1PlayIcon');
  if (!card || !vid) return;

  function fmt(s){
    const m = Math.floor(s / 60);
    const sc = Math.floor(s % 60);
    return m + ':' + (sc < 10 ? '0' : '') + sc;
  }

  vid.addEventListener('timeupdate', () => {
    if (!vid.duration) return;
    bar.style.width = (vid.currentTime / vid.duration * 100) + '%';
    timeEl.textContent = fmt(vid.currentTime);
  });

  function updatePlayIcon(){
    if (vid.paused){
      playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    } else {
      playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    }
  }

  card.addEventListener('mouseenter', () => {
    vid.loop = false;
    if (vid.paused) vid.play();
    updatePlayIcon();
  });
  card.addEventListener('mouseleave', () => {
    vid.loop = true;
    if (vid.paused) vid.play();
    updatePlayIcon();
  });

  window.toggleFb1Play = function(e){
    e.stopPropagation();
    if (vid.paused) vid.play(); else vid.pause();
    updatePlayIcon();
  };

  window.seekFb1 = function(e){
    e.stopPropagation();
    const rect = document.getElementById('fb1ProgressWrap').getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (vid.duration) vid.currentTime = pct * vid.duration;
  };

  window.toggleFb1Mute = function(e){
    e.stopPropagation();
    vid.muted = !vid.muted;
    const icon = document.getElementById('fb1MuteIcon');
    if (vid.muted){
      icon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
    } else {
      icon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>';
    }
  };
})();

/* ═══════════════ RESIZE HANDLER ═══════════════ */
let resizeTimer;
window.addEventListener('resize',()=>{
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(()=>{ ScrollTrigger.refresh(); },300);
});