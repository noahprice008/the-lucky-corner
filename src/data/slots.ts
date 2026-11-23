// Slot: ISO start/end, local calendar date/time, and mock capacity flag.
// Pickup windows are 30 minutes; at most SLOT_CAPACITY orders can be prepared per window.
export const SLOT_MINUTES=30;
export const SLOT_CAPACITY=5;
export interface PickupSlot { start:string; end:string; date:string; time:string; full:boolean; booked:number; capacity:number }
export function localDate(d:Date) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export function isPickupAllowed(start:Date, now:Date=new Date()):boolean {
 const diff=start.getTime()-now.getTime(); const minutes=start.getHours()*60+start.getMinutes(); const day=start.getDay();
 return diff>=15*60000 && diff<=7*86400000 && day!==6 && minutes>=420 && minutes+SLOT_MINUTES<=(day===5?900:1380) && start.getMinutes()%SLOT_MINUTES===0 && start.getSeconds()===0;
}
export function getSlots(now:Date=new Date()):PickupSlot[] {
 const slots:PickupSlot[]=[];
 for(let offset=0;offset<=7;offset++) { const date=new Date(now);date.setDate(date.getDate()+offset);date.setHours(7,0,0,0); if(date.getDay()===6)continue;
 const end=date.getDay()===5?15:23;
 for(let minutes=420;minutes<end*60;minutes+=SLOT_MINUTES){const start=new Date(date);start.setHours(Math.floor(minutes/60),minutes%60,0,0);if(start.getTime()>now.getTime()+7*86400000)continue; const finish=new Date(start.getTime()+SLOT_MINUTES*60000);const booked=minutes%150===0?SLOT_CAPACITY:(minutes/SLOT_MINUTES)%4;slots.push({start:start.toISOString(),end:finish.toISOString(),date:localDate(start),time:`${String(start.getHours()).padStart(2,'0')}:${String(start.getMinutes()).padStart(2,'0')}`,full:booked>=SLOT_CAPACITY,booked,capacity:SLOT_CAPACITY});}
 } return slots;
}
export function ageAt(dob:string,now:Date=new Date()):number { const birth=new Date(dob+'T00:00:00'); if(Number.isNaN(birth.getTime()))return 0;let age=now.getFullYear()-birth.getFullYear(); if(now.getMonth()<birth.getMonth()||(now.getMonth()===birth.getMonth()&&now.getDate()<birth.getDate()))age--;return age; }
export function canAccessAdult(dob:string|undefined,confirmed:boolean,now:Date=new Date()){return Boolean(dob && ageAt(dob,now)>=18 && confirmed);}
export function calculateTotal(subtotal:number,code:string){return Math.round(subtotal*(code.trim().toUpperCase()==='DEMO10'?0.9:1)*100)/100;}
// Local demo navigation only; no real authentication or security boundary.
export function canPreviewRole(role:string|undefined,page:'owner'|'staff'){return role===page;}
export function isDemoSmsCode(code:string){return /^\d{6}$/.test(code);}
