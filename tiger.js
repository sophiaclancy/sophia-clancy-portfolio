window.startTigerStage = function(){
  var DIR='./tiger/', FALL='assets/logo-tiger-alpha.png', fb=false, H=62, LIFT=.26, REST=1200, LAG=.55, GAP=.70;
  var SEQ=[
    {f:'walk',d:1000,x:-14,lift:0,gait:.30},
    {f:'crouch',d:440,x:10,lift:0,gait:.12},
    {f:'run',d:340,x:15,lift:0,gait:.55},
    {f:'jump',d:460,x:28,lift:1,gait:0},
    {f:'pounce',d:380,x:45,lift:.42,gait:0},
    {f:'catch',d:720,x:55,lift:0,gait:.06,hold:1},
    {f:'bat',d:360,x:58,lift:0,gait:.10,hold:1},
    {f:'chase',d:420,x:62,lift:0,gait:.55,imp:1},
    {f:'run2',d:360,x:76,lift:0,gait:.55},
    {f:'exit',d:980,x:90,lift:0,gait:.30}
  ];
  var TOTAL=SEQ.reduce(function(s,x){return s+x.d},0), KT=[], KX=[], t=0;
  SEQ.forEach(function(s){KT.push(t);KX.push(s.x);t+=s.d;}); KT.push(TOTAL);KX.push(118);

  var n=KT.length,d=[],m=[],i;
  for(i=0;i<n-1;i++) d[i]=(KX[i+1]-KX[i])/(KT[i+1]-KT[i]);
  m[0]=d[0];m[n-1]=d[n-2];
  for(i=1;i<n-1;i++){
    if(d[i-1]*d[i]<=0){m[i]=0;}
    else{var w1=2*(KT[i+1]-KT[i])+(KT[i]-KT[i-1]),w2=(KT[i+1]-KT[i])+2*(KT[i]-KT[i-1]);
      m[i]=(w1+w2)/(w1/d[i-1]+w2/d[i]);}
  }
  function sx(tt){
    var i=0; while(i<KT.length-2&&tt>KT[i+1])i++;
    var h=KT[i+1]-KT[i],s=(tt-KT[i])/h,s2=s*s,s3=s2*s;
    return (2*s3-3*s2+1)*KX[i]+(s3-2*s2+s)*h*m[i]+(-2*s3+3*s2)*KX[i+1]+(s3-s2)*h*m[i+1];
  }

  var st=document.getElementById('tigerStage'),
      sp=document.getElementById('tigerSprite'),
      bl=document.getElementById('tigerBall'),
      L=[document.getElementById('tigerA'),document.getElementById('tigerB')],
      topL=0,cur='',bx=null,bv=0,brot=0,li=-1,last=performance.now(),t0=last,
      rm=matchMedia('(prefers-reduced-motion:reduce)');
  if(!st||!sp||!L[0]||!L[1]) return;

  SEQ.forEach(function(s){var im=new Image();im.src=DIR+s.f+'.png';});
  var probe=new Image();
  probe.onerror=function(){ fb=true; L[0].src=FALL; L[0].style.opacity=1; L[1].style.opacity=0; };
  probe.src=DIR+'walk.png';
  function set(nm){ if(fb||cur===nm)return; cur=nm; var nx=1-topL;
    L[nx].src=DIR+nm+'.png'; L[nx].style.opacity=1; L[topL].style.opacity=0; topL=nx; }

  (function loop(now){
    requestAnimationFrame(loop);
    var w=st.clientWidth, dt=Math.min(.05,(now-last)/1000); last=now;
    if(rm.matches){ set('walk'); sp.style.transform='translateX('+(w*.12)+'px)'; return; }

    var tt=(now-t0)%(TOTAL+REST), rest=tt>TOTAL; if(rest) tt=TOTAL;
    var idx=0,acc=0;
    for(var i=0;i<SEQ.length;i++){ if(tt<acc+SEQ[i].d){idx=i;break;} acc+=SEQ[i].d; idx=i; }
    var s=SEQ[idx], p=Math.min(1,(tt-KT[idx])/s.d);
    set(rest?'walk':s.f);

    var x=w*(rest?-20:sx(tt))/100,
        lift=s.lift?Math.sin(p*Math.PI)*s.lift*LIFT*H:0,
        bob=rest?0:Math.abs(Math.sin(tt/1000*Math.PI*6.2)*s.gait*H*.045),
        sc=1;
    if(s.f==='jump'||s.f==='pounce') sc=1+Math.sin(p*Math.PI)*.035;
    sp.style.transform='translate3d('+x+'px,'+(-(lift+bob))+'px,0) scale('+(1/sc)+','+sc+')';

  })(performance.now());
};
