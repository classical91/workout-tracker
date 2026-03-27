import { useState, useEffect, useRef } from "react";

const T = {
  bg:"#0A0A0C", surface:"#131315", surface2:"#1A1A1E", border:"#1E1E22",
  text:"#F0EDE8", muted:"#666", dim:"#3A3A3E",
  orange:"#FF6B35", yellow:"#FFD93D", purple:"#C77DFF",
  teal:"#4ECDC4", green:"#2ECC71", blue:"#378ADD", red:"#E74C3C",
};
const font = "'DM Sans', sans-serif";
const display = "'Bebas Neue', sans-serif";

// ─── SHARED ───────────────────────────────────────────────────────────────────
function BackButton({ onBack, color }) {
  return <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:color||T.muted,fontSize:13,fontFamily:font,letterSpacing:1,padding:"0 0 4px",display:"flex",alignItems:"center",gap:6}}>← BACK</button>;
}
function ScreenHeader({ title, subtitle, emoji, color, onBack }) {
  return (
    <div style={{padding:"28px 20px 16px",borderBottom:`1px solid ${T.border}`,marginBottom:16}}>
      <div style={{maxWidth:500,margin:"0 auto"}}>
        <BackButton onBack={onBack} color={color}/>
        <div style={{display:"flex",alignItems:"center",gap:12,marginTop:12}}>
          <span style={{fontSize:36}}>{emoji}</span>
          <div>
            <p style={{fontSize:10,letterSpacing:3,color:T.muted,fontWeight:600}}>{subtitle}</p>
            <h1 style={{fontFamily:display,fontSize:32,color,letterSpacing:1,lineHeight:1}}>{title}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
function ProgressBar({ done, total, color }) {
  const pct = Math.round((done/total)*100);
  return (
    <div style={{background:`${color}10`,border:`1px solid ${color}25`,borderRadius:14,padding:"14px 16px",marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:11,color:T.muted,letterSpacing:1,fontWeight:600}}>PROGRESS</span>
        <span style={{fontSize:11,color,fontWeight:700}}>{done}/{total}</span>
      </div>
      <div style={{height:6,background:T.surface2,borderRadius:99,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:99,transition:"width 0.4s ease"}}/>
      </div>
    </div>
  );
}
function CompletionBanner({ color, emoji, text }) {
  return (
    <div style={{marginTop:16,background:`${color}15`,border:`1px solid ${color}40`,borderRadius:14,padding:18,textAlign:"center"}}>
      <div style={{fontSize:32,marginBottom:6}}>{emoji}</div>
      <p style={{fontFamily:display,fontSize:24,color,letterSpacing:1}}>{text}</p>
    </div>
  );
}

// ─── FIGURE BASE ──────────────────────────────────────────────────────────────
function Fig({ color, children, h=140 }) {
  return (
    <svg viewBox={`0 0 120 ${h}`} style={{width:"100%",height:"100%"}}>
      <defs><radialGradient id={`bg${color.replace('#','')}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={color} stopOpacity="0.08"/>
        <stop offset="100%" stopColor={color} stopOpacity="0"/>
      </radialGradient></defs>
      <circle cx="60" cy={h/2} r="55" fill={`url(#bg${color.replace('#','')})`}/>
      <g stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {children}
      </g>
    </svg>
  );
}
// ─── WORKOUT ILLUSTRATIONS ────────────────────────────────────────────────────
const WorkoutIllus = {
  "Bicep Curls":    "https://s3assets.skimble.com/assets/2287282/image_full.jpg",
  "Tricep Dips":    "https://training.fit/wp-content/uploads/2020/03/arnold-dips.png",
  "Lunges":         "https://images.squarespace-cdn.com/content/v1/5ffcea9416aee143500ea103/1638425716168-GMKJB64MCPI0R9FWOB2U/Dumbbell%2BLunges.jpeg",
  "Shoulder Press": "https://antofy.co.uk/wp-content/uploads/2024/09/image-4.png",
  "Bent-over Rows": "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-bent-over-row.jpg",
};
// ─── STRETCH ILLUSTRATIONS ────────────────────────────────────────────────────
const StretchIllus = {
  // UPPER BODY
  "Neck": ({c}) => <Fig color={c}><circle cx="60" cy="22" r="10" stroke={c} fill="none"/><line x1="60" y1="32" x2="60" y2="75"/><line x1="60" y1="42" x2="40" y2="60"/><line x1="60" y1="42" x2="80" y2="60"/><line x1="60" y1="75" x2="48" y2="115"/><line x1="60" y1="75" x2="72" y2="115"/>{/* Head tilted, hand on head */}<line x1="60" y1="22" x2="75" y2="35" strokeDasharray="3"/></Fig>,
  "Shoulder": ({c}) => <Fig color={c}><circle cx="60" cy="18" r="10" stroke={c} fill="none"/><line x1="60" y1="28" x2="60" y2="75"/>{/* Cross-body arm */}<line x1="60" y1="40" x2="25" y2="50"/><line x1="25" y1="50" x2="18" y2="60"/>{/* Other hand pressing */}<line x1="60" y1="40" x2="80" y2="60"/><line x1="80" y1="60" x2="26" y2="60"/><line x1="60" y1="75" x2="48" y2="115"/><line x1="60" y1="75" x2="72" y2="115"/></Fig>,
  "Chest": ({c}) => <Fig color={c}><circle cx="60" cy="18" r="10" stroke={c} fill="none"/><line x1="60" y1="28" x2="60" y2="75"/>{/* Arms spread wide back */}<line x1="60" y1="40" x2="15" y2="52"/><line x1="60" y1="40" x2="105" y2="52"/><line x1="60" y1="75" x2="48" y2="115"/><line x1="60" y1="75" x2="72" y2="115"/>{/* Chest puffed forward curve */}<path d="M 40 40 Q 60 50 80 40" strokeDasharray="4" fill="none"/></Fig>,
  "Arms": ({c}) => <Fig color={c}><circle cx="60" cy="18" r="10" stroke={c} fill="none"/><line x1="60" y1="28" x2="60" y2="75"/>{/* One arm bent overhead tricep */}<line x1="60" y1="38" x2="80" y2="30"/><line x1="80" y1="30" x2="78" y2="55"/>{/* Other hand at elbow */}<line x1="60" y1="38" x2="40" y2="58"/><line x1="40" y1="58" x2="75" y2="52"/><line x1="60" y1="75" x2="48" y2="115"/><line x1="60" y1="75" x2="72" y2="115"/></Fig>,
  "Upper Back": ({c}) => <Fig color={c}><circle cx="60" cy="22" r="10" stroke={c} fill="none"/>{/* Rounded back, arms hugged forward */}<line x1="60" y1="32" x2="55" y2="75"/>{/* Back curve */}<path d="M 60 32 Q 40 55 55 75" fill="none"/><line x1="55" y1="42" x2="35" y2="52"/><line x1="35" y1="52" x2="40" y2="62"/><line x1="55" y1="42" x2="75" y2="52"/><line x1="75" y1="52" x2="70" y2="62"/><line x1="40" y1="62" x2="70" y2="62"/><line x1="55" y1="75" x2="45" y2="115"/><line x1="55" y1="75" x2="65" y2="115"/></Fig>,
  // CORE
  "Abdominals": ({c}) => <Fig color={c} h={160}><line x1="10" y1="130" x2="110" y2="130" strokeOpacity="0.3"/>{/* Cobra pose - face down, arms up */}<circle cx="35" cy="72" r="10" stroke={c} fill="none"/><line x1="42" y1="78" x2="90" y2="108"/>{/* body on floor */}<line x1="90" y1="108" x2="60" y2="128"/><line x1="90" y1="108" x2="108" y2="126"/>{/* arms pushing up */}<line x1="52" y1="82" x2="45" y2="62"/><line x1="52" y1="82" x2="68" y2="90"/><line x1="45" y1="62" x2="68" y2="90"/></Fig>,
  "Obliques": ({c}) => <Fig color={c}><circle cx="60" cy="18" r="10" stroke={c} fill="none"/>{/* Side bend, one arm overhead */}<line x1="60" y1="28" x2="55" y2="78"/>{/* body leaning */}<line x1="60" y1="40" x2="80" y2="35"/><line x1="80" y1="35" x2="75" y2="15"/>{/* arm overhead arching */}<line x1="60" y1="40" x2="45" y2="60"/><line x1="55" y1="78" x2="44" y2="118"/><line x1="55" y1="78" x2="68" y2="115"/></Fig>,
  "Lower Back": ({c}) => <Fig color={c} h={130}><line x1="10" y1="118" x2="110" y2="118" strokeOpacity="0.3"/>{/* Childs pose */}<circle cx="60" cy="25" r="10" stroke={c} fill="none"/><line x1="60" y1="35" x2="60" y2="65"/><line x1="60" y1="50" x2="38" y2="68"/><line x1="38" y1="68" x2="35" y2="85"/><line x1="60" y1="50" x2="78" y2="65"/><line x1="78" y1="65" x2="80" y2="80"/>{/* torso folded down */}<line x1="60" y1="65" x2="50" y2="90"/><line x1="50" y1="90" x2="45" y2="115"/><line x1="50" y1="90" x2="70" y2="110"/>{/* arms extended forward on floor */}<line x1="60" y1="35" x2="25" y2="55"/><line x1="25" y1="55" x2="15" y2="80"/></Fig>,
  // LOWER BODY
  "Hips": ({c}) => <Fig color={c} h={150}><line x1="10" y1="138" x2="110" y2="138" strokeOpacity="0.3"/>{/* Pigeon pose */}<circle cx="50" cy="22" r="10" stroke={c} fill="none"/><line x1="50" y1="32" x2="50" y2="68"/><line x1="50" y1="42" x2="30" y2="58"/><line x1="50" y1="42" x2="70" y2="55"/>{/* Front leg bent */}<line x1="50" y1="68" x2="35" y2="90"/><line x1="35" y1="90" x2="55" y2="100"/>{/* Back leg extended */}<line x1="50" y1="68" x2="78" y2="85"/><line x1="78" y1="85" x2="95" y2="135"/><line x1="55" y1="100" x2="20" y2="135"/></Fig>,
  "Groin": ({c}) => <Fig color={c} h={150}><line x1="10" y1="138" x2="110" y2="138" strokeOpacity="0.3"/>{/* Butterfly stretch */}<circle cx="60" cy="22" r="10" stroke={c} fill="none"/><line x1="60" y1="32" x2="60" y2="72"/>{/* arms to feet */}<line x1="60" y1="42" x2="45" y2="62"/><line x1="60" y1="42" x2="75" y2="62"/>{/* legs butterfly */}<line x1="60" y1="72" x2="28" y2="90"/><line x1="28" y1="90" x2="45" y2="115"/><line x1="60" y1="72" x2="92" y2="90"/><line x1="92" y1="90" x2="75" y2="115"/><line x1="45" y1="115" x2="75" y2="115"/></Fig>,
  "Hamstrings": ({c}) => <Fig color={c}><line x1="10" y1="122" x2="110" y2="122" strokeOpacity="0.3"/>{/* Standing forward fold */}<circle cx="60" cy="18" r="10" stroke={c} fill="none"/>{/* bent forward at hips */}<line x1="60" y1="28" x2="60" y2="58"/>{/* torso down */}<line x1="60" y1="58" x2="55" y2="90"/>{/* legs straight */}<line x1="60" y1="58" x2="65" y2="90"/><line x1="55" y1="90" x2="50" y2="120"/><line x1="65" y1="90" x2="70" y2="120"/>{/* arms reaching down */}<line x1="60" y1="38" x2="40" y2="70"/><line x1="60" y1="38" x2="78" y2="68"/></Fig>,
  "Quadriceps": ({c}) => <Fig color={c}><line x1="10" y1="125" x2="110" y2="125" strokeOpacity="0.3"/>{/* Standing quad stretch */}<circle cx="55" cy="18" r="10" stroke={c} fill="none"/><line x1="55" y1="28" x2="55" y2="75"/><line x1="55" y1="42" x2="35" y2="60"/>{/* one arm out for balance */}{/* standing leg */}<line x1="55" y1="75" x2="50" y2="122"/>{/* raised leg bent back */}<line x1="55" y1="75" x2="72" y2="88"/><line x1="72" y1="88" x2="68" y2="65"/>{/* hand holding foot */}<line x1="55" y1="42" x2="72" y2="55"/><line x1="72" y1="55" x2="70" y2="66"/></Fig>,
  "Calves": ({c}) => <Fig color={c}><line x1="10" y1="125" x2="110" y2="125" strokeOpacity="0.3"/>{/* Wall calf stretch */}<rect x="100" y="10" width="8" height="115" rx="2" fill={`${c}22`} stroke={c}/><circle cx="52" cy="22" r="10" stroke={c} fill="none"/><line x1="52" y1="32" x2="52" y2="72"/><line x1="52" y1="42" x2="72" y2="55"/><line x1="72" y1="55" x2="96" y2="55"/>{/* arms to wall */}<line x1="52" y1="42" x2="72" y2="65"/><line x1="72" y1="65" x2="96" y2="65"/>{/* front leg bent */}<line x1="52" y1="72" x2="60" y2="98"/><line x1="60" y1="98" x2="58" y2="122"/>{/* back leg straight */}<line x1="52" y1="72" x2="38" y2="90"/><line x1="38" y1="90" x2="36" y2="122"/></Fig>,
  "Ankles": ({c}) => <Fig color={c}><line x1="10" y1="125" x2="110" y2="125" strokeOpacity="0.3"/>{/* Seated ankle circle */}<circle cx="55" cy="22" r="10" stroke={c} fill="none"/><line x1="55" y1="32" x2="55" y2="75"/><line x1="55" y1="42" x2="35" y2="58"/><line x1="55" y1="42" x2="75" y2="55"/>{/* seated, legs bent */}<line x1="55" y1="75" x2="38" y2="95"/><line x1="38" y1="95" x2="30" y2="122"/><line x1="55" y1="75" x2="75" y2="88"/><line x1="75" y1="88" x2="80" y2="112"/>{/* circle around ankle */}<ellipse cx="82" cy="108" rx="8" ry="6" strokeDasharray="3" fill="none" stroke={c}/></Fig>,
  "Feet": ({c}) => <Fig color={c}><line x1="10" y1="125" x2="110" y2="125" strokeOpacity="0.3"/>{/* Seated, toes pulled back */}<circle cx="40" cy="35" r="10" stroke={c} fill="none"/><line x1="40" y1="45" x2="40" y2="85"/><line x1="40" y1="55" x2="20" y2="72"/><line x1="40" y1="55" x2="60" y2="70"/>{/* legs extended */}<line x1="40" y1="85" x2="30" y2="122"/><line x1="40" y1="85" x2="80" y2="88"/><line x1="80" y1="88" x2="95" y2="122"/>{/* foot flexed, toes back */}<line x1="95" y1="122" x2="95" y2="110"/><line x1="95" y1="110" x2="85" y2="105"/>{/* hand pulling toes */}<line x1="60" y1="70" x2="88" y2="102"/></Fig>,
};

// ─── STRETCH DATA ─────────────────────────────────────────────────────────────
const stretchSections = [
  { label:"Upper Body", color:"#378ADD", items:[
    { name:"Neck", muscles:"front, sides, back", hold:"30 sec/side", detail:"Slowly tilt ear toward shoulder. Use hand to gently increase stretch. Roll chin to chest for front stretch.", key:"neck" },
    { name:"Shoulder", muscles:"deltoids, rotator cuff", hold:"20 sec/side", detail:"Pull one arm across chest. Use other hand to press arm at elbow. Rotate arm inward for rotator cuff.", key:"shldr" },
    { name:"Chest", muscles:"pectorals", hold:"30 sec", detail:"Clasp hands behind back. Lift arms, squeeze shoulder blades together, open chest upward.", key:"chest" },
    { name:"Arms", muscles:"biceps, triceps", hold:"20 sec/side", detail:"Tricep: bend arm overhead, other hand pushes elbow. Bicep: arm behind, palm up against wall, rotate body away.", key:"arms" },
    { name:"Upper Back", muscles:"traps, rhomboids", hold:"30 sec", detail:"Hug arms forward, interlace fingers, round upper back like a cat. Feel stretch between shoulder blades.", key:"upbk" },
  ]},
  { label:"Core", color:"#C77DFF", items:[
    { name:"Abdominals", muscles:"front of torso", hold:"20–30 sec", detail:"Lie face down. Place hands under shoulders. Gently push up, keep hips on floor. (Cobra pose)", key:"abs" },
    { name:"Obliques", muscles:"sides of your torso", hold:"20 sec/side", detail:"Stand tall. Raise one arm overhead, lean slowly to opposite side. Feel stretch along your side.", key:"obl" },
    { name:"Lower Back", muscles:"erector spinae, quadratus lumborum", hold:"45 sec", detail:"Child's pose: kneel, sit back on heels, extend arms forward on floor. Breathe deeply into your lower back.", key:"lbk" },
  ]},
  { label:"Lower Body", color:"#2ECC71", items:[
    { name:"Hips", muscles:"hip flexors, glutes", hold:"45 sec/side", detail:"Pigeon pose: front leg bent at 90°, back leg extended. Stay upright or fold forward for deeper stretch.", key:"hips" },
    { name:"Groin", muscles:"adductors", hold:"30 sec", detail:"Butterfly: sit, bring soles of feet together, knees fall outward. Gently press knees toward floor.", key:"groin" },
    { name:"Hamstrings", muscles:"back of the thighs", hold:"30 sec/side", detail:"Stand, hinge at hips keeping back flat, reach toward toes. Or seated with one leg extended, reach for foot.", key:"hams" },
    { name:"Quadriceps", muscles:"front of the thighs", hold:"30 sec/side", detail:"Stand, pull one foot to glute. Keep knees together, stand tall. Hold a wall for balance if needed.", key:"quads" },
    { name:"Calves", muscles:"gastrocnemius and soleus", hold:"30 sec/side", detail:"Hands on wall, one leg back heel flat. Straight leg = gastrocnemius. Slightly bent knee = soleus.", key:"calves" },
    { name:"Ankles", muscles:"ankle mobility and flexion", hold:"10 circles/direction", detail:"Seated or standing, lift one foot. Draw large slow circles with toes. Both directions.", key:"ankles" },
    { name:"Feet", muscles:"arches, toes, peroneus tertius", hold:"20 sec/side", detail:"Seated: extend leg, use hand to pull toes back toward shin. Also roll foot on ball for arch massage.", key:"feet" },
  ]},
];
// ─── ILLUS CARD (shared) ──────────────────────────────────────────────────────
function IllusCard({ label, muscles, detail, reps, done, color, onToggle, illusKey, IllusMap }) {
  const [open, setOpen] = useState(false);
  const Illus = IllusMap && IllusMap[illusKey];
  return (
    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,marginBottom:8,overflow:"hidden"}}>
      <div onClick={onToggle} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"14px 16px",cursor:"pointer"}}>
        <div style={{width:24,height:24,borderRadius:7,border:`2px solid ${color}`,background:done?color:"transparent",flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {done && <span style={{fontSize:13,color:"#000",fontWeight:800}}>✓</span>}
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
            <span style={{fontWeight:700,fontSize:14,color:done?T.muted:T.text,textDecoration:done?"line-through":"none"}}>{label}</span>
            {reps && <span style={{fontSize:10,fontWeight:700,color,background:`${color}18`,borderRadius:99,padding:"3px 9px",whiteSpace:"nowrap"}}>{reps}</span>}
          </div>
          {muscles && <p style={{fontSize:10,color,marginBottom:4,letterSpacing:0.3}}>{muscles}</p>}
          <p style={{fontSize:12,color:done?T.dim:T.muted,lineHeight:1.5}}>{detail}</p>
          {Illus && (
            <button onClick={e=>{e.stopPropagation();setOpen(o=>!o)}}
              style={{fontSize:10,fontWeight:700,letterSpacing:1,border:"none",background:"transparent",color,cursor:"pointer",paddingTop:6}}>
              {open?"▲ HIDE FORM":"▼ SHOW FORM"}
            </button>
          )}
        </div>
      </div>
      {Illus && open && (
        <div style={{padding:"0 16px 16px",display:"flex",justifyContent:"center"}}>
          <div style={{width:180,height:200,background:`${color}08`,borderRadius:16,border:`1px solid ${color}20`,padding:8}}>
            {typeof Illus === "string" ? <img src={Illus} alt={illusKey} style={{width:"100%",display:"block",objectFit:"cover",borderRadius:12}} onError={e=>e.target.style.display="none"}/> : <Illus c={color}/>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STRETCH SCREEN ───────────────────────────────────────────────────────────
function StretchScreen({ onBack, checked, setChecked }) {
  const allItems = stretchSections.flatMap(s => s.items);
  const done = allItems.filter(item => checked[`str-${item.key}`]).length;
  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:font,color:T.text,paddingBottom:60}}>
      <ScreenHeader title="Stretch" subtitle="FLEXIBILITY · 10 MIN" emoji="🧘" color={T.green} onBack={onBack}/>
      <div style={{maxWidth:500,margin:"0 auto",padding:"0 20px"}}>
        <ProgressBar done={done} total={allItems.length} color={T.green}/>
        {stretchSections.map(section => (
          <div key={section.label}>
            <p style={{fontSize:10,letterSpacing:2,color:section.color,fontWeight:700,marginBottom:10,marginTop:8}}>{section.label.toUpperCase()}</p>
            {section.items.map(item => (
              <IllusCard key={item.key}
                label={item.name} muscles={item.muscles} detail={item.detail} reps={item.hold}
                color={section.color} done={!!checked[`str-${item.key}`]}
                onToggle={() => setChecked(p => ({...p,[`str-${item.key}`]:!p[`str-${item.key}`]}))}
                illusKey={item.name} IllusMap={StretchIllus}
              />
            ))}
          </div>
        ))}
        {done === allItems.length && <CompletionBanner color={T.green} emoji="🌿" text="FULLY STRETCHED!"/>}
      </div>
    </div>
  );
}

// ─── FOAM ROLLER ──────────────────────────────────────────────────────────────
const foamTech = [
  { area:"Upper Back", emoji:"🔵", detail:"Lie with roller across shoulder blades. Support head, lift hips. Gently arch back over roller. Roll slowly from mid-back to upper back.", tip:"Keep core engaged. Never roll the lower back." },
  { area:"IT Band", emoji:"🟠", detail:"Side-lying, roller under outer thigh. Support with top foot flat. Roll from hip to just above knee. Go slow — intense!", tip:"Cross top leg in front for less pressure." },
  { area:"Calves", emoji:"🟢", detail:"Sit on floor, roller under calves. Lift hips. Roll from ankle to below knee. Stack one leg for more intensity.", tip:"Rotate foot inward and outward to hit all angles." },
  { area:"Hamstrings", emoji:"🟡", detail:"Sit with roller under back of thighs. Lift hips, roll from just below glutes to above knee.", tip:"Turn toes in/out to target medial and lateral hamstrings." },
  { area:"Glutes / Piriformis", emoji:"🔴", detail:"Sit on roller at a slight angle. Cross one ankle over opposite knee. Lean toward crossed-leg side and roll slowly.", tip:"Sink your weight gradually — this is a dense area." },
  { area:"Quads", emoji:"🟣", detail:"Face down, roller under front of thighs. Support on forearms. Roll from just above knee to hip flexor.", tip:"Avoid rolling directly over the kneecap." },
  { area:"Lats", emoji:"🔵", detail:"Side-lying with roller under armpit. Arm extended overhead. Roll from armpit to mid-torso.", tip:"Rotate slightly onto your back to access deeper fibres." },
  { area:"Hip Flexors", emoji:"🟠", detail:"Face down, roller angled under hip/groin. Keep toes on floor, roll gently.", tip:"Move slowly. Hold on tight spots for 20 sec." },
  { area:"Thoracic Spine", emoji:"🟢", detail:"Roller horizontal across mid-back. Hands behind head, knees bent. Let upper back extend over roller.", tip:"Never roll on the neck or lower lumbar spine." },
  { area:"Plantar Fascia", emoji:"🟡", detail:"Standing or seated, roller under foot arch. Roll from heel to ball of foot slowly.", tip:"Use a lacrosse ball for deeper, more targeted work." },
];

function FoamRollerScreen({ onBack, checked, setChecked }) {
  const color = T.teal;
  const done = foamTech.filter((_,i) => checked[`foam-${i}`]).length;
  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:font,color:T.text,paddingBottom:60}}>
      <ScreenHeader title="Foam Roller" subtitle="RECOVERY · 10 MIN" emoji="🧴" color={color} onBack={onBack}/>
      <div style={{maxWidth:500,margin:"0 auto",padding:"0 20px"}}>
        <ProgressBar done={done} total={foamTech.length} color={color}/>
        {foamTech.map((t,i) => (
          <div key={i} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,marginBottom:8,overflow:"hidden"}}>
            <div onClick={() => setChecked(p => ({...p,[`foam-${i}`]:!p[`foam-${i}`]}))}
              style={{display:"flex",gap:14,alignItems:"flex-start",padding:"14px 16px",cursor:"pointer"}}>
              <div style={{width:24,height:24,borderRadius:7,border:`2px solid ${color}`,background:checked[`foam-${i}`]?color:"transparent",flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {checked[`foam-${i}`] && <span style={{fontSize:13,color:"#000",fontWeight:800}}>✓</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontWeight:700,fontSize:14,color:checked[`foam-${i}`]?T.muted:T.text,textDecoration:checked[`foam-${i}`]?"line-through":"none"}}>{t.emoji} {t.area}</span>
                </div>
                <p style={{fontSize:12,color:T.muted,lineHeight:1.5,marginBottom:6}}>{t.detail}</p>
                {!checked[`foam-${i}`] && <div style={{background:`${color}10`,borderLeft:`3px solid ${color}`,borderRadius:6,padding:"8px 10px",fontSize:11,color}}>💡 {t.tip}</div>}
              </div>
            </div>
          </div>
        ))}
        {done === foamTech.length && <CompletionBanner color={color} emoji="✨" text="RECOVERY COMPLETE!"/>}
      </div>
    </div>
  );
}

// ─── SIMPLE WORKOUTS ──────────────────────────────────────────────────────────
const simpleEx = [
  { name:"Wall Push-Ups", reps:"3 × 15", detail:"Hands on wall at shoulder height. Great for all levels." },
  { name:"Chair Squats", reps:"3 × 12", detail:"Stand in front of chair, lower until you almost touch it, stand back up." },
  { name:"Marching in Place", reps:"3 min", detail:"High knees, pump arms. Easy cardio anywhere." },
  { name:"Seated Leg Raises", reps:"3 × 15", detail:"Sit on edge of chair, extend one leg, hold 2 sec, lower." },
  { name:"Glute Bridges", reps:"3 × 15", detail:"Lie on back, knees bent. Push hips up, squeeze glutes at top." },
  { name:"Standing Side Crunches", reps:"3 × 12/side", detail:"Stand tall, bring elbow to same-side knee by crunching sideways." },
  { name:"Wall Sit", reps:"3 × 30 sec", detail:"Back against wall, thighs parallel to floor. Hold." },
  { name:"Toe Touches", reps:"3 × 10", detail:"Stand, reach down toward toes. Slow and controlled." },
];

function SimpleWorkoutsScreen({ onBack, checked, setChecked }) {
  const color = T.blue;
  const done = simpleEx.filter((_,i) => checked[`sim-${i}`]).length;
  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:font,color:T.text,paddingBottom:60}}>
      <ScreenHeader title="Simple Workouts" subtitle="BODYWEIGHT · NO EQUIPMENT" emoji="🏃" color={color} onBack={onBack}/>
      <div style={{maxWidth:500,margin:"0 auto",padding:"0 20px"}}>
        <ProgressBar done={done} total={simpleEx.length} color={color}/>
        {simpleEx.map((s,i) => (
          <div key={i} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,marginBottom:8}}>
            <div onClick={() => setChecked(p => ({...p,[`sim-${i}`]:!p[`sim-${i}`]}))}
              style={{display:"flex",gap:14,alignItems:"flex-start",padding:"14px 16px",cursor:"pointer"}}>
              <div style={{width:24,height:24,borderRadius:7,border:`2px solid ${color}`,background:checked[`sim-${i}`]?color:"transparent",flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {checked[`sim-${i}`] && <span style={{fontSize:13,color:"#000",fontWeight:800}}>✓</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontWeight:700,fontSize:14,color:checked[`sim-${i}`]?T.muted:T.text}}>{s.name}</span>
                  <span style={{fontSize:10,fontWeight:700,color,background:`${color}18`,borderRadius:99,padding:"3px 9px"}}>{s.reps}</span>
                </div>
                <p style={{fontSize:12,color:T.muted,lineHeight:1.5}}>{s.detail}</p>
              </div>
            </div>
          </div>
        ))}
        {done === simpleEx.length && <CompletionBanner color={color} emoji="🏅" text="NICE WORK!"/>}
      </div>
    </div>
  );
}
// ─── LOG SCREEN ───────────────────────────────────────────────────────────────
function LogScreen({ onBack, log, onClear }) {
  const color = T.yellow;
  const grouped = log.reduce((acc,e) => {
    const d = new Date(e.ts).toLocaleDateString("en-CA",{weekday:"short",month:"short",day:"numeric"});
    if(!acc[d]) acc[d]=[];
    acc[d].push(e); return acc;
  }, {});
  const days = Object.keys(grouped).reverse();
  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:font,color:T.text,paddingBottom:60}}>
      <ScreenHeader title="Exercise Log" subtitle="HISTORY" emoji="📋" color={color} onBack={onBack}/>
      <div style={{maxWidth:500,margin:"0 auto",padding:"0 20px"}}>
        {log.length===0?(
          <div style={{textAlign:"center",padding:"60px 0",color:T.muted}}>
            <div style={{fontSize:48,marginBottom:16}}>📋</div>
            <p>No activities logged yet.<br/>Complete a session to see it here.</p>
          </div>
        ):(
          <>
            {days.map(day => (
              <div key={day} style={{marginBottom:24}}>
                <p style={{fontSize:10,letterSpacing:2,color:T.muted,fontWeight:700,marginBottom:10}}>{day.toUpperCase()}</p>
                {grouped[day].map((e,i) => (
                  <div key={i} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:14}}>{e.emoji} {e.name}</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:2}}>{e.duration}</div>
                    </div>
                    <div style={{fontFamily:display,fontSize:20,color:e.color||color}}>✓</div>
                  </div>
                ))}
              </div>
            ))}
            <button onClick={onClear} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 20px",color:T.muted,cursor:"pointer",fontSize:12,fontFamily:font}}>Clear Log</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── TIMER SCREEN ─────────────────────────────────────────────────────────────
function TimerScreen({ title, subtitle, emoji, color, defaultMins, onBack, onComplete, note }) {
  const total = defaultMins * 60;
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (running && remaining > 0) { ref.current = setInterval(() => setRemaining(r => r-1), 1000); }
    else if (remaining === 0 && running) { setRunning(false); setDone(true); if(onComplete) onComplete(); }
    return () => clearInterval(ref.current);
  }, [running, remaining]);
  const reset = () => { setRemaining(total); setRunning(false); setDone(false); };
  const mins = Math.floor(remaining/60).toString().padStart(2,"0");
  const secs = (remaining%60).toString().padStart(2,"0");
  const pct = ((total-remaining)/total)*100;
  const C = 2*Math.PI*90;
  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:font,color:T.text}}>
      <ScreenHeader title={title} subtitle={subtitle} emoji={emoji} color={color} onBack={onBack}/>
      <div style={{maxWidth:500,margin:"0 auto",padding:"20px 20px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:24}}>
        <div style={{position:"relative",width:220,height:220}}>
          <svg viewBox="0 0 200 200" width="220" height="220" style={{transform:"rotate(-90deg)"}}>
            <circle cx="100" cy="100" r="90" fill="none" stroke={T.surface2} strokeWidth="8"/>
            <circle cx="100" cy="100" r="90" fill="none" stroke={color} strokeWidth="8"
              strokeDasharray={C} strokeDashoffset={C*(1-pct/100)} strokeLinecap="round"
              style={{transition:"stroke-dashoffset 0.8s ease"}}/>
          </svg>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
            <div style={{fontFamily:display,fontSize:48,color:done?color:T.text,lineHeight:1}}>{done?"DONE":`${mins}:${secs}`}</div>
            <div style={{fontSize:11,color:T.muted,letterSpacing:1,marginTop:4}}>{done?"🎉":running?"RUNNING":"READY"}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:12}}>
          {!done && <button onClick={() => setRunning(r=>!r)} style={{background:running?`${color}22`:color,border:`2px solid ${color}`,borderRadius:12,padding:"12px 32px",fontFamily:display,fontSize:20,color:running?color:"#000",cursor:"pointer",letterSpacing:1}}>{running?"PAUSE":"START"}</button>}
          <button onClick={reset} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 24px",fontFamily:font,fontSize:13,color:T.muted,cursor:"pointer"}}>Reset</button>
        </div>
        {note && <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px",width:"100%",fontSize:13,color:T.muted,lineHeight:1.6}}>{note}</div>}
      </div>
    </div>
  );
}

// ─── BREATHING ────────────────────────────────────────────────────────────────
const breathModes = [
  { name:"Box", steps:["Inhale","Hold","Exhale","Hold"], durations:[4,4,4,4], color:T.teal, desc:"Stress relief & focus" },
  { name:"4-7-8", steps:["Inhale","Hold","Exhale"], durations:[4,7,8], color:T.purple, desc:"Sleep & anxiety relief" },
  { name:"Belly", steps:["Inhale","Hold","Exhale"], durations:[5,2,6], color:T.green, desc:"Diaphragmatic breathing" },
];
function BreathingScreen({ onBack }) {
  const [mi, setMi] = useState(0);
  const [running, setRunning] = useState(false);
  const [si, setSi] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const ref = useRef(null);
  const m = breathModes[mi];
  const stop = () => { setRunning(false); clearInterval(ref.current); };
  const start = () => { setSi(0); setCountdown(m.durations[0]); setCycles(0); setRunning(true); };
  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          setSi(s => { const next=(s+1)%m.durations.length; if(next===0) setCycles(cy=>cy+1); return next; });
          return m.durations[(si+1)%m.durations.length];
        }
        return c-1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running, si]);
  const dur = m.durations[si]||1;
  const pct = running?((dur-countdown)/dur)*100:0;
  const C = 2*Math.PI*80;
  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:font,color:T.text}}>
      <ScreenHeader title="Breathing" subtitle="BREATHWORK" emoji="🌬️" color={m.color} onBack={() => { stop(); onBack(); }}/>
      <div style={{maxWidth:500,margin:"0 auto",padding:"0 20px 40px"}}>
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {breathModes.map((bm,i) => (
            <button key={i} onClick={() => { stop(); setMi(i); setSi(0); setCountdown(0); setCycles(0); }}
              style={{flex:1,background:mi===i?`${bm.color}18`:T.surface,border:`2px solid ${mi===i?bm.color:T.border}`,borderRadius:10,padding:"10px 4px",cursor:"pointer",color:mi===i?bm.color:T.muted,fontSize:11,fontWeight:700,fontFamily:font}}>
              {bm.name}
            </button>
          ))}
        </div>
        <p style={{fontSize:12,color:T.muted,textAlign:"center",marginBottom:24}}>{m.desc}</p>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
          <div style={{position:"relative",width:200,height:200}}>
            <svg viewBox="0 0 180 180" width="200" height="200" style={{transform:"rotate(-90deg)"}}>
              <circle cx="90" cy="90" r="80" fill="none" stroke={T.surface2} strokeWidth="6"/>
              <circle cx="90" cy="90" r="80" fill="none" stroke={m.color} strokeWidth="6"
                strokeDasharray={C} strokeDashoffset={C*(1-pct/100)} strokeLinecap="round"
                style={{transition:running?"stroke-dashoffset 1s linear":"none"}}/>
            </svg>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
              {running?<><div style={{fontFamily:display,fontSize:42,color:m.color,lineHeight:1}}>{countdown}</div><div style={{fontSize:13,color:T.text,fontWeight:700,marginTop:4}}>{m.steps[si]}</div></>:<div style={{fontFamily:display,fontSize:32,color:T.muted}}>READY</div>}
            </div>
          </div>
          {running && <p style={{fontSize:12,color:T.muted}}>Cycles: {cycles}</p>}
          <button onClick={running?stop:start} style={{background:running?`${m.color}22`:m.color,border:`2px solid ${m.color}`,borderRadius:12,padding:"12px 32px",fontFamily:display,fontSize:20,color:running?m.color:"#000",cursor:"pointer",letterSpacing:1}}>{running?"STOP":"START"}</button>
          <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px",width:"100%"}}>
            <p style={{fontSize:10,letterSpacing:2,color:T.muted,marginBottom:10,fontWeight:700}}>PATTERN</p>
            <div style={{display:"flex",gap:8}}>
              {m.steps.map((s,i) => (
                <div key={i} style={{flex:1,background:running&&si===i?`${m.color}22`:T.surface2,border:`1px solid ${running&&si===i?m.color:T.border}`,borderRadius:10,padding:"10px 6px",textAlign:"center"}}>
                  <div style={{fontFamily:display,fontSize:24,color:m.color}}>{m.durations[i]}s</div>
                  <div style={{fontSize:10,color:T.muted,marginTop:2}}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── WORKOUT SETS ─────────────────────────────────────────────────────────────
const workouts = [
  { title:"Upper & Lower Dumbbell", color:"#FF6B35", emoji:"💪", tag:"Workout 1", steps:[
    { phase:"Warm-Up", reps:"5–10 min", detail:"Light cardio — jogging in place or jumping jacks", type:"warmup" },
    { phase:"Bicep Curls", reps:"3 × 12–15", detail:"Curl dumbbells up to shoulder height, squeeze at the top", type:"exercise" },
    { phase:"Tricep Dips", reps:"3 × 12–15", detail:"Lower body slowly, keep elbows close to body", type:"exercise" },
    { phase:"Lunges", reps:"3 × 12–15", detail:"Step forward, lower back knee toward floor, alternate legs", type:"exercise" },
    { phase:"Shoulder Press", reps:"3 × 12–15", detail:"Press dumbbells overhead from shoulder height", type:"exercise" },
    { phase:"Bent-over Rows", reps:"3 × 12–15", detail:"Hinge at hips, pull dumbbells to ribcage, squeeze back", type:"exercise" },
    { phase:"Cool-Down", reps:"5–10 min", detail:"Stretching to improve flexibility & prevent soreness", type:"cooldown" },
  ]},
  { title:"Core & Lower Body Burn", color:"#FFD93D", emoji:"🔥", tag:"Workout 2", steps:[
    { phase:"Warm-Up", reps:"5–10 min", detail:"Light cardio to prepare your body", type:"warmup" },
    { phase:"Standing Calf Raise", reps:"3 × 12–15", detail:"Rise onto toes slowly, hold 1 sec, lower back down", type:"exercise" },
    { phase:"Step-ups", reps:"3 × 12–15", detail:"Step up onto a sturdy surface, alternate legs", type:"exercise" },
    { phase:"Sit-ups", reps:"3 × 12–15", detail:"Hold dumbbell at chest, engage core on the way up", type:"exercise" },
    { phase:"Russian Twists", reps:"3 × 12–15", detail:"Hold dumbbell, rotate torso side to side", type:"exercise" },
    { phase:"Reverse Fly", reps:"3 × 12–15", detail:"Hinge forward, raise dumbbells out to sides", type:"exercise" },
    { phase:"Cool-Down", reps:"5–10 min", detail:"Stretching to relax muscles and promote recovery", type:"cooldown" },
  ]},
  { title:"Total Body Tone-Up", color:"#C77DFF", emoji:"🧘", tag:"Workout 3", steps:[
    { phase:"Warm-Up", reps:"5–10 min", detail:"Light cardio to get warmed up", type:"warmup" },
    { phase:"Dumbbell Squats", reps:"3 × 12–15", detail:"Feet shoulder-width apart, sit back and down", type:"exercise" },
    { phase:"Chest Press", reps:"3 × 12–15", detail:"Lie on back, press dumbbells up from chest", type:"exercise" },
    { phase:"Lateral Raises", reps:"3 × 12–15", detail:"Raise arms out to sides to shoulder height", type:"exercise" },
    { phase:"Dumbbell Shrugs", reps:"3 × 12–15", detail:"Lift shoulders toward ears", type:"exercise" },
    { phase:"Cool-Down", reps:"5–10 min", detail:"Stretching to cool down and recover", type:"cooldown" },
  ]},
];
const tsStyle = { warmup:{bg:"#0F1F1A",ac:"#4ECDC4"}, exercise:{bg:"#16161A",ac:null}, cooldown:{bg:"#0F0F1F",ac:"#4ECDC4"} };

function WorkoutSetsScreen({ onBack, checked, setChecked, onLog }) {
  const [aw, setAw] = useState(0);
  const w = workouts[aw];
  const doneSteps = w.steps.filter((_,si) => checked[`w${aw}-${si}`]).length;
  const doneEx = w.steps.filter((s,si) => s.type==="exercise"&&checked[`w${aw}-${si}`]).length;
  const totalEx = w.steps.filter(s => s.type==="exercise").length;
  const pct = Math.round((doneSteps/w.steps.length)*100);
  const allDone = workouts.map((wk,wi) => wk.steps.every((_,si) => checked[`w${wi}-${si}`]));
  const prevPct = useRef(pct);
  useEffect(() => {
    if (pct===100&&prevPct.current<100) onLog({name:w.title,emoji:w.emoji,color:w.color,duration:"~30 min",ts:Date.now()});
    prevPct.current = pct;
  }, [pct]);
  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:font,color:T.text,paddingBottom:60}}>
      <div style={{padding:"28px 20px 16px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{maxWidth:500,margin:"0 auto"}}>
          <BackButton onBack={onBack} color={w.color}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginTop:12}}>
            <div>
              <p style={{fontSize:10,letterSpacing:3,color:T.muted,fontWeight:600,marginBottom:2}}>WORKOUT SETS · 30 MIN</p>
              <h1 style={{fontFamily:display,fontSize:36,letterSpacing:1,lineHeight:1}}>MY WORKOUTS</h1>
            </div>
            <div style={{textAlign:"right"}}>
              <p style={{fontSize:10,color:T.muted,letterSpacing:1}}>EXERCISES</p>
              <p style={{fontFamily:display,fontSize:28,color:w.color,lineHeight:1.1}}>{doneEx}/{totalEx}</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{padding:"16px 20px 0",maxWidth:500,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
          {workouts.map((wk,i) => (
            <div key={i} onClick={() => setAw(i)}
              style={{padding:"14px 10px",background:aw===i?`${wk.color}18`:T.surface,border:`2px solid ${aw===i?wk.color:T.border}`,borderRadius:14,textAlign:"center",cursor:"pointer"}}>
              <div style={{fontSize:24,marginBottom:5}}>{allDone[i]?"✅":wk.emoji}</div>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:aw===i?wk.color:T.muted}}>{wk.tag.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <div style={{background:`linear-gradient(135deg,${w.color}15,${w.color}05)`,border:`1px solid ${w.color}25`,borderRadius:18,padding:"18px 20px",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1,paddingRight:12}}>
              <div style={{display:"inline-block",background:`${w.color}20`,color:w.color,borderRadius:99,padding:"3px 10px",fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:8}}>{w.tag}</div>
              <h2 style={{fontFamily:display,fontSize:22,letterSpacing:0.5,lineHeight:1.2}}>{w.title}</h2>
            </div>
            <div style={{fontSize:40}}>{w.emoji}</div>
          </div>
          <div style={{marginTop:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:10,color:T.muted,fontWeight:600,letterSpacing:1}}>SESSION PROGRESS</span>
              <span style={{fontSize:11,color:w.color,fontWeight:700}}>{pct}%</span>
            </div>
            <div style={{height:6,background:T.surface2,borderRadius:99,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${w.color}70,${w.color})`,borderRadius:99,transition:"width 0.5s ease"}}/>
            </div>
          </div>
        </div>
        {w.steps.map((step,si) => {
          const key = `w${aw}-${si}`;
          const done = !!checked[key];
          const ts = tsStyle[step.type];
          const ac = ts.ac||w.color;
          return (
            <IllusCard key={si}
              label={step.phase} detail={step.detail} reps={step.reps}
              done={done} color={ac}
              onToggle={() => setChecked(p => ({...p,[key]:!p[key]}))}
              illusKey={step.phase} IllusMap={step.type==="exercise"?WorkoutIllus:null}
            />
          );
        })}
        {pct===100 && <CompletionBanner color={w.color} emoji="🎉" text="WORKOUT COMPLETE!"/>}
        <div style={{marginTop:16,background:T.surface,borderRadius:14,padding:"14px 16px",border:`1px solid ${T.border}`}}>
          <p style={{fontSize:10,letterSpacing:2,color:T.muted,fontWeight:600,marginBottom:10}}>ALWAYS REMEMBER</p>
          {["Ankle mobility warm-up","Neck rolls before & after","Breathing cooldown"].map((item,i,arr) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:i<arr.length-1?8:0}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:w.color,flexShrink:0}}/>
              <span style={{fontSize:12,color:T.muted}}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
const activities = [
  { id:"workout-sets", label:"Workout Sets", emoji:"💪", duration:"30 min", color:"#FF6B35", desc:"3 dumbbell routines" },
  { id:"stretch", label:"Stretch", emoji:"🧘", duration:"10 min", color:"#2ECC71", desc:"Full body flexibility" },
  { id:"simple", label:"Simple Workouts", emoji:"🏃", duration:"15 min", color:"#378ADD", desc:"Bodyweight, no gear" },
  { id:"breathing", label:"Breathing", emoji:"🌬️", duration:"5–10 min", color:"#4ECDC4", desc:"Box, 4-7-8, belly" },
  { id:"bike", label:"Bike", emoji:"🚴", duration:"20 min", color:"#378ADD", desc:"Cardio timer" },
  { id:"sauna", label:"Sauna", emoji:"🧖", duration:"20 min", color:"#E74C3C", desc:"Recovery timer" },
  { id:"ohming", label:"Ohming", emoji:"🕉️", duration:"5 min", color:"#C77DFF", desc:"Meditation timer" },
  { id:"foam-roller", label:"Foam Roller", emoji:"🧴", duration:"10 min", color:"#4ECDC4", desc:"Recovery techniques" },
  { id:"log", label:"Exercise Log", emoji:"📋", duration:null, color:"#FFD93D", desc:"View past activities" },
];
// Floating Diet Plan link
const DietPlanLink = () => (
  <a
    href="https://diet-plan-production-30bd.up.railway.app"
    target="_blank"
    rel="noreferrer"
    style={{
      position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000,
      background: 'rgba(200,146,42,0.12)', border: '1px solid rgba(200,146,42,0.3)',
      color: '#c8922a', textDecoration: 'none', fontFamily: font,
      fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em',
      textTransform: 'uppercase', padding: '8px 14px', borderRadius: '20px',
      backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '6px'
    }}
  >
    🥗 Diet Plan
  </a>
);

function HomeScreen({ onNavigate }) {
  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:font,color:T.text,paddingBottom:60}}>
      <div style={{padding:"36px 20px 20px",borderBottom:`1px solid ${T.border}`,marginBottom:20}}>
        <div style={{maxWidth:500,margin:"0 auto"}}>
          <p style={{fontSize:10,letterSpacing:3,color:T.muted,fontWeight:600,marginBottom:4}}>WELLNESS TRACKER</p>
          <h1 style={{fontFamily:display,fontSize:44,letterSpacing:1,lineHeight:1}}>DAILY PRACTICE</h1>
        </div>
      </div>
      <div style={{maxWidth:500,margin:"0 auto",padding:"0 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {activities.map(a => (
            <div key={a.id} onClick={() => onNavigate(a.id)}
              style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"18px 16px",cursor:"pointer",gridColumn:a.id==="log"?"1 / -1":undefined}}
              onMouseEnter={e => e.currentTarget.style.borderColor=a.color}
              onMouseLeave={e => e.currentTarget.style.borderColor=T.border}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
                <div>
                  <span style={{fontSize:32}}>{a.emoji}</span>
                  <div style={{marginTop:8}}>
                    <div style={{fontWeight:700,fontSize:15,marginBottom:2}}>{a.label}</div>
                    <div style={{fontSize:11,color:T.muted}}>{a.desc}</div>
                  </div>
                </div>
                {a.duration && <div style={{background:`${a.color}18`,color:a.color,borderRadius:99,padding:"4px 10px",fontSize:10,fontWeight:700,letterSpacing:0.5}}>{a.duration}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
const LOG_KEY = "wellness_log";
const CHK_KEY = "wellness_checked";
export default function App() {
  const [screen, setScreen] = useState("home");
  const [checked, setChecked] = useState(() => { try { return JSON.parse(localStorage.getItem(CHK_KEY)||"{}"); } catch { return {}; } });
  const [log, setLog] = useState(() => { try { return JSON.parse(localStorage.getItem(LOG_KEY)||"[]"); } catch { return []; } });
  useEffect(() => { localStorage.setItem(CHK_KEY, JSON.stringify(checked)); }, [checked]);
  useEffect(() => { localStorage.setItem(LOG_KEY, JSON.stringify(log)); }, [log]);
  const addLog = entry => setLog(prev => {
    const key = `${entry.name}-${new Date(entry.ts).toDateString()}`;
    if (prev.some(e => `${e.name}-${new Date(e.ts).toDateString()}`===key)) return prev;
    return [entry,...prev];
  });
  const timerDone = (name,emoji,color,duration) => addLog({name,emoji,color,duration,ts:Date.now()});
  if (screen==="home") return <HomeScreen onNavigate={setScreen}/>;
  if (screen==="workout-sets") return <WorkoutSetsScreen onBack={() => setScreen("home")} checked={checked} setChecked={setChecked} onLog={addLog}/>;
  if (screen==="stretch") return <StretchScreen onBack={() => setScreen("home")} checked={checked} setChecked={setChecked}/>;
  if (screen==="simple") return <SimpleWorkoutsScreen onBack={() => setScreen("home")} checked={checked} setChecked={setChecked}/>;
  if (screen==="breathing") return <BreathingScreen onBack={() => setScreen("home")}/>;
  if (screen==="foam-roller") return <FoamRollerScreen onBack={() => setScreen("home")} checked={checked} setChecked={setChecked}/>;
  if (screen==="log") return <LogScreen onBack={() => setScreen("home")} log={log} onClear={() => setLog([])}/>;
  if (screen==="bike") return <TimerScreen title="Bike" subtitle="CARDIO · 20 MIN" emoji="🚴" color="#378ADD" defaultMins={20} onBack={() => setScreen("home")} onComplete={() => timerDone("Bike","🚴","#378ADD","20 min")} note="Steady pace cardio. Aim for 60–70% max heart rate. Stay hydrated."/>;
  if (screen==="sauna") return <TimerScreen title="Sauna" subtitle="RECOVERY · 20 MIN" emoji="🧖" color="#E74C3C" defaultMins={20} onBack={() => setScreen("home")} onComplete={() => timerDone("Sauna","🧖","#E74C3C","20 min")} note="Hydrate well before and after. Exit if you feel dizzy or uncomfortable."/>;
  if (screen==="ohming") return <TimerScreen title="Ohming" subtitle="MEDITATION · 5 MIN" emoji="🕉️" color="#C77DFF" defaultMins={5} onBack={() => setScreen("home")} onComplete={() => timerDone("Ohming","🕉️","#C77DFF","5 min")} note="Sit comfortably, close eyes. Inhale deeply, exhale with a low Ohhhmm sound. Let thoughts pass."/>;
  return <><HomeScreen onNavigate={setScreen}/><DietPlanLink /></>;
}