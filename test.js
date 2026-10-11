const C=require('./converter.js');let f=0;
const eq=(a,b,m)=>{if(Math.abs(a-b)>1e-9){f++;console.log('FAIL',m,a,b)}else console.log('ok',m,a)};
eq(C.pmxn(730,18.96),730/18.96,'pmxn 730/18.96');eq(C.pUsdt(2000,18.96),2000/18.96,'pUSDT 2000/18.96');
eq(C.pmxn(500,20),25,'pmxn 500/20');eq(C.pUsdt(1000,20),50,'pUSDT 1000/20');
try{C.pUsdt(-1,18.96);f++}catch(e){console.log('ok negativo rechazado')}
try{C.pmxn(730,0);f++}catch(e){console.log('ok MXN 0 rechazado')}
console.log(f?f+' fallos':'TODO OK');
