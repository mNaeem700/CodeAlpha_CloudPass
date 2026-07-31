import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_BUS_ROUTES } from './src/data/mockRoutes';
import { INITIAL_PASSES } from './src/data/initialPasses';
import { calculateFare } from './src/services/pricingEngine';
import { generateChecksum, verifyBusPass } from './src/services/securityToken';
import { BusPass, ServerNode, CloudMetrics } from './src/types';

const app = express();
app.use(express.json());

const PORT = 3000;

// In-Memory Cloud State
let passDatabase: BusPass[] = [...INITIAL_PASSES];

// Simulated Cloud Nodes Engine
let serverNodes: ServerNode[] = [
  { id: 'node-us-east-1a', name: 'us-east-1a (Master Ingress)', region: 'US-East (N. Virginia)', status: 'HEALTHY', cpuPercent: 24, memoryPercent: 41, requestsPerSec: 1420, activeConnections: 890, uptimeSeconds: 948200 },
  { id: 'node-us-east-1b', name: 'us-east-1b (Booking Worker)', region: 'US-East (N. Virginia)', status: 'HEALTHY', cpuPercent: 31, memoryPercent: 52, requestsPerSec: 1850, activeConnections: 1120, uptimeSeconds: 948200 },
  { id: 'node-us-west-2a', name: 'us-west-2a (Pass Validator Node)', region: 'US-West (Oregon)', status: 'HEALTHY', cpuPercent: 18, memoryPercent: 35, requestsPerSec: 940, activeConnections: 610, uptimeSeconds: 512000 },
  { id: 'node-eu-west-1a', name: 'eu-west-1a (Read Replica)', region: 'EU-West (Frankfurt)', status: 'HEALTHY', cpuPercent: 12, memoryPercent: 28, requestsPerSec: 520, activeConnections: 340, uptimeSeconds: 1240000 },
];

let cloudMetrics: CloudMetrics = {
  totalRequestsProcessed: 4892104,
  currentRps: 4730,
  avgLatencyMs: 14,
  p99LatencyMs: 38,
  activeInstances: 4,
  minInstances: 2,
  maxInstances: 32,
  cacheHitRatio: 98.4,
  errorRatePercent: 0.001,
  autoScalingMode: 'AUTOMATIC_DYNAMIC',
  costPerHour: 0.96
};

// Periodic simulated cloud telemetry fluctuations
setInterval(() => {
  const noise = (Math.random() - 0.5) * 150;
  cloudMetrics.currentRps = Math.max(800, Math.round(cloudMetrics.currentRps + noise));
  cloudMetrics.totalRequestsProcessed += Math.round(cloudMetrics.currentRps / 10);
  
  // Adjust Node CPUs
  serverNodes.forEach(node => {
    if (node.status === 'HEALTHY') {
      const loadFactor = cloudMetrics.currentRps / (cloudMetrics.activeInstances * 1500);
      node.cpuPercent = Math.min(95, Math.max(12, Math.round(loadFactor * 50 + (Math.random() - 0.5) * 10)));
      node.memoryPercent = Math.min(90, Math.max(25, Math.round(node.cpuPercent * 0.8 + 15)));
      node.requestsPerSec = Math.round(cloudMetrics.currentRps / cloudMetrics.activeInstances + (Math.random() - 0.5) * 100);
    }
  });
}, 3000);

// Initialize Gemini AI Client lazily if secret present
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('Gemini client init error:', err);
    }
  }
  return aiClient;
}

// --- API ENDPOINTS ---

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Cloud Bus Pass Infrastructure API',
    nodesActive: serverNodes.filter(n => n.status === 'HEALTHY').length,
    timestamp: new Date().toISOString()
  });
});

// GET Bus Routes & Realtime bus positions
app.get('/api/routes', (req, res) => {
  res.json({
    success: true,
    routes: INITIAL_BUS_ROUTES
  });
});

// POST Calculate Fair Price (Prevents Human Error)
app.post('/api/pricing', (req, res) => {
  try {
    const fare = calculateFare(req.body);
    res.json({ success: true, fare });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET & POST Pass Management
app.get('/api/passes', (req, res) => {
  res.json({ success: true, passes: passDatabase });
});

app.post('/api/passes', (req, res) => {
  try {
    const { userName, userEmail, passType, category, routeId, originStopId, destinationStopId, photoUrl } = req.body;
    
    if (!userName || !userEmail || !passType || !category) {
      return res.status(400).json({ success: false, error: 'Missing required pass registration details' });
    }

    const fareBreakdown = calculateFare({ passType, category, routeId, originStopId, destinationStopId });

    const passId = 'pass-' + Date.now().toString().slice(-6);
    const passNumber = `BP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    
    let validDays = 1;
    if (passType === 'daily') validDays = 1;
    else if (passType === 'weekly') validDays = 7;
    else if (passType === 'monthly' || passType === 'student' || passType === 'senior') validDays = 30;
    else if (passType === 'commuter') validDays = 90;

    const validUntil = new Date(now.getTime() + validDays * 86400000).toISOString();

    const selectedRoute = INITIAL_BUS_ROUTES.find(r => r.id === routeId);
    let originStopName = 'All Network Stops';
    let destinationStopName = 'All Network Stops';
    if (selectedRoute && originStopId && destinationStopId) {
      originStopName = selectedRoute.stops.find(s => s.id === originStopId)?.name || 'Central Terminal';
      destinationStopName = selectedRoute.stops.find(s => s.id === destinationStopId)?.name || 'Destination Terminal';
    }

    const newPass: BusPass = {
      id: passId,
      passNumber,
      userName,
      userEmail,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      passType,
      category,
      routeId,
      routeName: selectedRoute?.name || 'Network Wide Pass',
      originStopId,
      originStopName,
      destinationStopId,
      destinationStopName,
      zone: fareBreakdown.zoneName,
      farePaid: fareBreakdown.finalFare,
      originalFare: fareBreakdown.originalFare,
      discountAmount: fareBreakdown.concessionDiscount,
      discountReason: fareBreakdown.discountReason,
      issuedAt: now.toISOString(),
      validFrom: now.toISOString(),
      validUntil,
      status: 'ACTIVE',
      qrSignature: generateChecksum(`${passId}:${userEmail}:${validUntil}`),
      dynamicSecurityCode: Math.floor(100000 + Math.random() * 900000).toString(),
      tripsRemaining: passType === 'single' ? 1 : (passType === 'commuter' ? 20 : undefined),
      maxTrips: passType === 'single' ? 1 : (passType === 'commuter' ? 20 : undefined),
      checksumHash: `SHA256-${Math.random().toString(16).slice(2, 10)}`,
      deviceFingerprint: `DEV-PROV-${Math.floor(1000 + Math.random() * 9000)}`
    };

    passDatabase.unshift(newPass);

    res.json({
      success: true,
      pass: newPass,
      message: 'Pass dynamically provisioned on cloud backend'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST Verify Scanned Pass
app.post('/api/verify', (req, res) => {
  const { code, inspectorId } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: 'Scan payload or pass ID required' });
  }

  const verificationResult = verifyBusPass(code, passDatabase, inspectorId || 'INSPECTOR-CLOUD');
  res.json({ success: true, result: verificationResult });
});

// POST Revoke Pass on Backend Ledger
app.post('/api/passes/:id/revoke', (req, res) => {
  const { id } = req.params;
  const pass = passDatabase.find(p => p.id === id);
  if (!pass) return res.status(404).json({ success: false, error: 'Pass not found' });
  
  pass.status = 'REVOKED';
  res.json({ success: true, pass, message: 'Pass successfully marked REVOKED in cloud security ledger' });
});

// POST Record Single Trip Usage
app.post('/api/passes/:id/use-trip', (req, res) => {
  const { id } = req.params;
  const pass = passDatabase.find(p => p.id === id);
  if (!pass) return res.status(404).json({ success: false, error: 'Pass not found' });
  if (pass.status !== 'ACTIVE') return res.status(400).json({ success: false, error: 'Pass is not active' });

  if (pass.tripsRemaining !== undefined) {
    if (pass.tripsRemaining <= 0) {
      return res.status(400).json({ success: false, error: 'No remaining trips on this pass' });
    }
    pass.tripsRemaining -= 1;
    if (pass.tripsRemaining === 0 && pass.passType === 'single') {
      pass.status = 'EXPIRED';
    }
  }

  res.json({ success: true, pass, message: 'Single trip recorded' });
});

// GET Cloud Metrics & POST Scale Simulator
app.get('/api/autoscale/metrics', (req, res) => {
  res.json({
    success: true,
    metrics: cloudMetrics,
    nodes: serverNodes
  });
});

app.post('/api/autoscale/simulate-spike', (req, res) => {
  const { targetRps } = req.body;
  const spikeRps = targetRps || 15000;
  
  cloudMetrics.currentRps = spikeRps;
  
  // Trigger Auto-scaler logic: calculate needed nodes
  const neededNodes = Math.min(32, Math.max(2, Math.ceil(spikeRps / 1200)));
  
  if (neededNodes > serverNodes.length) {
    const toAdd = neededNodes - serverNodes.length;
    for (let i = 0; i < toAdd; i++) {
      const idx = serverNodes.length + 1;
      serverNodes.push({
        id: `node-auto-scale-${idx}`,
        name: `auto-scale-node-#0${idx}`,
        region: idx % 2 === 0 ? 'US-East (Virginia)' : 'US-West (Oregon)',
        status: 'PROVISIONING',
        cpuPercent: 85,
        memoryPercent: 70,
        requestsPerSec: Math.round(spikeRps / neededNodes),
        activeConnections: 1200,
        uptimeSeconds: 0
      });
    }

    setTimeout(() => {
      serverNodes.forEach(n => {
        if (n.status === 'PROVISIONING') n.status = 'HEALTHY';
      });
    }, 2500);
  }

  cloudMetrics.activeInstances = serverNodes.length;
  cloudMetrics.costPerHour = Number((serverNodes.length * 0.24).toFixed(2));

  res.json({
    success: true,
    message: `High-Traffic Surge (${spikeRps} req/sec) simulated. Auto-Scaler dynamically provisioned instances!`,
    activeInstances: serverNodes.length,
    metrics: cloudMetrics,
    nodes: serverNodes
  });
});

// POST Reset Scaling Engine
app.post('/api/autoscale/reset', (req, res) => {
  serverNodes = serverNodes.slice(0, 4);
  serverNodes.forEach(n => {
    n.status = 'HEALTHY';
    n.cpuPercent = 25;
  });
  cloudMetrics.currentRps = 4730;
  cloudMetrics.activeInstances = 4;
  cloudMetrics.costPerHour = 0.96;
  res.json({ success: true, message: 'Cluster returned to baseline load.', metrics: cloudMetrics, nodes: serverNodes });
});

// POST Gemini Transit AI Assistant
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message content is required' });

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are the Cloud Transit Assistant for the Cloud Bus Pass System.
You help passengers with fare advice, pass types (Single ticket, Daily 24h unlimited, Monthly student 50% discount, Senior 40% discount), route details, preventing pass loss, dynamic pricing explanations, and cloud scalability features.
Keep responses concise, friendly, helpful, and scannable.

User Query: "${message}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      return res.json({ success: true, text: response.text });
    } catch (err) {
      console.error('Gemini call error:', err);
    }
  }

  // Fallback Rule Engine if key not active
  const lower = message.toLowerCase();
  let fallbackReply = "I can help you select the best pass! For daily commuters, the Monthly Pass offers up to 50% savings. Students get a verified 50% concession discount automatically computed by our price protection engine.";

  if (lower.includes('student') || lower.includes('discount')) {
    fallbackReply = "Students receive an automatic 50% concession discount! Our dynamic pricing engine verifies student identity and locks the rate at $45.00/month for unlimited network travel.";
  } else if (lower.includes('loss') || lower.includes('stolen') || lower.includes('theft')) {
    fallbackReply = "Passes cannot be lost or stolen! Every pass is stored in your Cloud Wallet, linked to your verified account, and protected by dynamic rolling security tokens and cryptographic QR signatures.";
  } else if (lower.includes('scale') || lower.includes('traffic') || lower.includes('server')) {
    fallbackReply = "Our system uses dynamic cloud auto-scaling. During high rush-hour surges (up to 30,000 requests/sec), container instances spin up within 2.5 seconds to ensure zero latency and zero ticket booking dropouts.";
  } else if (lower.includes('route') || lower.includes('schedule') || lower.includes('bus')) {
    fallbackReply = "We feature 4 primary express & commuter routes with real-time GPS tracking and live bus occupancy meters (e.g. Line 101 Downtown Express, City Loop 202, Suburban 303, SkyPort 404).";
  }

  res.json({ success: true, text: fallbackReply });
});

async function startServer() {
  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cloud Bus Pass Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
