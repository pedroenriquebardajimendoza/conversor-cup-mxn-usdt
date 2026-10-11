const C=require('./converter.js');const r={pPc:730,pmxn:18.96};let f=0;
const eq=(a,b,m)=>{if(Math.abs(a-b)>1e-9){f++;console.log('FAIL',m,a,b)}else console.log('ok',m,a)};
eq(C.convert(2000,'MXN','USDT',r),2000/18.96,'2000 MXN->USDT');
eq(C.convert(1,'USDT','CUP',r),730,'1 USDT->CUP');
eq(C.convert(1,'USDT','MXN',r),18.96,'1 USDT->MXN');
eq(C.convert(730,'CUP','MXN',r),18.96,'730 CUP->MXN');
eq(C.convert(18.96,'MXN','CUP',r),730,'18.96 MXN->CUP');
eq(C.convert(7300,'CUP','USDT',r),10,'7300 CUP->USDT');
for(const a of C.CURRENCIES)for(const b of C.CURRENCIES)eq(C.convert(C.convert(123.45,a,b,r),b,a,r),123.45,'ida y vuelta '+a+'->'+b);
const r2={pPc:500,pmxn:20};eq(C.convert(100,'USDT','CUP',r2),50000,'tasa cambiada USDT->CUP');eq(C.convert(1000,'CUP','MXN',r2),40,'tasa cambiada CUP->MXN');
try{C.convert(-5,'MXN','USDT',r);f++;console.log('FAIL negativo')}catch(e){console.log('ok negativo rechazado')}
try{C.convert(5,'MXN','USDT',{pPc:0,pmxn:1});f++;console.log('FAIL tasa 0')}catch(e){console.log('ok tasa 0 rechazada')}
console.log(f?f+' fallos':'TODO OK');
