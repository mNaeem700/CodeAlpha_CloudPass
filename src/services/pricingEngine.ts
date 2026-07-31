import { FareBreakdown, FareCalculationRequest, PassCategory, PassType } from '../types';
import { INITIAL_BUS_ROUTES } from '../data/mockRoutes';

export function calculateFare(req: FareCalculationRequest): FareBreakdown {
  const { passType, category, routeId, originStopId, destinationStopId } = req;
  const route = INITIAL_BUS_ROUTES.find(r => r.id === routeId) || INITIAL_BUS_ROUTES[0];

  let distanceKm = route.totalDistanceKm;
  let originZone = 'Zone A (Central)';
  let destZone = 'Zone A (Central)';

  if (originStopId && destinationStopId) {
    const orig = route.stops.find(s => s.id === originStopId);
    const dest = route.stops.find(s => s.id === destinationStopId);
    if (orig && dest) {
      distanceKm = Math.abs(dest.distanceKmFromStart - orig.distanceKmFromStart);
      if (distanceKm === 0) distanceKm = 2.0; // Minimum ride
      originZone = orig.zone;
      destZone = dest.zone;
    }
  }

  // Base fare calculation based on pass type
  let baseFare = route.baseFare;
  let distanceFare = distanceKm * route.perKmRate;
  let zoneSurcharge = originZone !== destZone ? 0.75 : 0.00;

  let originalFare = 0;

  switch (passType) {
    case 'single':
      originalFare = baseFare + distanceFare + zoneSurcharge;
      break;
    case 'daily':
      // Unlimited 24-hour pass ~ equivalent to 4 single trips
      originalFare = (baseFare + distanceFare + zoneSurcharge) * 3.2;
      break;
    case 'weekly':
      // 7-day commuter pass
      originalFare = (baseFare + distanceFare + zoneSurcharge) * 12.0;
      break;
    case 'monthly':
      // 30-day unlimited network pass
      originalFare = (baseFare + distanceFare + zoneSurcharge) * 38.0;
      break;
    case 'student':
      // Student monthly special
      originalFare = 45.00;
      break;
    case 'senior':
      // Senior off-peak pass
      originalFare = 30.00;
      break;
    case 'commuter':
      // 20-trip commuter bundle
      originalFare = (baseFare + distanceFare + zoneSurcharge) * 15.0;
      break;
    default:
      originalFare = baseFare + distanceFare;
  }

  // Category discount calculations (Anti-Incorrect Pricing)
  let discountPercentage = 0;
  let discountReason = 'Standard Full Fare';

  if (category === 'Student') {
    discountPercentage = 0.50; // 50% off
    discountReason = 'Student Concession (50% Off Verified)';
  } else if (category === 'Senior') {
    discountPercentage = 0.40; // 40% off
    discountReason = 'Senior Citizen Concession (40% Off Verified)';
  } else if (category === 'Veteran / Access') {
    discountPercentage = 0.60; // 60% off
    discountReason = 'Veteran & Accessibility Transit Pass (60% Off)';
  }

  // If specific passType already accounts for category discount
  if (passType === 'student' || passType === 'senior') {
    discountPercentage = 0.00; // Built into base package
    discountReason = `Bundled ${passType.toUpperCase()} Package`;
  }

  const concessionDiscount = originalFare * discountPercentage;
  const fareAfterDiscount = originalFare - concessionDiscount;
  const platformFee = 0.00; // Cloud zero fee
  const finalFare = Math.max(1.00, Number((fareAfterDiscount + platformFee).toFixed(2)));

  return {
    baseFare: Number(baseFare.toFixed(2)),
    distanceFare: Number(distanceFare.toFixed(2)),
    zoneSurcharge: Number(zoneSurcharge.toFixed(2)),
    originalFare: Number(originalFare.toFixed(2)),
    concessionDiscount: Number(concessionDiscount.toFixed(2)),
    discountPercentage: Math.round(discountPercentage * 100),
    discountReason,
    platformFee,
    finalFare,
    zoneName: originZone === destZone ? originZone : `${originZone} → ${destZone}`,
    distanceKm: Number(distanceKm.toFixed(1)),
  };
}
