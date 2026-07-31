import { BusRoute } from '../types';

export const INITIAL_BUS_ROUTES: BusRoute[] = [
  {
    id: 'route-101',
    code: '101-EXP',
    name: 'Metro Line 101: Downtown Express',
    category: 'Metropolitan Express',
    color: '#3B82F6', // Blue
    baseFare: 2.50,
    perKmRate: 0.35,
    totalDistanceKm: 18.5,
    frequencyMins: 8,
    activeBusesCount: 4,
    stops: [
      { id: 'stop-101-1', name: 'Central Grand Terminal', code: 'CGT', zone: 'Zone A (Central)', distanceKmFromStart: 0.0, lat: 40.7527, lng: -73.9772 },
      { id: 'stop-101-2', name: 'Financial Plaza & 5th Ave', code: 'FP5', zone: 'Zone A (Central)', distanceKmFromStart: 3.2, lat: 40.7484, lng: -73.9857 },
      { id: 'stop-101-3', name: 'University Campus North', code: 'UCN', zone: 'Zone B (Midtown)', distanceKmFromStart: 8.4, lat: 40.7291, lng: -73.9965 },
      { id: 'stop-101-4', name: 'Tech Innovation Park', code: 'TIP', zone: 'Zone B (Midtown)', distanceKmFromStart: 12.8, lat: 40.7128, lng: -74.0060 },
      { id: 'stop-101-5', name: 'Harbor Gateway Hub', code: 'HGH', zone: 'Zone C (Harbor)', distanceKmFromStart: 18.5, lat: 40.6892, lng: -74.0445 },
    ],
    liveBuses: [
      { id: 'bus-101-a', busNumber: 'BUS-101A', routeId: 'route-101', currentStopId: 'stop-101-2', nextStopId: 'stop-101-3', progressToNextPercent: 45, occupancyPercent: 62, status: 'ON_TIME', speedKmh: 42, driverName: 'Marcus Vance' },
      { id: 'bus-101-b', busNumber: 'BUS-101B', routeId: 'route-101', currentStopId: 'stop-101-4', nextStopId: 'stop-101-5', progressToNextPercent: 80, occupancyPercent: 88, status: 'ON_TIME', speedKmh: 48, driverName: 'Elena Rostova' },
      { id: 'bus-101-c', busNumber: 'BUS-101C', routeId: 'route-101', currentStopId: 'stop-101-1', nextStopId: 'stop-101-2', progressToNextPercent: 15, occupancyPercent: 28, status: 'EARLY', speedKmh: 35, driverName: 'David Chen' },
    ]
  },
  {
    id: 'route-202',
    code: '202-LOOP',
    name: 'City Loop 202: Historic & Cultural Belt',
    category: 'City Circular',
    color: '#10B981', // Emerald
    baseFare: 2.00,
    perKmRate: 0.25,
    totalDistanceKm: 14.2,
    frequencyMins: 10,
    activeBusesCount: 3,
    stops: [
      { id: 'stop-202-1', name: 'Civic Center Plaza', code: 'CCP', zone: 'Zone A (Central)', distanceKmFromStart: 0.0, lat: 40.7127, lng: -74.0059 },
      { id: 'stop-202-2', name: 'Metropolitan Art Museum', code: 'MAM', zone: 'Zone A (Central)', distanceKmFromStart: 4.1, lat: 40.7794, lng: -73.9632 },
      { id: 'stop-202-3', name: 'Green Park Botanical', code: 'GPB', zone: 'Zone B (Midtown)', distanceKmFromStart: 8.6, lat: 40.7614, lng: -73.9776 },
      { id: 'stop-202-4', name: ' Waterfront Promenade', code: 'WFP', zone: 'Zone C (Harbor)', distanceKmFromStart: 14.2, lat: 40.7022, lng: -74.0150 },
    ],
    liveBuses: [
      { id: 'bus-202-a', busNumber: 'BUS-202A', routeId: 'route-202', currentStopId: 'stop-202-1', nextStopId: 'stop-202-2', progressToNextPercent: 65, occupancyPercent: 40, status: 'ON_TIME', speedKmh: 30, driverName: 'Sarah Jenkins' },
      { id: 'bus-202-b', busNumber: 'BUS-202B', routeId: 'route-202', currentStopId: 'stop-202-3', nextStopId: 'stop-202-4', progressToNextPercent: 25, occupancyPercent: 75, status: 'DELAYED', speedKmh: 22, driverName: 'Carlos Gomez' },
    ]
  },
  {
    id: 'route-303',
    code: '303-SUB',
    name: 'Suburban Link 303: Westland Commuter',
    category: 'Suburban Rapid',
    color: '#8B5CF6', // Purple
    baseFare: 3.00,
    perKmRate: 0.40,
    totalDistanceKm: 26.0,
    frequencyMins: 15,
    activeBusesCount: 3,
    stops: [
      { id: 'stop-303-1', name: 'Central Grand Terminal', code: 'CGT', zone: 'Zone A (Central)', distanceKmFromStart: 0.0, lat: 40.7527, lng: -73.9772 },
      { id: 'stop-303-2', name: 'Westside Transit Interchange', code: 'WTI', zone: 'Zone B (Midtown)', distanceKmFromStart: 9.5, lat: 40.7589, lng: -73.9851 },
      { id: 'stop-303-3', name: 'Oakridge Suburb Park & Ride', code: 'OSR', zone: 'Zone D (Outer West)', distanceKmFromStart: 18.2, lat: 40.7850, lng: -74.0200 },
      { id: 'stop-303-4', name: 'Highland Ridge Terminal', code: 'HRT', zone: 'Zone D (Outer West)', distanceKmFromStart: 26.0, lat: 40.8100, lng: -74.0500 },
    ],
    liveBuses: [
      { id: 'bus-303-a', busNumber: 'BUS-303A', routeId: 'route-303', currentStopId: 'stop-303-2', nextStopId: 'stop-303-3', progressToNextPercent: 50, occupancyPercent: 92, status: 'ON_TIME', speedKmh: 55, driverName: 'Robert Sterling' },
    ]
  },
  {
    id: 'route-404',
    code: '404-AIR',
    name: 'SkyPort 404: International Airport Shuttle',
    category: 'Airport Shuttle',
    color: '#F59E0B', // Amber
    baseFare: 5.00,
    perKmRate: 0.50,
    totalDistanceKm: 22.0,
    frequencyMins: 12,
    activeBusesCount: 2,
    stops: [
      { id: 'stop-404-1', name: 'Central Grand Terminal', code: 'CGT', zone: 'Zone A (Central)', distanceKmFromStart: 0.0, lat: 40.7527, lng: -73.9772 },
      { id: 'stop-404-2', name: 'Airport Terminal 1 & 2', code: 'AP1', zone: 'Zone Airport', distanceKmFromStart: 19.0, lat: 40.6413, lng: -73.7781 },
      { id: 'stop-404-3', name: 'Airport International Terminal 4', code: 'AP4', zone: 'Zone Airport', distanceKmFromStart: 22.0, lat: 40.6430, lng: -73.7820 },
    ],
    liveBuses: [
      { id: 'bus-404-a', busNumber: 'BUS-404A', routeId: 'route-404', currentStopId: 'stop-404-1', nextStopId: 'stop-404-2', progressToNextPercent: 70, occupancyPercent: 55, status: 'ON_TIME', speedKmh: 65, driverName: 'Amara Okafor' },
    ]
  }
];
