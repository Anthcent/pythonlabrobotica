'use strict';
const $=id=>document.getElementById(id);
const terms=[
['Algoritmo','Pasos ordenados para resolver un problema.','leer → calcular → mostrar'],['Sintaxis','Reglas para escribir instrucciones válidas.','print("Hola")'],['Indentación','Espacios al inicio de una línea que delimitan bloques. Normalmente cuatro.','if True:\n    print("Sí")'],['Comentario','Nota que Python no ejecuta; comienza con #.','# Esta línea explica el código'],['Variable','Nombre asociado a un valor que se puede reutilizar.','edad = 17'],['str','Tipo de dato que representa texto.','nombre = "Ana"'],['int','Tipo entero, sin parte decimal.','cantidad = 4'],['float','Tipo numérico con decimales.','precio = 12.5'],['bool','Tipo lógico True o False.','activo = True'],['print()','Función que muestra valores en la salida de consola.','print("Resultado", 10)'],['input()','Función que lee una línea de texto de la entrada.','nombre = input("Nombre: ")'],['int() / float()','Funciones que convierten texto o números a tipos numéricos.','edad = int(input("Edad: "))'],['type()','Permite consultar el tipo de un dato.','print(type(3.14))'],['f-string','Cadena con expresiones interpoladas entre llaves.','f"Hola {nombre}"'],['Operador','Símbolo que ejecuta cálculos o comparaciones.','a + b; a == b'],['Módulo','Archivo o biblioteca de funciones disponible para importar.','import math'],['if / elif / else','Control de flujo que selecciona bloques según condiciones.','if edad >= 18:\n    print("Adulto")'],['and / or / not','Operadores lógicos que combinan o invierten condiciones.','edad > 12 and edad < 18'],['for','Bucle que recorre un iterable.','for i in range(3):\n    print(i)'],['while','Bucle que se repite mientras una condición sea verdadera.','while numero > 0:\n    numero -= 1'],['range()','Genera una secuencia de enteros para iterar.','range(1, 6)'],['break','Interrumpe el bucle donde se encuentra.','if encontrado:\n    break'],['continue','Omite el resto de la iteración actual.','if numero < 0:\n    continue'],['Lista','Colección ordenada y modificable. Sus índices inician en 0.','frutas = ["uva", "mango"]'],['Diccionario','Colección de asociaciones clave: valor.','persona = {"edad": 20}'],['append()','Método que agrega elementos a una lista.','frutas.append("pera")'],['len()','Devuelve el número de elementos de una secuencia.','len([1, 2, 3])'],['enumerate()','Recorre valores junto con un índice.','enumerate(frutas, start=1)'],['Función / def','Bloque de código reutilizable definido con def.','def doble(n):\n    return n * 2'],['Parámetro','Nombre que recibe información al invocar una función.','def saludar(nombre): ...'],['return','Devuelve un resultado al punto de llamada.','return a + b'],['try / except','Captura y trata errores previstos de ejecución.','try:\n    int("x")\nexcept ValueError:\n    print("Error")'],['Clase','Molde que reúne atributos y métodos.','class Robot:\n    pass'],['Objeto','Instancia concreta creada a partir de una clase.','robot = Robot()'],['self','Referencia al objeto que ejecuta un método de instancia.','self.posicion = 0'],['__init__','Método inicializador que prepara datos al crear un objeto.','def __init__(self): ...'],['Herencia','Permite definir clases derivadas de una clase base.','class Perro(Animal): ...'],['Consola','Interfaz de texto que muestra resultados y recibe entradas.','python ejemplo.py'],['Sensor simulado','Valor ficticio que reproduce la lectura de un dispositivo.','distancia_cm = 12'],['Actuador','Componente que realiza una acción física; aquí solo se simula.','accion = "AVANZAR"'],['POO','Paradigma que organiza programas usando clases y objetos.','robot.avanzar(2)']
];
let lexicon={},data,all=[],selected=null,variant=0,currentView='learn',pendingChanges=new Map();
let playback=[], playbackIndex=0, playbackTimer=null, playbackPaused=false, playbackFinal='', playbackExit=0, playbackToken=0;
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function colorize(code){const re=/(#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:if|elif|else|for|while|in|and|or|not|def|return|class|self|try|except|import|from|as|break|continue|pass|True|False|None|is)\b|\b(?:print|input|int|float|str|bool|len|range|sum|max|min|abs|type|enumerate|sorted|super)\b|\b\d+(?:\.\d+)?\b)/g;let out='',pos=0,match;while((match=re.exec(code))){out+=escapeHtml(code.slice(pos,match.index));const t=match[0];const cls=t[0]==='#'?'comment':/^["']/.test(t)?'string':/^(?:\d)/.test(t)?'number':/^(?:print|input|int|float|str|bool|len|range|sum|max|min|abs|type|enumerate|sorted|super)$/.test(t)?'builtin':'keyword';out+=`<span class="syn-${cls}">${escapeHtml(t)}</span>`;pos=re.lastIndex;}return out+escapeHtml(code.slice(pos))+'\n';}
function syncEditor(){const t=$('code'),v=t.value;$('highlight').innerHTML=colorize(v);$('lineNumbers').textContent=Array.from({length:Math.max(1,v.split('\n').length)},(_,i)=>i+1).join('\n');$('highlight').scrollTop=t.scrollTop;$('highlight').scrollLeft=t.scrollLeft;$('lineNumbers').scrollTop=t.scrollTop;const start=t.selectionStart,part=v.slice(0,start),line=part.split('\n').length,col=part.length-part.lastIndexOf('\n');$('cursorPos').textContent=`Línea ${line}, Col ${col}`;if(selected){const orig=selected.variants[variant].code;$('editBadge').textContent=v!==orig?'● Modificado':'';}}
function saveEdit(){if(selected)pendingChanges.set(selected.id+'/'+variant,$('code').value);syncEditor()}
function selectTopic(id){stopPlayback();const next=all.find(x=>x.id===id);if(!next)return;selected=next;variant=0;renderTopicList();loadVariant();$('editorView').classList.remove('hidden');$('glossaryView').classList.add('hidden');$('guideView').classList.add('hidden');currentView='learn';document.querySelectorAll('.act').forEach(b=>b.classList.toggle('active',b.dataset.view==='learn'));}
function renderTopicList(){const query=$('search').value.toLowerCase();for(const [id,list] of [['exerciseList',data.exercises],['robotList',data.robots]]){$(id).innerHTML=list.filter(t=>(t.title+' '+t.concept).toLowerCase().includes(query)).map(t=>`<button class="file ${selected?.id===t.id?'active':''}" data-id="${t.id}"><span class="fileicon">${t.robot?'⚙':'🐍'}</span><span>${escapeHtml(t.title)}</span></button>`).join('');$(id).querySelectorAll('button').forEach(b=>b.onclick=()=>selectTopic(b.dataset.id));}}
function loadVariant(){stopPlayback();if(!selected)return;const v=selected.variants[variant];$('topicTitle').textContent=selected.title;$('topicLevel').textContent=selected.robot?'SIMULACIÓN ROBÓTICA':selected.level.toUpperCase();$('topicGoal').textContent=selected.goal;$('explanation').textContent=selected.explanation;$('variantDesc').textContent=v.description;$('challenge').textContent=selected.challenge;$('tags').innerHTML=selected.terms.map(t=>`<span>${escapeHtml(t)}</span>`).join('');$('variants').innerHTML=selected.variants.map((x,i)=>`<button class="variant ${i===variant?'active':''}" data-v="${i}">${selected.robot?'Simulación':'0'+(i+1)+' · '+escapeHtml(x.name)}</button>`).join('');$('variants').querySelectorAll('button').forEach(b=>b.onclick=()=>{variant=Number(b.dataset.v);loadVariant()});$('tabName').textContent=v.path.split('/').at(-1);$('breadcrumbs').textContent=v.path.replaceAll('/','  /  ');$('code').value=pendingChanges.get(selected.id+'/'+variant)??v.code;$('output').textContent='❯ Pulsa «Ejecutar» para ver el resultado aquí.';$('output').classList.remove('error');$('runState').textContent='Listo para ejecutar';$('robotViz').classList.toggle('hidden',!selected.robot);if(selected.robot){drawGrid(-1,-1);$('robotTelemetry').textContent='Ejecuta la simulación para ver los resultados.';$('robotAction').textContent='Selecciona Ejecutar para comenzar.';$('robotProgress').textContent='Preparado para simular';}syncEditor();renderLineGuide()}

function describeLine(line){
 const s=line.trim();if(!s)return 'Línea en blanco: separa partes del código para facilitar la lectura.';
 if(s.startsWith('#'))return 'Comentario explicativo: Python lo ignora y no lo ejecuta.';
 if(/^if\b/.test(s))return 'Comprueba una condición. Si es verdadera, ejecuta las líneas indentadas debajo.';
 if(/^elif\b/.test(s))return 'Prueba otra condición solo cuando las anteriores han fallado.';
 if(/^else\s*:/.test(s))return 'Ejecuta este bloque alternativo si no se cumplió la condición previa (o si el bucle terminó normalmente).';
 if(/^for\b/.test(s))return 'Recorre los elementos de una secuencia. En cada vuelta ejecuta su bloque indentado.';
 if(/^while\b/.test(s))return 'Repite su bloque mientras la comparación sea verdadera.';
 if(/^def\b/.test(s))return 'Declara una función: el bloque indentado define lo que hará cuando la llamemos.';
 if(/^class\b/.test(s))return 'Define una clase: agrupa datos y comportamientos de objetos.';
 if(/^return\b/.test(s))return 'Entrega un resultado y termina la ejecución de la función.';
 if(/^print\s*\(/.test(s))return 'Envía el contenido entre paréntesis a la consola para verlo.';
 if(/^try\s*:/.test(s))return 'Abre una sección que puede producir un error que trataremos con except.';
 if(/^except\b/.test(s))return 'Indica cómo reaccionar si se produce el error especificado.';
 if(/^import\b/.test(s))return 'Carga herramientas de un módulo de Python.';
 if(/^break\b/.test(s))return 'Detiene inmediatamente el bucle en curso.';
 if(/^continue\b/.test(s))return 'Salta al siguiente ciclo sin ejecutar las líneas restantes de esta vuelta.';
 if(/(?:\+=|-=|(?<![=!<>])=(?!=))/.test(s))return 'Guarda un valor en una variable o actualiza su contenido. La parte derecha se evalúa antes de asignar.';
 if(/^\w+(?:\.\w+)*\s*\(/.test(s))return 'Llama a una función o método: ejecuta las instrucciones definidas para él.';
 return 'Instrucción del programa. Lee los conceptos destacados debajo para entender sus componentes.';
}
function tokensForLine(line){
 const expression=line.split('#')[0]; const matches=expression.match(/(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b[A-Za-z_][A-Za-z_0-9]*\b|\b\d+(?:\.\d+)?\b|\*\*|\/\/|==|!=|>=|<=|\+=|-=|[^\s]/g)||[];
 const unique=[];for(const token of matches){if(unique.includes(token))continue;unique.push(token)}
 return unique.map(token=>{let meaning=lexicon[token];if(!meaning){if(/^\d/.test(token))meaning='Literal numérico: valor escrito directamente en el programa.';else if(/^['"]/.test(token))meaning='Cadena de texto: contenido entre comillas. Se muestra o almacena como texto.';else if(/^[A-Za-z_]\w*$/.test(token))meaning='Identificador: nombre de variable, parámetro, función, clase o atributo definido en este programa.';else meaning='Símbolo utilizado por la sintaxis de Python.';}return {token,meaning}})
}
function renderLineGuide(){
 const lines=$('code').value.split('\n');const list=$('lineGuide');list.innerHTML=lines.map((line,i)=>{
 const elements=tokensForLine(line);const pad=(line.match(/^ */)||[''])[0].length;
 const components=elements.map(({token,meaning})=>`<span class="tokenExplain" title="${escapeHtml(meaning)}"><code>${escapeHtml(token)}</code><span>${escapeHtml(meaning)}</span></span>`).join('');
 return `<details class="guideLine" ${i===0?'open':''}><summary><span class="lineIndex">L${i+1}</span><code class="lineSnippet">${escapeHtml(line||'↵ Línea vacía')}</code><span class="expand">▾</span></summary><div class="lineInfo"><p>${escapeHtml(describeLine(line))}${pad?` <strong>Indentación: ${pad} espacios.</strong>`:''}</p><div class="tokenList">${components||'<span class="emptyNote">Sin elementos ejecutables.</span>'}</div></div></details>`;
 }).join('');
}

function drawGrid(x,y){$('robotGrid').innerHTML=Array.from({length:49},(_,i)=>{const px=i%7,py=Math.floor(i/7),on=px===x&&py===y;return `<span class="${on?'robotcell':''}">${on?'🤖':'·'}</span>`}).join('')}
function stopPlayback(){
 playbackToken++;clearTimeout(playbackTimer);playbackTimer=null;playback=[];playbackIndex=0;playbackPaused=false;
 if($('pauseRobot')){$('pauseRobot').disabled=true;$('nextRobot').disabled=true;$('restartRobot').disabled=true;$('pauseRobot').textContent='⏸ Pausar';}
}
function collectRobotFrames(text){
 // Dividimos la salida real de Python en etapas, sin inventar movimientos.
 const lines=text.split('\n'),frames=[];let chunk=[];
 for(const line of lines){
   chunk.push(line);
   const pos=line.match(/^ROBOT_POS (\d+) (\d+)$/);
   const status=line.match(/^ROBOT_STATUS (.*)$/);
   if(pos||status){
     frames.push({text:chunk.join('\n')+'\n',x:pos?Number(pos[1]):null,y:pos?Number(pos[2]):null,action:status?status[1]:null});chunk=[];
   }
 }
 return {frames,tail:chunk.join('\n')};
}
function updateRobotControls(){
 const has=playback.length>0,finished=playbackIndex>=playback.length;
 $('pauseRobot').disabled=!has||finished;
 $('nextRobot').disabled=!has||finished;
 $('restartRobot').disabled=!has;
 $('pauseRobot').textContent=playbackPaused?'▶ Continuar':'⏸ Pausar';
}
function displayRobotStep(){
 if(playbackIndex>=playback.length){
   $('output').textContent+=playbackFinal;
   $('runState').textContent=playbackExit===0?'✓ Simulación finalizada':'✗ Finalizado con error';
   $('robotAction').textContent='Simulación terminada: puedes reiniciarla y observarla nuevamente.';
   updateRobotControls();return;
 }
 const item=playback[playbackIndex];playbackIndex++;
 $('output').textContent+=item.text;
 $('output').scrollTop=$('output').scrollHeight;
 if(item.x!==null){
   drawGrid(item.x,item.y);
   let current=playback[playbackIndex-2];
   const dx=current&&current.x!==null?item.x-current.x:0,dy=current&&current.y!==null?item.y-current.y:0;
   const motion=playbackIndex===1?'INICIO':dx===1?'AVANZA A LA DERECHA':dx===-1?'AVANZA A LA IZQUIERDA':dy===1?'AVANZA HACIA ABAJO':dy===-1?'AVANZA HACIA ARRIBA':'GIRA O PERMANECE EN SU LUGAR';
   $('robotAction').textContent=`${motion} · Posición (${item.x}, ${item.y})`;
   $('robotTelemetry').textContent=`Coordenada X: ${item.x} · Coordenada Y: ${item.y}`;
 }else{
   $('robotAction').textContent='Decisión del robot: '+item.action;
   $('robotTelemetry').textContent='Observa cómo se procesa una lectura cada vez.';
 }
 $('robotProgress').textContent=`Paso ${playbackIndex} de ${playback.length} · ${playbackPaused?'Pausado':'Reproduciendo'}`;
 updateRobotControls();
}
function playbackTick(token){
 if(token!==playbackToken||playbackPaused)return;
 displayRobotStep();
 playbackTimer=setTimeout(()=>playbackTick(token),Number($('robotSpeed').value));
}
function startPlayback(frames,tail,codeExit){
 stopPlayback();playback=frames;playbackFinal=tail;playbackExit=codeExit;
 $('output').textContent='';$('robotProgress').textContent=`Paso 0 de ${frames.length}`;
 $('robotAction').textContent='La simulación comenzará desde el estado inicial.';
 drawGrid(-1,-1);$('runState').textContent='▶ Simulación en curso';
 updateRobotControls();const token=playbackToken;
 playbackTimer=setTimeout(()=>playbackTick(token),400);
}
// Python runs in the browser via Pyodide inside a Web Worker (web/python-worker.js).
// A fresh worker is created after a timeout because terminate() is the only way to stop a runaway loop.
const RUN_TIMEOUT_MS=6000,MAX_CODE=30000,MAX_OUTPUT=30000,INPUT_HEADER_BYTES=8,MAX_INPUT_BYTES=8000;
let pyWorker=null,pyReady=null;
function startPythonWorker(){
 pyWorker=new Worker('python-worker.js');
 pyReady=new Promise((resolve,reject)=>{
  pyWorker.onmessage=({data})=>{if(data.type==='ready')resolve();else if(data.type==='fatal')reject(Error(data.message));};
  pyWorker.onerror=event=>reject(Error(event.message||'No se pudo iniciar Python'));
 });
 pyReady.catch(()=>{});
}
async function runPython(code){
 if(code.length>MAX_CODE)throw Error('El código es demasiado grande');
 if(!pyWorker)startPythonWorker();
 $('runState').textContent='Cargando Python en el navegador...';
 try{await pyReady}catch(error){pyWorker.terminate();pyWorker=null;throw error}
 $('runState').textContent='Ejecutando Python...';
 // input() needs SharedArrayBuffer, which browsers only expose on cross-origin isolated pages (COOP/COEP headers).
 const inputBuffer=self.crossOriginIsolated?new SharedArrayBuffer(INPUT_HEADER_BYTES+MAX_INPUT_BYTES):null;
 return new Promise(resolve=>{
  let stdout='',stderr='',timer=null,budget=RUN_TIMEOUT_MS,startedAt=0;
  const showLive=()=>{$('output').textContent=stdout+(stderr?'\n'+stderr:'')};
  const finish=result=>{clearTimeout(timer);hideInputPrompt();resolve(result)};
  const onTimeout=()=>{
   pyWorker.terminate();pyWorker=null;startPythonWorker();
   finish({stdout:stdout.slice(0,MAX_OUTPUT),stderr:'La ejecución superó los 6 segundos. Revisa si hay un bucle infinito.',exit_code:124});
  };
  // The time budget only counts while Python runs, not while the student is typing.
  const resumeClock=()=>{startedAt=performance.now();timer=setTimeout(onTimeout,budget)};
  const pauseClock=()=>{clearTimeout(timer);budget-=performance.now()-startedAt};
  const answer=line=>{
   const control=new Int32Array(inputBuffer,0,2);
   if(line===null){Atomics.store(control,1,-1)}
   else{
    const bytes=new TextEncoder().encode(line).slice(0,MAX_INPUT_BYTES);
    new Uint8Array(inputBuffer,INPUT_HEADER_BYTES,bytes.length).set(bytes);
    Atomics.store(control,1,bytes.length);
    stdout+=line+'\n';showLive();
   }
   $('runState').textContent='Ejecutando Python...';
   resumeClock();
   Atomics.store(control,0,1);Atomics.notify(control,0);
  };
  pyWorker.onmessage=({data})=>{
   if(data.type==='stdout')stdout+=data.text;
   else if(data.type==='stderr')stderr+=data.text;
   else if(data.type==='input'){
    pauseClock();showLive();
    $('runState').textContent='⌨ Esperando tu respuesta';
    showInputPrompt(answer);
   }
   else if(data.type==='done'){
    if(data.internalError)stderr+=(stderr?'\n':'')+data.internalError;
    finish({stdout:stdout.slice(0,MAX_OUTPUT),stderr:stderr.slice(0,MAX_OUTPUT),exit_code:data.exitCode});
   }
  };
  resumeClock();
  pyWorker.postMessage({type:'run',code,inputBuffer});
 });
}
// Console line where the student answers input(). Enter sends the line; Esc sends EOF.
function showInputPrompt(onAnswer){
 let box=$('stdinBox');
 if(!box){
  box=document.createElement('input');box.id='stdinBox';box.className='stdinBox';
  box.setAttribute('autocomplete','off');box.setAttribute('spellcheck','false');
  box.setAttribute('aria-label','Entrada del programa');
  box.placeholder='Escribe tu respuesta y pulsa Enter · Esc para cancelar';
  $('output').after(box);
 }
 box.value='';box.classList.remove('hidden');box.focus();
 box.onkeydown=event=>{
  if(event.key!=='Enter'&&event.key!=='Escape')return;
  event.preventDefault();event.stopPropagation();
  const value=event.key==='Enter'?box.value:null;
  hideInputPrompt();onAnswer(value);
 };
}
function hideInputPrompt(){const box=$('stdinBox');if(box){box.onkeydown=null;box.classList.add('hidden')}}
startPythonWorker();
async function runCode(){
 const b=$('runBtn');if(b.disabled)return;stopPlayback();b.disabled=true;
 $('runState').textContent='Ejecutando Python...';$('output').textContent='Preparando resultado...';
 try{
  const result=await runPython($('code').value);
  const stdout=result.stdout||'',stderr=result.stderr||'';
  if(selected?.robot){
   const {frames,tail}=collectRobotFrames(stdout);
   if(frames.length){startPlayback(frames,tail+(stderr?'\n'+stderr:''),result.exit_code);}
   else{$('output').textContent=stdout+(stderr?'\n'+stderr:'')||'(Sin salida)';$('robotAction').textContent='Este código no produjo marcas de simulación.';$('runState').textContent='Ejecución finalizada';}
  }else{
   $('output').textContent=stdout+(stderr?'\n'+stderr:'')||'(El programa no produjo ninguna salida)';
   $('runState').textContent=result.exit_code===0?'✓ Ejecución finalizada':`✗ Error (código ${result.exit_code})`;
  }
  $('output').classList.toggle('error',result.exit_code!==0);
 }catch(error){$('output').textContent='No se pudo ejecutar Python en el navegador. Revisa tu conexión a internet (Pyodide se descarga la primera vez). Detalle: '+error.message;$('output').classList.add('error');$('runState').textContent='Python no disponible';}
 finally{b.disabled=false}
}
$('pauseRobot').onclick=()=>{if(!playback.length)return;playbackPaused=!playbackPaused;clearTimeout(playbackTimer);$('robotProgress').textContent=`Paso ${playbackIndex} de ${playback.length} · ${playbackPaused?'Pausado':'Reproduciendo'}`;updateRobotControls();if(!playbackPaused)playbackTimer=setTimeout(()=>playbackTick(playbackToken),Number($('robotSpeed').value));};
$('nextRobot').onclick=()=>{playbackPaused=true;clearTimeout(playbackTimer);displayRobotStep();$('robotProgress').textContent=`Paso ${playbackIndex} de ${playback.length} · Pausado`;updateRobotControls();};
$('restartRobot').onclick=()=>{if(!playback.length)return;const saved=[...playback],tail=playbackFinal,exit=playbackExit;startPlayback(saved,tail,exit);};
$('robotSpeed').onchange=()=>{if(playback.length&&!playbackPaused&&playbackIndex<playback.length){clearTimeout(playbackTimer);playbackTimer=setTimeout(()=>playbackTick(playbackToken),Number($('robotSpeed').value));}};
function renderGlossary(){const q=$('termSearch').value.toLowerCase();$('glossaryList').innerHTML=terms.filter(([name,desc])=>(name+' '+desc).toLowerCase().includes(q)).map(([name,desc,example])=>`<article class="term"><b>${escapeHtml(name)}</b><p>${escapeHtml(desc)}</p><code>${escapeHtml(example)}</code></article>`).join('')||'<p>No hay conceptos que coincidan.</p>'}
function switchView(v){currentView=v;for(const [name,id] of [['learn','editorView'],['glossary','glossaryView'],['guide','guideView']])$(id).classList.toggle('hidden',v!==name);document.querySelectorAll('.act').forEach(b=>b.classList.toggle('active',b.dataset.view===v));if(v==='glossary')renderGlossary()}
function toast(msg){$('toast').textContent=msg;$('toast').classList.remove('hidden');setTimeout(()=>$('toast').classList.add('hidden'),2200)}
$('code').addEventListener('input',()=>{saveEdit();renderLineGuide()});$('code').addEventListener('scroll',syncEditor);$('code').addEventListener('click',syncEditor);$('code').addEventListener('keyup',syncEditor);$('code').addEventListener('keydown',event=>{if(event.key==='Tab'){event.preventDefault();const t=$('code'),start=t.selectionStart,end=t.selectionEnd;t.setRangeText('    ',start,end,'end');saveEdit()}else if(event.key==='Enter'){const t=$('code'),start=t.selectionStart,line=t.value.slice(0,start).split('\n').at(-1),spaces=line.match(/^\s*/)[0],newIndent=spaces+(line.trimEnd().endsWith(':')?'    ':'');event.preventDefault();t.setRangeText('\n'+newIndent,start,t.selectionEnd,'end');saveEdit()}});document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();if(currentView==='learn')runCode()}});$('runBtn').onclick=runCode;$('resetBtn').onclick=()=>{if(selected){pendingChanges.delete(selected.id+'/'+variant);$('code').value=selected.variants[variant].code;syncEditor();renderLineGuide();toast('Código original restaurado')}};$('clearBtn').onclick=()=>{$('output').textContent='❯ Consola limpia.';$('runState').textContent='Listo para ejecutar'};$('search').oninput=renderTopicList;$('termSearch').oninput=renderGlossary;document.querySelectorAll('.act').forEach(b=>b.onclick=()=>switchView(b.dataset.view));$('helpBtn').onclick=()=>{switchView('guide');toast('Atajos: Ctrl+Enter para ejecutar; Tab para indentar')};
Promise.all([fetch('curriculum.json').then(r=>r.json()),fetch('lexico.json').then(r=>r.json())]).then(([json,lex])=>{lexicon=lex;data=json;all=[...json.exercises,...json.robots];selectTopic(all[0].id);renderGlossary()}).catch(e=>{$('output').textContent='No se pudo cargar el material. Si abriste index.html directamente, sírvelo por HTTP (por ejemplo con INICIAR_WINDOWS.bat): '+e.message});
