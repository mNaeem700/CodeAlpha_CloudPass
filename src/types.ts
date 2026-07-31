export type PassType = 'single' | 'daily' | 'weekly' | 'monthly' | 'student' | 'senior' | 'commuter';

export type PassCategory = 'Standard' | 'Student' | 'Senior' | 'Veteran / Access';

export type PassStatus = 'ACTIVE' | 'EXPIRED' | 'USED' | 'REVOKED';

export interface BusStop {
  id: string;
  name: string;
  code: string;
  zone: string;
  distanceKmFromStart: number;
  lat: number;
  lng: number;
}

export interface LiveBus {
  id: string;
  busNumber: string;
  routeId: string;
  currentStopId: string;
  nextStopId: string;
  progressToNextPercent: number;
  occupancyPercent: number;
  status: 'ON_TIME' | 'DELAYED' | 'EARLY';
  speedKmh: number;
  driverName: string;
}

export interface BusRoute {
  id: string;
  code: string;
  name: string;
  category: 'Metropolitan Express' | 'City Circular' | 'Suburban Rapid' | 'Airport Shuttle' | 'Night Owl';
  color: string;
  baseFare: number;
  perKmRate: number;
  stops: BusStop[];
  totalDistanceKm: number;
  frequencyMins: number;
  activeBusesCount: number;
  liveBuses: LiveBus[];
}

export interface BusPass {
  id: string;
  passNumber: string;
  userName: string;
  userEmail: string;
  photoUrl?: string;
  passType: PassType;
  category: PassCategory;
  routeId?: string;
  routeName?: string;
  originStopId?: string;
  originStopName?: string;
  destinationStopId?: string;
  destinationStopName?: string;
  zone: string;
  farePaid: number;
  originalFare: number;
  discountAmount: number;
  discountReason: string;
  issuedAt: string;
  validFrom: string;
  validUntil: string;
  status: PassStatus;
  qrSignature: string;
  dynamicSecurityCode: string;
  tripsRemaining?: number;
  maxTrips?: number;
  checksumHash: string;
  deviceFingerprint: string;
}

export interface FareCalculationRequest {
  passType: PassType;
  category: PassCategory;
  routeId?: string;
  originStopId?: string;
  destinationStopId?: string;
  passQuantity?: number;
}

export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  zoneSurcharge: number;
  originalFare: number;
  concessionDiscount: number;
  discountPercentage: number;
  discountReason: string;
  platformFee: number;
  finalFare: number;
  zoneName: string;
  distanceKm: number;
}

export interface ServerNode {
  id: string;
  name: string;
  region: string;
  status: 'HEALTHY' | 'PROVISIONING' | 'HIGH_LOAD' | 'DRAINING' | 'OFFLINE';
  cpuPercent: number;
  memoryPercent: number;
  requestsPerSec: number;
  activeConnections: number;
  uptimeSeconds: number;
}

export interface CloudMetrics {
  totalRequestsProcessed: number;
  currentRps: number;
  avgLatencyMs: number;
  p99LatencyMs: number;
  activeInstances: number;
  minInstances: number;
  maxInstances: number;
  cacheHitRatio: number;
  errorRatePercent: number;
  autoScalingMode: 'AUTOMATIC_DYNAMIC' | 'MANUAL_OVERRIDE' | 'SPIKE_PREVENTION';
  costPerHour: number;
}

export interface VerificationLog {
  id: string;
  passId: string;
  passNumber: string;
  passengerName: string;
  timestamp: string;
  inspectorId: string;
  locationStop: string;
  status: 'VALID' | 'EXPIRED' | 'COUNTERFEIT_ALERT' | 'ZONE_MISMATCH' | 'EXCEEDED_TRIPS';
  message: string;
}

export interface TransitChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string; payload?: any }[];
}
