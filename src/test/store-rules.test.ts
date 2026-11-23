import {describe,it,expect} from 'vitest';
import {isPickupAllowed,getSlots,canAccessAdult,calculateTotal,canPreviewRole,isDemoSmsCode} from '@/data/slots';
import {products,users,notices,sampleOrders} from '@/data/mock';
const now=new Date(2026,10,22,10,0,0,0);
describe('Pickup-only scheduling rules',()=>{
 it('requires a lead time of at least 15 minutes',()=>{expect(isPickupAllowed(new Date(2026,10,22,10,30),now)).toBe(true);expect(isPickupAllowed(new Date(2026,10,22,10,0),now)).toBe(false);expect(isPickupAllowed(new Date(2026,10,22,10,30),new Date(2026,10,22,10,16))).toBe(false);});
 it('allows seven days ahead, but not later',()=>{expect(isPickupAllowed(new Date(2026,10,29,10,0),now)).toBe(true);expect(isPickupAllowed(new Date(2026,10,29,10,30),now)).toBe(false);});
 it('uses 30-minute windows and aligned start times',()=>{expect(isPickupAllowed(new Date(2026,10,22,10,20),now)).toBe(false);const slots=getSlots(now);expect(slots.length).toBeGreaterThan(0);for(const s of slots){expect(new Date(s.end).getTime()-new Date(s.start).getTime()).toBe(1800000);expect(new Date(s.start).getMinutes()%30).toBe(0);}});
 it('opens Sunday–Thursday at 07:00 and closes at 23:00',()=>{const before=new Date(2026,10,22,6,0);expect(isPickupAllowed(new Date(2026,10,22,7,0),before)).toBe(true);expect(isPickupAllowed(new Date(2026,10,22,6,30),before)).toBe(false);expect(isPickupAllowed(new Date(2026,10,22,22,30),before)).toBe(true);expect(isPickupAllowed(new Date(2026,10,22,23,0),before)).toBe(false);});
 it('closes Friday at 15:00',()=>{expect(isPickupAllowed(new Date(2026,10,27,14,30),now)).toBe(true);expect(isPickupAllowed(new Date(2026,10,27,15,0),now)).toBe(false);});
 it('offers no Saturday slots',()=>{expect(isPickupAllowed(new Date(2026,10,28,10,0),now)).toBe(false);expect(getSlots(now).some(s=>new Date(s.start).getDay()===6)).toBe(false);});
});
describe('Age, discount and demo-role rules',()=>{
 it('accepts any six-digit mock SMS code and rejects other formats',()=>{expect(isDemoSmsCode('000000')).toBe(true);expect(isDemoSmsCode('654321')).toBe(true);expect(isDemoSmsCode('12345')).toBe(false);expect(isDemoSmsCode('abcdef')).toBe(false);expect(isDemoSmsCode('1234567')).toBe(false);});
 it('requires an account and age confirmation for adult products',()=>{expect(canAccessAdult(undefined,true,now)).toBe(false);expect(canAccessAdult('1990-01-01',false,now)).toBe(false);expect(canAccessAdult('1990-01-01',true,now)).toBe(true);});
 it('keeps under-18 accounts locked including the day before their birthday',()=>{expect(canAccessAdult('2008-11-23',true,now)).toBe(false);expect(canAccessAdult('2008-11-22',true,now)).toBe(true);expect(canAccessAdult('2011-01-01',true,now)).toBe(false);});
 it('DEMO10 discounts the subtotal by exactly 10 percent',()=>{expect(calculateTotal(100,'DEMO10')).toBe(90);expect(calculateTotal(12.9,'DEMO10')).toBe(11.61);expect(calculateTotal(100,'OTHER')).toBe(100);});
 it('customers cannot view owner or staff pages',()=>{expect(canPreviewRole('customer','owner')).toBe(false);expect(canPreviewRole('customer','staff')).toBe(false);expect(canPreviewRole(undefined,'owner')).toBe(false);});
 it('owner and staff demo pages remain separate',()=>{expect(canPreviewRole('owner','owner')).toBe(true);expect(canPreviewRole('owner','staff')).toBe(false);expect(canPreviewRole('staff','staff')).toBe(true);expect(canPreviewRole('staff','owner')).toBe(false);});
});
describe('Requested mock fixtures',()=>{
 it('includes at least 30 products, 2 out-of-stock products, 6 users, 5 notices and 8 orders',()=>{expect(products.length).toBeGreaterThanOrEqual(30);expect(products.filter(p=>p.isOutOfStock).length).toBe(2);expect(users.length).toBe(6);expect(notices.length).toBe(5);expect(sampleOrders(now).length).toBe(8);});
 it('preserves the supplied example prices',()=>{expect(products.find(p=>p.id==='p1')?.price).toBe(7.9);expect(products.find(p=>p.id==='p3')?.price).toBe(12.9);expect(products.find(p=>p.id==='p5')?.price).toBe(6.2);expect(products.find(p=>p.id==='p12')?.price).toBe(69);});
});
