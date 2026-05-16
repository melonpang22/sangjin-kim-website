import { useState, useEffect, useRef, useCallback } from "react";
import { client } from "./sanity";
 
const C = {
  bg: "#1E1E1E", surface: "#2A2A2A", surfaceAlt: "#232323",
  border: "#3A3A38", borderLight: "#4A4A45",
  gold: "#B8A472", goldLight: "#D4CFC0", goldDim: "#8A7D5A",
  text: "#E8E3D8", muted: "#9A9590", dim: "#6A6560",
};
const F = { d: "'Cormorant Garamond',Georgia,serif", b: "'Montserrat','Helvetica Neue',sans-serif" };
const PAGES = ["Home","Biography","Schedule","Video","Gallery","News","Contact"];
const BANNERS = {
  Biography:{hue:220,quote:"The stage is not merely a place to sing, but a world to inhabit."},
  Schedule:{hue:35,quote:"Every note carries a lifetime of emotion."},
  Video:{hue:200,quote:"Music speaks what words cannot express."},
  Gallery:{hue:30,quote:"To stand on stage is to share one's soul with the world."},
  News:{hue:215,quote:"Art is the bridge between silence and meaning."},
  Contact:{hue:25,quote:"I look forward to hearing from you."},
};
 
function useSanity(query, fallback) {
  const [data, setData] = useState(null);
  useEffect(() => {
    client.fetch(query).then(result => {
      if (result && ((Array.isArray(result) && result.length > 0) || (!Array.isArray(result) && Object.keys(result).length > 0))) setData(result);
    }).catch(() => {});
  }, [query]);
  return data || fallback;
}
 
function Nav({current,go,scrolled}){
  const [open,setOpen]=useState(false);
  return(<>
    <div style={{position:"fixed",top:0,left:0,right:0,height:"12px",background:"#1E1E1E",zIndex:101}}/><nav style={{position:"fixed",top:12,left:0,right:0,zIndex:100,background:scrolled?"rgba(30,30,30,0.92)":"transparent",backdropFilter:scrolled?"blur(16px)":"none",borderBottom:scrolled?`1px solid ${C.border}`:"none",transition:"all 0.5s"}}>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"0 48px",display:"flex",alignItems:"center",justifyContent:"space-between",height:88}}>
        <button onClick={()=>go("Home")} style={{background:"none",border:"none",cursor:"pointer",padding:0}}><span style={{fontFamily:F.d,fontSize:26,fontWeight:600,color:C.gold,letterSpacing:4}}>JIN</span></button>
        <div className="dnv" style={{display:"flex",gap:16}}>{PAGES.filter(p=>p!=="Home").map(p=><button key={p} onClick={()=>go(p)} style={{background:current===p?`${C.gold}18`:"none",border:"none",cursor:"pointer",padding:"8px 22px",borderRadius:4,color:current===p?C.gold:C.muted,fontSize:13,fontFamily:F.b,fontWeight:500,letterSpacing:3,textTransform:"uppercase",transition:"all 0.3s"}}>{p}</button>)}</div>
        <button className="mbn" onClick={()=>setOpen(!open)} style={{display:"none",background:"none",border:"none",cursor:"pointer",color:C.gold,fontSize:22,padding:8}}>{open?"\u2715":"\u2630"}</button>
      </div>
      {open&&<div style={{background:"rgba(30,30,30,0.98)",padding:"8px 32px 24px",borderTop:`1px solid ${C.border}`}}>{PAGES.map(p=><button key={p} onClick={()=>{go(p);setOpen(false)}} style={{display:"block",width:"100%",textAlign:"left",padding:"14px 0",background:"none",border:"none",cursor:"pointer",color:current===p?C.gold:C.muted,fontSize:14,fontFamily:F.b,fontWeight:500,borderBottom:`1px solid ${C.border}`}}>{p}</button>)}</div>}
      <style>{`@media(max-width:768px){.dnv{display:none!important}.mbn{display:block!important}}`}</style>
    </nav>
  </>);
}
 
function PhotoBanner({hue,quote}){
  return(<div style={{position:"relative",width:"100%",height:280,display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,hsl(${hue},14%,19%),hsl(${hue+10},10%,13%))`,overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,background:"rgba(30,30,30,0.45)"}}/>
    <p style={{position:"relative",zIndex:1,fontFamily:F.d,fontSize:"clamp(18px,2.5vw,26px)",fontStyle:"italic",color:`${C.text}aa`,textAlign:"center",padding:"0 60px",lineHeight:1.7,letterSpacing:0.5,maxWidth:700}}>"{quote}"</p>
  </div>);
}
 
function SectionTitle({title}){
  return(<div style={{padding:"140px 0 0",maxWidth:1000,margin:"0 auto",paddingLeft:32,paddingRight:32}}>
    <span style={{fontFamily:F.b,fontSize:12,letterSpacing:6,color:C.gold,fontWeight:500,textTransform:"uppercase"}}>{title}</span>
    <div style={{width:40,height:1.5,background:C.gold,marginTop:12,opacity:0.6}}/>
  </div>);
}
 
function EmptyState({message}){
  return(<div style={{textAlign:"center",padding:"60px 0"}}><p style={{fontFamily:F.b,fontSize:14,color:C.dim}}>{message}</p></div>);
}
 
function Home(){
  const [idx,setIdx]=useState(0);
  const slides = useSanity(`*[_type=="homeSlide"]|order(order asc){"imageUrl":image.asset->url}`, []);
  const fallbackBgs = [
    `linear-gradient(135deg,hsl(25,18%,18%),hsl(30,15%,12%))`,
    `linear-gradient(135deg,hsl(220,15%,16%),hsl(210,12%,10%))`,
    `linear-gradient(135deg,hsl(35,20%,17%),hsl(28,16%,11%))`,
  ];
  const bgList = slides.length > 0 ? slides : fallbackBgs.map(bg=>({bg}));
  useEffect(()=>{if(bgList.length>1){const t=setInterval(()=>setIdx(i=>(i+1)%bgList.length),4000);return()=>clearInterval(t)}},[bgList.length]);
  return(<div style={{position:"relative",width:"100%",height:"100vh",overflow:"hidden"}}>
    {bgList.map((s,i)=><div key={i} style={{position:"absolute",inset:0,background:s.imageUrl?`url(${s.imageUrl}) center/cover`:s.bg,opacity:idx===i?1:0,transition:"opacity 1.8s ease"}}/>)}
    <div style={{position:"absolute",inset:0,background:"rgba(30,30,30,0.42)"}}/>
    <div style={{position:"relative",zIndex:2,height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"0 24px"}}>
      <div style={{fontSize:14,fontFamily:F.b,letterSpacing:7,color:C.gold,opacity:0.85,marginBottom:18,fontWeight:500}}>BARITONE</div>
      <h1 style={{fontFamily:F.d,fontSize:"clamp(40px,9vw,72px)",fontWeight:300,color:C.text,margin:0,letterSpacing:4,lineHeight:1.15}}>Sangjin Kim</h1>
      <div style={{width:56,height:1,background:C.gold,opacity:0.4,margin:"28px 0"}}/>
      {bgList.length>1&&<div style={{display:"flex",gap:8,marginTop:8}}>{bgList.map((_,i)=><button key={i} onClick={()=>setIdx(i)} style={{width:idx===i?22:6,height:6,borderRadius:3,border:"none",cursor:"pointer",background:idx===i?`${C.gold}99`:`${C.text}33`,transition:"all 0.4s",padding:0}}/>)}</div>}
    </div>
    <div style={{position:"absolute",bottom:36,left:0,right:0,zIndex:3,display:"flex",justifyContent:"center",gap:18}}>
      {[{l:"Instagram",h:"https://www.instagram.com/jin_kisa/",p:"M7.8,2H16.2C19.4,2,22,4.6,22,7.8V16.2A5.8,5.8,0,0,1,16.2,22H7.8C4.6,22,2,19.4,2,16.2V7.8A5.8,5.8,0,0,1,7.8,2M7.6,4A3.6,3.6,0,0,0,4,7.6V16.4A3.6,3.6,0,0,0,7.6,20H16.4A3.6,3.6,0,0,0,20,16.4V7.6A3.6,3.6,0,0,0,16.4,4H7.6M17.25,5.5A1.25,1.25,0,1,1,16,6.75A1.25,1.25,0,0,1,17.25,5.5M12,7A5,5,0,1,1,7,12A5,5,0,0,1,12,7M12,9A3,3,0,1,0,15,12A3,3,0,0,0,12,9Z"},{l:"YouTube",h:"https://www.youtube.com/@kisa4416",p:"M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64,21.78,8.27,21.84,9.07C21.91,9.87,21.94,10.56,21.94,11.16L22,12C22,14.19,21.84,15.8,21.56,16.83C21.31,17.73,20.73,18.31,19.83,18.56C19.36,18.69,18.5,18.78,17.18,18.84C15.88,18.91,14.69,18.94,13.59,18.94L12,19C7.81,19,5.2,18.84,4.17,18.56C3.27,18.31,2.69,17.73,2.44,16.83C2.31,16.36,2.22,15.73,2.16,14.93C2.09,14.13,2.06,13.44,2.06,12.84L2,12C2,9.81,2.16,8.2,2.44,7.17C2.69,6.27,3.27,5.69,4.17,5.44C4.64,5.31,5.5,5.22,6.82,5.16C8.12,5.09,9.31,5.06,10.41,5.06L12,5C16.19,5,18.8,5.16,19.83,5.44C20.73,5.69,21.31,6.27,21.56,7.17Z"}].map(({l,h,p})=>(
        <a key={l} href={h} target="_blank" rel="noopener noreferrer" title={l} style={{width:34,height:34,borderRadius:"50%",border:`1px solid ${C.text}33`,display:"flex",alignItems:"center",justifyContent:"center",transition:"border-color 0.3s",textDecoration:"none"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor=`${C.gold}88`} onMouseLeave={e=>e.currentTarget.style.borderColor=`${C.text}33`}>
          <svg width="15" height="15" viewBox="0 0 24 24"><path d={p} fill={C.goldLight}/></svg>
        </a>
      ))}
    </div>
  </div>);
}
 
function Biography(){
  const [lang,setLang]=useState("KR");
  const bio = useSanity(`*[_type=="biography"][0]{korean,english,"photoUrl":profilePhoto.asset->url}`, null);
  const text = bio ? (lang === "KR" ? bio.korean : bio.english) : null;
  return(<><SectionTitle title="Biography"/><PhotoBanner {...BANNERS.Biography}/>
    <div style={{maxWidth:1200,margin:"0 auto",padding:"48px 32px 80px"}}>
      <div style={{display:"flex",gap:8,marginBottom:40}}>{["KR","EN"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"10px 24px",borderRadius:4,cursor:"pointer",fontSize:11,fontFamily:F.b,fontWeight:600,letterSpacing:1.5,transition:"all 0.3s",background:lang===l?`${C.gold}22`:"transparent",border:`1px solid ${lang===l?C.gold:C.border}`,color:lang===l?C.gold:C.muted}}>{l==="KR"?"KOREAN":"ENGLISH"}</button>)}</div>
      {text?<div className="bl" style={{display:"flex",gap:80,alignItems:"flex-start"}}>
        <div style={{flex:1}}>{text.split("\n\n").map((p,i)=><p key={`${lang}-${i}`} style={{fontFamily:F.b,fontSize:16,lineHeight:2,color:C.text,margin:"0 0 24px"}}>{p}</p>)}</div>
        <div className="bp" style={{width:520,minWidth:520,height:720,borderRadius:4,background:bio.photoUrl?`url(${bio.photoUrl}) center/cover`:`linear-gradient(160deg,hsl(30,15%,22%),hsl(25,12%,16%))`,border:`1px solid ${C.borderLight}`,position:"sticky",top:100,display:"flex",alignItems:"center",justifyContent:"center"}}>{!bio.photoUrl&&<span style={{fontFamily:F.b,fontSize:12,color:C.dim,letterSpacing:2}}>PROFILE PHOTO</span>}</div>
      </div>:<EmptyState message="Add biography content in Sanity Studio"/>}
    </div>
    <style>{`@media(max-width:768px){.bl{flex-direction:column-reverse!important}.bp{width:100%!important;min-width:0!important;height:auto!important;aspect-ratio:3/4!important;position:static!important}}`}</style>
  </>);
}
 
function ScheduleDetail({s,onClose}){
  const [imgIdx,setImgIdx]=useState(0);
  const imgs=s.detailImages&&s.detailImages.length>0?s.detailImages:(s.photoUrl?[s.photoUrl]:[]);
  useEffect(()=>{
    const esc=e=>{if(e.key==="Escape")onClose()};
    document.addEventListener("keydown",esc);
    document.body.style.overflow="hidden";
    return()=>{document.removeEventListener("keydown",esc);document.body.style.overflow=""};
  },[onClose]);
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:200,background:"rgba(15,15,15,0.88)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.surface,borderRadius:8,border:`1px solid ${C.border}`,maxWidth:800,width:"100%",maxHeight:"90vh",overflowY:"auto",position:"relative"}}>
        {/* 닫기 버튼 */}
        <button onClick={onClose} style={{position:"sticky",top:0,float:"right",margin:"16px 16px 0 0",background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:22,lineHeight:1,zIndex:10}}>✕</button>
        <div style={{padding:"40px 48px 48px",clear:"both"}}>
          {/* 헤더 */}
          <p style={{fontFamily:F.b,fontSize:12,color:C.gold,letterSpacing:2,margin:"0 0 12px",textTransform:"uppercase"}}>{s.date}</p>
          <h2 style={{fontFamily:F.d,fontSize:"clamp(22px,3vw,34px)",color:C.text,margin:"0 0 8px",fontWeight:400,fontStyle:"italic",lineHeight:1.25}}>{s.title}</h2>
          {s.role&&<p style={{fontFamily:F.b,fontSize:14,color:C.goldLight,margin:"0 0 16px",letterSpacing:0.5}}>{s.role}</p>}
          <div style={{height:1,background:C.border,margin:"20px 0",opacity:0.5}}/>
          {/* 공연 정보 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"12px 32px",marginBottom:28}}>
            {s.venue&&<div><p style={{fontFamily:F.b,fontSize:11,color:C.dim,letterSpacing:1.5,margin:"0 0 4px",textTransform:"uppercase"}}>Venue</p><p style={{fontFamily:F.b,fontSize:14,color:C.muted,margin:0}}>{s.venue}</p></div>}
            {s.conductor&&<div><p style={{fontFamily:F.b,fontSize:11,color:C.dim,letterSpacing:1.5,margin:"0 0 4px",textTransform:"uppercase"}}>Conductor</p><p style={{fontFamily:F.b,fontSize:14,color:C.muted,margin:0}}>{s.conductor}</p></div>}
            {s.director&&<div><p style={{fontFamily:F.b,fontSize:11,color:C.dim,letterSpacing:1.5,margin:"0 0 4px",textTransform:"uppercase"}}>Director</p><p style={{fontFamily:F.b,fontSize:14,color:C.muted,margin:0}}>{s.director}</p></div>}
          </div>
          {/* 사진 슬라이더 */}
          {imgs.length>0&&<div style={{marginBottom:28}}>
            <div style={{position:"relative",borderRadius:6,overflow:"hidden",background:C.bg,aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <img src={imgs[imgIdx]} alt={s.title} style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}/>
              {imgs.length>1&&<>
                <button onClick={()=>setImgIdx(p=>(p-1+imgs.length)%imgs.length)} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",background:"rgba(30,30,30,0.7)",border:`1px solid ${C.border}`,borderRadius:"50%",width:36,height:36,cursor:"pointer",color:C.gold,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
                <button onClick={()=>setImgIdx(p=>(p+1)%imgs.length)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"rgba(30,30,30,0.7)",border:`1px solid ${C.border}`,borderRadius:"50%",width:36,height:36,cursor:"pointer",color:C.gold,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
                <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6}}>{imgs.map((_,i)=><span key={i} onClick={()=>setImgIdx(i)} style={{width:6,height:6,borderRadius:"50%",background:i===imgIdx?C.gold:C.border,cursor:"pointer",transition:"background 0.2s"}}/>)}</div>
              </>}
            </div>
          </div>}
          {/* 본문 설명 */}
          {s.description&&<div style={{marginBottom:32}}><p style={{fontFamily:F.b,fontSize:14,color:C.muted,lineHeight:1.8,margin:0,whiteSpace:"pre-wrap"}}>{s.description}</p></div>}
          {/* 버튼 영역 */}
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            {s.link&&<a href={s.link} target="_blank" rel="noopener noreferrer" style={{fontFamily:F.b,fontSize:11,color:C.gold,letterSpacing:2,textDecoration:"none",border:`1px solid ${C.gold}55`,padding:"10px 24px",borderRadius:3,transition:"all 0.3s",display:"inline-block",textTransform:"uppercase"}} onMouseEnter={e=>{e.currentTarget.style.background=C.gold;e.currentTarget.style.color=C.bg}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.gold}}>More Info</a>}
            {s.ticketLink&&<a href={s.ticketLink} target="_blank" rel="noopener noreferrer" style={{fontFamily:F.b,fontSize:11,color:C.bg,letterSpacing:2,textDecoration:"none",background:C.gold,border:`1px solid ${C.gold}`,padding:"10px 24px",borderRadius:3,transition:"all 0.3s",display:"inline-block",textTransform:"uppercase"}} onMouseEnter={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.gold}} onMouseLeave={e=>{e.currentTarget.style.background=C.gold;e.currentTarget.style.color=C.bg}}>🎫 Reserve Tickets</a>}
          </div>
        </div>
      </div>
    </div>
  );
}

function SchedulePage(){
  const raw = useSanity(`*[_type=="schedule"]|order(year desc, date desc){"id":_id,year,date,title,role,venue,conductor,director,link,ticketLink,description,"photoUrl":photo.asset->url,"detailImages":detailImages[].asset->url}`, []);
  const yrs=[...new Set(raw.map(s=>s.year))].sort((a,b)=>b-a);
  const [yr,setYr]=useState(null);
  const [detail,setDetail]=useState(null);
  useEffect(()=>{if(yrs.length>0&&yr===null)setYr(yrs[0])},[yrs,yr]);
  const fl=raw.filter(s=>s.year===(yr||yrs[0]));
  return(<><SectionTitle title="Schedule"/><PhotoBanner {...BANNERS.Schedule}/>
    <div style={{maxWidth:1000,margin:"0 auto",padding:"48px 32px 80px"}}>
      {yrs.length>0&&<div style={{display:"flex",justifyContent:"flex-end",marginBottom:32}}>
        <select value={yr||""} onChange={e=>setYr(Number(e.target.value))} style={{background:"transparent",border:`1px solid ${C.gold}66`,borderRadius:4,color:C.gold,padding:"10px 20px",fontFamily:F.b,fontSize:13,letterSpacing:1,cursor:"pointer",outline:"none"}}>{yrs.map(y=><option key={y} value={y} style={{background:C.surface}}>{y}</option>)}</select>
      </div>}
      {fl.length>0?fl.map((s,i)=><div key={s.id}>
        <div className="sr" style={{display:"flex",gap:48,marginBottom:20,alignItems:"flex-start"}}>
          <div style={{flex:1}}>
            <p style={{fontFamily:F.b,fontSize:13,color:C.gold,letterSpacing:1.5,margin:"0 0 10px",fontWeight:500}}>{s.date}</p>
            <h3 style={{fontFamily:F.d,fontSize:28,color:C.text,margin:"0 0 12px",fontWeight:400,fontStyle:"italic"}}>{s.title}</h3>
            {s.role&&<p style={{fontFamily:F.b,fontSize:14,color:C.goldLight,margin:"0 0 8px"}}>{s.role}</p>}
            <p style={{fontFamily:F.b,fontSize:14,color:C.muted,margin:"0 0 4px"}}>{s.venue}</p>
            <p style={{fontFamily:F.b,fontSize:13,color:C.dim,margin:"0 0 16px"}}>{s.conductor}{s.director?` / ${s.director}`:""}</p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button onClick={()=>setDetail(s)} style={{fontFamily:F.b,fontSize:11,color:C.gold,letterSpacing:2,background:"transparent",border:`1px solid ${C.gold}55`,padding:"8px 20px",borderRadius:3,cursor:"pointer",transition:"all 0.3s",textTransform:"uppercase"}} onMouseEnter={e=>{e.currentTarget.style.background=C.gold;e.currentTarget.style.color=C.bg}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.gold}}>More Info</button>
              {s.ticketLink&&<a href={s.ticketLink} target="_blank" rel="noopener noreferrer" style={{fontFamily:F.b,fontSize:11,color:C.bg,letterSpacing:2,textDecoration:"none",background:C.gold,border:`1px solid ${C.gold}`,padding:"8px 20px",borderRadius:3,transition:"all 0.3s",display:"inline-block",textTransform:"uppercase"}} onMouseEnter={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.gold}} onMouseLeave={e=>{e.currentTarget.style.background=C.gold;e.currentTarget.style.color=C.bg}}>🎫 Reserve</a>}
            </div>
          </div>
          {s.photoUrl&&<img className="sp" src={s.photoUrl} alt={s.title} style={{width:220,minWidth:220,height:"auto",borderRadius:4,border:`1px solid ${C.borderLight}`,objectFit:"contain"}}/>}
        </div>
        {i<fl.length-1&&<div style={{height:1,background:C.border,margin:"24px 0 32px",opacity:0.4}}/>}
      </div>):<EmptyState message="Add schedule in Sanity Studio"/>}
    </div>
    {detail&&<ScheduleDetail s={detail} onClose={()=>setDetail(null)}/>}
    <style>{`@media(max-width:768px){.sr{flex-direction:column!important}.sp{width:100%!important;min-width:0!important;height:200px!important}}`}</style>
  </>);
}
 
function VideoPage(){
  const raw = useSanity(`*[_type=="video"]{"id":_id,title,youtubeId}`, []);
  const [modal,setModal]=useState(null);
  return(<><SectionTitle title="Video"/><PhotoBanner {...BANNERS.Video}/>
    <div style={{maxWidth:1000,margin:"0 auto",padding:"48px 32px 80px"}}>
      {raw.length>0?<div className="vg" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48}}>
        {raw.map(v=><div key={v.id} onClick={()=>setModal(v)} style={{cursor:"pointer"}}>
          <div style={{position:"relative",paddingBottom:"56.25%",borderRadius:4,overflow:"hidden",background:`url(https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg) center/cover`,border:`1px solid ${C.borderLight}`,transition:"border-color 0.3s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=C.borderLight}>
            <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.3)"}}/>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:56,height:56,borderRadius:"50%",background:`${C.gold}55`,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:0,height:0,borderLeft:`16px solid ${C.goldLight}`,borderTop:"10px solid transparent",borderBottom:"10px solid transparent",marginLeft:4}}/></div>
          </div>
          <p style={{fontFamily:F.b,fontSize:13,color:C.muted,margin:"12px 0 0",lineHeight:1.4}}>{v.title}</p>
        </div>)}
      </div>:<EmptyState message="Add videos in Sanity Studio"/>}
    </div>
    {modal&&<div onClick={()=>setModal(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",backdropFilter:"blur(8px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"90%",maxWidth:860,aspectRatio:"16/9",borderRadius:8,overflow:"hidden"}}><iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${modal.youtubeId}?autoplay=1`} frameBorder="0" allow="autoplay;encrypted-media" allowFullScreen/></div>
      <button onClick={()=>setModal(null)} style={{position:"absolute",top:28,right:28,background:"none",border:"none",color:C.goldLight,fontSize:30,cursor:"pointer"}}>{"\u2715"}</button>
    </div>}
    <style>{`@media(max-width:640px){.vg{grid-template-columns:1fr!important}}`}</style>
  </>);
}
 
/* ═══ GALLERY — REDESIGNED ═══ */
function ArrowBtn({direction,onClick}){
  return(<button onClick={onClick} style={{position:"absolute",top:"50%",transform:"translateY(-50%)",[direction==="left"?"left":"right"]:4,width:40,height:40,borderRadius:"50%",border:`1px solid ${C.gold}44`,background:"rgba(30,30,30,0.8)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"border-color 0.3s",zIndex:2,padding:0}} onMouseEnter={e=>e.currentTarget.style.borderColor=`${C.gold}aa`} onMouseLeave={e=>e.currentTarget.style.borderColor=`${C.gold}44`}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round"><path d={direction==="left"?"M15 18l-6-6 6-6":"M9 18l6-6-6-6"}/></svg>
  </button>);
}
 
function GRow({label,items,tall}){
  const ref=useRef(null);const [dr,setDr]=useState(false);const [sx,setSx]=useState(0);const [sl,setSl]=useState(0);const [lbIdx,setLbIdx]=useState(null);
  const dn=e=>{setDr(true);setSx(e.pageX||e.touches?.[0]?.pageX);setSl(ref.current.scrollLeft)};
  const mv=e=>{if(!dr)return;e.preventDefault();ref.current.scrollLeft=sl-((e.pageX||e.touches?.[0]?.pageX)-sx)};
  const up=()=>setDr(false);
  const scrollBy=(dir)=>{if(ref.current)ref.current.scrollBy({left:dir*300,behavior:"smooth"})};
  useEffect(()=>{if(lbIdx===null)return;const handler=(e)=>{if(e.key==="ArrowRight")setLbIdx(prev=>prev<items.length-1?prev+1:0);else if(e.key==="ArrowLeft")setLbIdx(prev=>prev>0?prev-1:items.length-1);else if(e.key==="Escape")setLbIdx(null)};window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler)},[lbIdx,items.length]);
  if(items.length===0) return null;
  return(<div style={{marginBottom:64}}>
    <p style={{fontFamily:F.b,fontSize:15,letterSpacing:6,color:C.goldLight,marginBottom:24,fontWeight:500,textAlign:"center"}}>{label}</p>
    <div style={{position:"relative",maxWidth:1200,margin:"0 auto",padding:"0 52px"}}>
      <ArrowBtn direction="left" onClick={()=>scrollBy(-1)}/>
      <div ref={ref} onMouseDown={dn} onMouseMove={mv} onMouseUp={up} onMouseLeave={up} onTouchStart={dn} onTouchMove={mv} onTouchEnd={up}
        style={{display:"flex",gap:14,overflowX:"auto",cursor:dr?"grabbing":"grab",scrollbarWidth:"none",userSelect:"none",WebkitUserSelect:"none",scrollBehavior:"smooth"}}>
        {items.map((it,idx)=><div key={it.id} onClick={()=>!dr&&setLbIdx(idx)} style={{minWidth:tall?180:240,height:tall?250:170,borderRadius:4,flexShrink:0,transition:"transform 0.3s",background:it.imageUrl?`url(${it.imageUrl}) center/cover`:`linear-gradient(135deg,hsl(${it.hue||25},${it.sat||15}%,20%),hsl(${(it.hue||25)+10},${(it.sat||15)-3}%,14%))`,border:`1px solid ${C.borderLight}`}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>)}
      </div>
      <ArrowBtn direction="right" onClick={()=>scrollBy(1)}/>
    </div>
    {lbIdx!==null&&<div onClick={()=>setLbIdx(null)} style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.85)",backdropFilter:"blur(14px)",cursor:"pointer"}}>
      <button onClick={e=>{e.stopPropagation();setLbIdx(lbIdx>0?lbIdx-1:items.length-1)}} style={{position:"absolute",left:20,top:"50%",transform:"translateY(-50%)",width:44,height:44,borderRadius:"50%",border:`1px solid ${C.gold}44`,background:"rgba(30,30,30,0.6)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3,padding:0}} onMouseEnter={e=>e.currentTarget.style.borderColor=`${C.gold}aa`} onMouseLeave={e=>e.currentTarget.style.borderColor=`${C.gold}44`}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg></button>
      <img onClick={e=>e.stopPropagation()} src={items[lbIdx].imageUrl||""} alt="" style={{maxWidth:"90vw",maxHeight:"90vh",objectFit:"contain",borderRadius:6,border:`1px solid ${C.borderLight}`}}/>
      <button onClick={e=>{e.stopPropagation();setLbIdx(lbIdx<items.length-1?lbIdx+1:0)}} style={{position:"absolute",right:20,top:"50%",transform:"translateY(-50%)",width:44,height:44,borderRadius:"50%",border:`1px solid ${C.gold}44`,background:"rgba(30,30,30,0.6)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3,padding:0}} onMouseEnter={e=>e.currentTarget.style.borderColor=`${C.gold}aa`} onMouseLeave={e=>e.currentTarget.style.borderColor=`${C.gold}44`}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg></button>
      <button onClick={()=>setLbIdx(null)} style={{position:"absolute",top:20,right:20,background:"none",border:"none",color:C.goldLight,fontSize:28,cursor:"pointer",zIndex:3}}>{"\u2715"}</button>
    </div>}
  </div>);
}
 
function GalleryPage(){
  const raw = useSanity(`*[_type=="gallery"]{"id":_id,category,"imageUrl":image.asset->url}`, []);
  const portraits = raw.filter(g=>g.category==="Portraits");
  const performance = raw.filter(g=>g.category==="Performance");
  return(<><SectionTitle title="Gallery"/><PhotoBanner {...BANNERS.Gallery}/>
    <div style={{paddingTop:56,paddingBottom:80}}>
      {raw.length>0?<><GRow label="PORTRAITS" items={portraits} tall/><GRow label="PERFORMANCE" items={performance}/></>:<EmptyState message="Add photos in Sanity Studio"/>}
    </div>
  </>);
}
 
function NewsPage(){
  const raw = useSanity(`*[_type=="news"]|order(date desc){"id":_id,title,source,date,summary,link,"thumbnailUrl":thumbnail.asset->url}`, []);
  const [pg,setPg]=useState(1);const pp=5;const tp=Math.ceil(raw.length/pp);const it=raw.slice((pg-1)*pp,pg*pp);
  return(<><SectionTitle title="News"/><PhotoBanner {...BANNERS.News}/>
    <div style={{maxWidth:1000,margin:"0 auto",padding:"48px 32px 80px"}}>
      {it.length>0?<>{it.map((n,i)=><div key={n.id}>
        <div className="nr" style={{display:"flex",gap:40,alignItems:"center",flexDirection:i%2===0?"row":"row-reverse"}}>
          <div className="ni" style={{width:380,minWidth:380,height:220,borderRadius:4,flexShrink:0,background:n.thumbnailUrl?`url(${n.thumbnailUrl}) center/cover`:`linear-gradient(135deg,hsl(${n.hue||210},14%,20%),hsl(${(n.hue||210)+10},10%,14%))`,border:`1px solid ${C.borderLight}`}}/>
          <div style={{flex:1}}>
            <p style={{fontFamily:F.b,fontSize:12,color:C.dim,margin:"0 0 8px",letterSpacing:1}}>{n.source} &middot; {new Date(n.date).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}</p>
            <h3 style={{fontFamily:F.d,fontSize:24,color:C.text,margin:"0 0 14px",fontWeight:400,lineHeight:1.35}}>{n.title}</h3>
            <p style={{fontFamily:F.b,fontSize:14,color:C.muted,margin:"0 0 20px",lineHeight:1.8}}>{n.summary}</p>
            <a href={n.link} target="_blank" rel="noopener noreferrer" style={{fontFamily:F.b,fontSize:11,color:C.gold,letterSpacing:2,textDecoration:"none",border:`1px solid ${C.gold}55`,padding:"8px 22px",borderRadius:3,transition:"all 0.3s",display:"inline-block"}} onMouseEnter={e=>{e.currentTarget.style.background=C.gold;e.currentTarget.style.color=C.bg}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.gold}}>READ MORE &rarr;</a>
          </div>
        </div>
        {i<it.length-1&&<div style={{height:1,background:C.border,margin:"36px 0",opacity:0.3}}/>}
      </div>)}
      {tp>1&&<div style={{display:"flex",justifyContent:"center",gap:8,marginTop:56}}>
        {Array.from({length:tp},(_,i)=>i+1).map(p=><button key={p} onClick={()=>setPg(p)} style={{width:40,height:40,borderRadius:4,cursor:"pointer",fontSize:14,fontFamily:F.b,fontWeight:500,transition:"all 0.3s",background:pg===p?`${C.gold}22`:"transparent",border:`1px solid ${pg===p?C.gold:C.border}`,color:pg===p?C.gold:C.muted}}>{p}</button>)}
        {pg<tp&&<button onClick={()=>setPg(pg+1)} style={{width:40,height:40,borderRadius:4,cursor:"pointer",fontSize:14,fontFamily:F.b,background:"transparent",border:`1px solid ${C.border}`,color:C.muted}}>&rarr;</button>}
      </div>}</>:<EmptyState message="Add news articles in Sanity Studio"/>}
    </div>
    <style>{`@media(max-width:768px){.nr{flex-direction:column!important}.ni{width:100%!important;min-width:0!important;height:220px!important}}`}</style>
  </>);
}
 
function ContactPage(){
  const [status,setStatus]=useState("idle");
  const [error,setError]=useState("");
  const checkLimit=()=>{const key="contact_"+new Date().toDateString();const count=parseInt(sessionStorage.getItem(key)||"0");if(count>=3)return false;sessionStorage.setItem(key,String(count+1));return true};
  const handleSubmit=async(e)=>{
    e.preventDefault();if(!checkLimit()){setError("Daily limit reached (max 3 messages per day).");return}setStatus("sending");setError("");
    try{const res=await fetch("https://formspree.io/f/mnjlaebo",{method:"POST",body:new FormData(e.target),headers:{"Accept":"application/json"}});
      if(res.ok){setStatus("sent")}else{setStatus("idle");setError("Failed to send. Please try again.")}}
    catch(err){setStatus("idle");setError("Network error. Please try again.")}
  };
  const iS={width:"100%",padding:"14px 18px",background:"transparent",border:`1px solid ${C.border}`,borderRadius:4,color:C.text,fontFamily:F.b,fontSize:15,outline:"none",transition:"border-color 0.3s",boxSizing:"border-box"};
  return(<><SectionTitle title="Contact"/><PhotoBanner {...BANNERS.Contact}/>
    <div style={{maxWidth:1000,margin:"0 auto",padding:"48px 32px 80px"}}>
      <p style={{fontFamily:F.b,fontSize:16,color:C.muted,marginBottom:40,lineHeight:1.8,maxWidth:550}}>For inquiries regarding performances, collaborations, or management, please fill out the form below.</p>
      {status==="sent"?<div style={{textAlign:"center",padding:"80px 0"}}><p style={{fontFamily:F.d,fontSize:32,color:C.gold,marginBottom:14}}>Thank you</p><p style={{fontFamily:F.b,fontSize:15,color:C.muted}}>Your message has been sent successfully.</p></div>:
      <form onSubmit={handleSubmit} style={{maxWidth:640}}>
        <div className="cr" style={{display:"flex",gap:20,marginBottom:24}}>
          <div style={{flex:1}}><label style={{fontFamily:F.b,fontSize:10,color:C.goldLight,letterSpacing:2.5,display:"block",marginBottom:10}}>FIRST NAME</label><input name="firstName" required style={iS} onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor=C.border}/></div>
          <div style={{flex:1}}><label style={{fontFamily:F.b,fontSize:10,color:C.goldLight,letterSpacing:2.5,display:"block",marginBottom:10}}>LAST NAME</label><input name="lastName" required style={iS} onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor=C.border}/></div>
        </div>
        <div style={{marginBottom:24}}><label style={{fontFamily:F.b,fontSize:10,color:C.goldLight,letterSpacing:2.5,display:"block",marginBottom:10}}>E-MAIL</label><input name="email" type="email" required style={iS} onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor=C.border}/></div>
        <div style={{marginBottom:24}}><label style={{fontFamily:F.b,fontSize:10,color:C.goldLight,letterSpacing:2.5,display:"block",marginBottom:10}}>MESSAGE</label><textarea name="message" rows={6} required style={{...iS,resize:"vertical"}} onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor=C.border}/></div>
        <input type="text" name="_gotcha" style={{display:"none"}} tabIndex="-1" autoComplete="off"/>
        {error&&<p style={{fontFamily:F.b,fontSize:13,color:"#E24B4A",marginBottom:16}}>{error}</p>}
        <button type="submit" disabled={status==="sending"} style={{padding:"16px 44px",background:status==="sending"?C.dim:C.gold,border:"none",borderRadius:4,color:C.bg,fontFamily:F.b,fontSize:12,fontWeight:600,letterSpacing:2.5,cursor:status==="sending"?"not-allowed":"pointer",transition:"opacity 0.3s"}} onMouseEnter={e=>{if(status!=="sending")e.currentTarget.style.opacity="0.85"}} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>{status==="sending"?"SENDING...":"SEND MESSAGE"}</button>
      </form>}
    </div>
    <style>{`@media(max-width:640px){.cr{flex-direction:column!important}}`}</style>
  </>);
}
 
function Footer(){return(<footer style={{background:C.bg,borderTop:`1px solid ${C.border}`,padding:"40px 32px",textAlign:"center"}}><span style={{fontFamily:F.d,fontSize:16,color:C.gold,letterSpacing:3}}>JIN</span><p style={{fontFamily:F.b,fontSize:11,color:C.dim,marginTop:14,letterSpacing:1}}>Copyright &copy; Sangjin Kim. All rights reserved.</p></footer>);}
 
export default function App(){
  const [page,setPage]=useState("Home");
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>40);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  useEffect(()=>{
    const hashToPage=()=>{
      const hash=window.location.hash.replace("#","").toLowerCase();
      const match=PAGES.find(p=>p.toLowerCase()===hash);
      setPage(match||"Home");
      window.scrollTo(0,0);
    };
    hashToPage();
    window.addEventListener("hashchange",hashToPage);
    return()=>window.removeEventListener("hashchange",hashToPage);
  },[]);
  const go=useCallback(p=>{
    if(p==="Home"){history.pushState(null,"",window.location.pathname)}
    else{window.location.hash=p.toLowerCase()}
    setPage(p);
    window.scrollTo(0,0);
  },[]);
  return(<div style={{background:C.bg,minHeight:"100vh"}}>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet"/>
    <Nav current={page} go={go} scrolled={page!=="Home"||scrolled}/>
    {page==="Home"&&<Home/>}
    {page==="Biography"&&<Biography/>}
    {page==="Schedule"&&<SchedulePage/>}
    {page==="Video"&&<VideoPage/>}
    {page==="Gallery"&&<GalleryPage/>}
    {page==="News"&&<NewsPage/>}
    {page==="Contact"&&<ContactPage/>}
    {page!=="Home"&&<Footer/>}
  </div>);
}
