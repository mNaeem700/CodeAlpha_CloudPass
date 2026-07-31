import { BusPass } from '../types';
import { generateChecksum } from '../services/securityToken';

const today = new Date();
const nextMonth = new Date(today);
nextMonth.setDate(today.getDate() + 30);

const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

export const INITIAL_PASSES: BusPass[] = [
  {
    id: 'pass-9081',
    passNumber: 'BP-2026-9081',
    userName: 'Alex Morgan',
    userEmail: 'alex.morgan@transit.cloud',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    passType: 'monthly',
    category: 'Student',
    routeId: 'route-101',
    routeName: 'Metro Line 101: Downtown Express',
    originStopName: 'Central Grand Terminal',
    destinationStopName: 'Tech Innovation Park',
    zone: 'Zone A & B (Midtown)',
    farePaid: 45.00,
    originalFare: 90.00,
    discountAmount: 45.00,
    discountReason: 'Student Concession (50% Off Verified)',
    issuedAt: today.toISOString(),
    validFrom: today.toISOString(),
    validUntil: nextMonth.toISOString(),
    status: 'ACTIVE',
    qrSignature: generateChecksum(`pass-9081:alex.morgan@transit.cloud:${nextMonth.toISOString()}`),
    dynamicSecurityCode: '849201',
    checksumHash: 'SHA256-4k892a0e',
    deviceFingerprint: 'DEV-IPHONE-15-PRO-9812'
  },
  {
    id: 'pass-4012',
    passNumber: 'BP-2026-4012',
    userName: 'Elena Rostova',
    userEmail: 'elena.rostova@transit.cloud',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    passType: 'daily',
    category: 'Standard',
    routeId: 'route-202',
    routeName: 'City Loop 202: Historic & Cultural Belt',
    originStopName: 'Civic Center Plaza',
    destinationStopName: 'Waterfront Promenade',
    zone: 'Network Unlimited (24h)',
    farePaid: 12.80,
    originalFare: 12.80,
    discountAmount: 0.00,
    discountReason: 'Standard Unlimited 24h Pass',
    issuedAt: today.toISOString(),
    validFrom: today.toISOString(),
    validUntil: new Date(today.getTime() + 86400000).toISOString(),
    status: 'ACTIVE',
    qrSignature: generateChecksum(`pass-4012:elena.rostova@transit.cloud:${new Date(today.getTime() + 86400000).toISOString()}`),
    dynamicSecurityCode: '310948',
    checksumHash: 'SHA256-91b4c73f',
    deviceFingerprint: 'DEV-MACBOOK-AIR-7712'
  },
  {
    id: 'pass-EXPIRED-99',
    passNumber: 'BP-2026-0099',
    userName: 'Marcus Vance',
    userEmail: 'marcus.v@transit.cloud',
    passType: 'single',
    category: 'Standard',
    routeId: 'route-303',
    routeName: 'Suburban Link 303: Westland Commuter',
    originStopName: 'Central Grand Terminal',
    destinationStopName: 'Highland Ridge Terminal',
    zone: 'Zone A → Zone D',
    farePaid: 12.10,
    originalFare: 12.10,
    discountAmount: 0.00,
    discountReason: 'Single Trip Ticket',
    issuedAt: yesterday.toISOString(),
    validFrom: yesterday.toISOString(),
    validUntil: yesterday.toISOString(),
    status: 'EXPIRED',
    qrSignature: generateChecksum(`pass-EXPIRED-99:marcus.v@transit.cloud:${yesterday.toISOString()}`),
    dynamicSecurityCode: '000000',
    tripsRemaining: 0,
    maxTrips: 1,
    checksumHash: 'SHA256-00000000',
    deviceFingerprint: 'DEV-EXPIRED-001'
  }
];
