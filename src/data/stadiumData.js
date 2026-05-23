// Centralized database for all matchday simulation scenarios
// Mathematically centered at cx = 300, cy = 225 to align with the cricket field center of the image
export const scenarioDatabase = {
  baseline: {
    fans: 48320, capacity: 72, risk: 3, ai: 91, wait: 14,
    alertTitle: "TOP RISK DETECTED",
    alertDesc: "Gate A Congestion approaching critical mass. Current queue length exceeds safe operational limits by <span class='font-mono text-error font-bold'>24%</span>.",
    recTitle: "AI RECOMMENDATION",
    recDesc: "Reroute incoming Metro pedestrian traffic to Gate C. Deploy 6 standby volunteers to assist redirection.",
    recConfidence: "94%",
    mapText: "LIVE FEED",
    nodes: [
      { id: 1, top: "50%", left: "15%", right: "auto", color: "error", label: "GATE A: 92% DENSITY", hasRing: true },
      { id: 2, top: "20%", left: "50%", right: "auto", color: "primary", label: "NORTH STAND: 65%", hasRing: false }
    ],
    routes: [
      { id: 'route-1', from: "Gate A", to: "West Entry", reason: "Critical Congestion (>92%)", wait: "-18m", impact: "HIGH", pressure: "-34%", color: "primary", startX: '15%', startY: '50%', endX: '30%', endY: '50%' },
      { id: 'route-2', from: "North Stand", to: "East Concourse", reason: "Flow Rebalancing", wait: "-12m", impact: "MEDIUM", pressure: "-21%", color: "tertiary", startX: '50%', startY: '20%', endX: '80%', endY: '50%' }
    ],
    fcmNotifications: [
      { id: 101, title: "Alert", text: "Fans near Gate A are requested to proceed to Gate C for faster and safer entry.", type: "primary" },
      { id: 102, title: "Weather Update", text: "Rain alert: Covered concourse access is open through South Stand.", type: "tertiary" },
      { id: 103, title: "Medical", text: "Medical team is responding near North Stand. Please keep the lane clear.", type: "error" },
      { id: 104, title: "Exit Route", text: "Post-match exit traffic is high near Metro Exit. Use Parking Exit route.", type: "secondary" }
    ],
    kanbanTasks: [
      { id: 201, priority: 'Low', team: 'Security Team Alpha', zone: 'North Stand', action: 'Routine perimeter check and crowd monitoring.', status: 'Pending' },
      { id: 202, priority: 'Medium', team: 'Volunteer Group C', zone: 'Gate B', action: 'Assist with ticket scanning setup for early arrivals.', status: 'In Progress' },
      { id: 203, priority: 'Low', team: 'Maintenance Unit', zone: 'East Concourse', action: 'Verify exit route signage visibility.', status: 'Done' }
    ],
    sectors: [
      { id: 'north_stand_upper', name: "North Stand - Upper Deck", fans: 12450, density: 65, risk: 'primary', staff: 18, details: "Calm flow. Tiers clear and standard exit routes fully operational.", startAngle: 210, endAngle: 330, rIn: 190, rOut: 260 },
      { id: 'north_stand_lower', name: "North Stand - Lower Stand", fans: 9800, density: 50, risk: 'primary', staff: 12, details: "Concourse clear. Food vendors reporting steady baseline traffic.", startAngle: 210, endAngle: 330, rIn: 120, rOut: 190 },
      { id: 'west_stand_upper', name: "West Concourse Upper", fans: 14120, density: 92, risk: 'error', staff: 22, details: "Severe backlog forming near Gate A entrance scan turnstiles.", startAngle: 150, endAngle: 210, rIn: 190, rOut: 260 },
      { id: 'west_stand_lower', name: "West Stand Lower", fans: 8950, density: 45, risk: 'primary', staff: 10, details: "Seating rows calm. Fans proceeding down aisle corridors slowly.", startAngle: 150, endAngle: 210, rIn: 120, rOut: 190 },
      { id: 'south_stand_upper', name: "South Stand - Upper Deck", fans: 9200, density: 55, risk: 'primary', staff: 14, details: "Traffic free-flowing. Standby stewards reporting no visual bottlenecking.", startAngle: 30, endAngle: 150, rIn: 190, rOut: 260 },
      { id: 'south_stand_lower', name: "South Stand - Lower Stand", fans: 11000, density: 60, risk: 'primary', staff: 15, details: "Egress paths clear. Volunteers positioned at stairwell exits.", startAngle: 30, endAngle: 150, rIn: 120, rOut: 190 }
    ],
    analytics: {
      flowVelocity: [
        { time: "10m ago", entry: 420, exit: 110 },
        { time: "8m ago", entry: 480, exit: 140 },
        { time: "6m ago", entry: 530, exit: 160 },
        { time: "4m ago", entry: 610, exit: 190 },
        { time: "2m ago", entry: 690, exit: 230 },
        { time: "Current", entry: 750, exit: 280 }
      ],
      gateWaitTimes: [
        { gate: "Gate A", wait: 32 },
        { gate: "Gate B", wait: 14 },
        { gate: "Gate C", wait: 8 },
        { gate: "Gate D", wait: 11 },
        { gate: "Gate E", wait: 5 }
      ]
    }
  },
  crowd_surge: {
    fans: 62150, capacity: 92, risk: 7, ai: 88, wait: 32,
    alertTitle: "MASSIVE INFLOW SURGE",
    alertDesc: "Unprecedented arrival rate detected at Main Promenade. Turnstiles operating at <span class='font-mono text-error font-bold'>110%</span> capacity.",
    recTitle: "LOAD BALANCING",
    recDesc: "Open auxiliary gates D and E. Display dynamic signage directing Eastbound traffic to overflow scanning lanes.",
    recConfidence: "96%",
    mapText: "SIM: SURGE",
    nodes: [
      { id: 1, top: "50%", left: "15%", right: "auto", color: "error", label: "MAIN PROMENADE: SURGE", hasRing: true },
      { id: 2, top: "20%", left: "40%", right: "auto", color: "tertiary", label: "GATE D: PREPARING", hasRing: false }
    ],
    routes: [
      { id: 'route-4', from: "Main Promenade", to: "Gate D", reason: "Promenade Surge (>110%)", wait: "-22m", impact: "CRITICAL", pressure: "-45%", color: "error", startX: '15%', startY: '50%', endX: '40%', endY: '20%' }
    ],
    fcmNotifications: [
      { id: 105, title: "Surge Alert", text: "Main Promenade surge detected. Turnstiles at Gate A are congested. Proceed to Gate D/E.", type: "error" },
      { id: 106, title: "Entry redirection", text: "Dynamic signs activated. Follow green indicator paths to overflow scanning lanes.", type: "primary" }
    ],
    kanbanTasks: [
      { id: 204, priority: 'Critical', team: 'Security Team Beta', zone: 'Gate A', action: 'Deploy crowd control barriers immediately. High pressure detected.', status: 'Pending' },
      { id: 205, priority: 'High', team: 'Volunteer Group A', zone: 'South Stand Exit', action: 'Reroute exiting fans to alternative Metro walkway.', status: 'Pending' },
      { id: 206, priority: 'Medium', team: 'Medical Unit 1', zone: 'Concourse West', action: 'Standby for potential crush injuries during outflow.', status: 'In Progress' }
    ],
    sectors: [
      { id: 'north_stand_upper', name: "North Stand - Upper Deck", fans: 14500, density: 75, risk: 'tertiary', staff: 20, details: "Normal entry speed. Tiers starting to fill.", startAngle: 210, endAngle: 330, rIn: 190, rOut: 260 },
      { id: 'north_stand_lower', name: "North Stand - Lower Stand", fans: 11200, density: 60, risk: 'primary', staff: 14, details: "Steady inflow. F&B queues building up.", startAngle: 210, endAngle: 330, rIn: 120, rOut: 190 },
      { id: 'west_stand_upper', name: "West Concourse Upper", fans: 18500, density: 110, risk: 'error', staff: 48, details: "CRITICAL INFLOW BACKLOG. Promenade scanning lines saturated.", startAngle: 150, endAngle: 210, rIn: 190, rOut: 260 },
      { id: 'west_stand_lower', name: "West Stand Lower", fans: 11550, density: 85, risk: 'tertiary', staff: 22, details: "High seating row density. Directing fans to bypass corridors.", startAngle: 150, endAngle: 210, rIn: 120, rOut: 190 },
      { id: 'south_stand_upper', name: "South Stand - Upper Deck", fans: 10900, density: 62, risk: 'primary', staff: 15, details: "Slight build-up at exit gates, monitoring closely.", startAngle: 30, endAngle: 150, rIn: 190, rOut: 260 },
      { id: 'south_stand_lower', name: "South Stand - Lower Stand", fans: 12500, density: 68, risk: 'primary', staff: 16, details: "Calm progression. Stewards maintaining steady lines.", startAngle: 30, endAngle: 150, rIn: 120, rOut: 190 }
    ],
    analytics: {
      flowVelocity: [
        { time: "10m ago", entry: 710, exit: 90 },
        { time: "8m ago", entry: 890, exit: 110 },
        { time: "6m ago", entry: 1100, exit: 130 },
        { time: "4m ago", entry: 1290, exit: 140 },
        { time: "2m ago", entry: 1450, exit: 160 },
        { time: "Current", entry: 1680, exit: 190 }
      ],
      gateWaitTimes: [
        { gate: "Gate A", wait: 48 },
        { gate: "Gate B", wait: 28 },
        { gate: "Gate C", wait: 12 },
        { gate: "Gate D", wait: 25 },
        { gate: "Gate E", wait: 22 }
      ]
    }
  },
  rain_alert: {
    fans: 55000, capacity: 82, risk: 5, ai: 95, wait: 22,
    alertTitle: "WEATHER EVENT",
    alertDesc: "Sudden precipitation. Fans moving rapidly to indoor concourses causing severe density spikes in sectors <span class='font-mono text-error font-bold'>B & C</span>.",
    recTitle: "CONCOURSE MANAGEMENT",
    recDesc: "Open all corporate hospitality overflow areas. Halt F&B sales temporarily to clear vendor queues.",
    recConfidence: "89%",
    mapText: "SIM: RAIN",
    nodes: [
      { id: 1, top: "20%", left: "30%", right: "auto", color: "tertiary", label: "SECTOR B: SHELTERING", hasRing: true },
      { id: 2, top: "50%", left: "15%", right: "auto", color: "tertiary", label: "SECTOR C: SHELTERING", hasRing: true }
    ],
    routes: [
      { id: 'route-6', from: "Open Terraces", to: "Concourse B", reason: "Sudden Downpour Alert", wait: "N/A", impact: "CRITICAL", pressure: "+15%", color: "error", startX: '30%', startY: '20%', endX: '15%', endY: '50%' }
    ],
    fcmNotifications: [
      { id: 107, title: "Weather Update", text: "Sudden downpour. Covered concourse shelter is open at Sectors B & C. Please walk slowly.", type: "tertiary" },
      { id: 108, title: "Shelter opening", text: "Corporate hospitality spaces are now unlocked for open crowd shelter.", type: "primary" }
    ],
    kanbanTasks: [
      { id: 207, priority: 'High', team: 'Volunteer Group B', zone: 'Open Stands', action: 'Guide fans safely to indoor concourses. Prevent slipping.', status: 'Pending' },
      { id: 208, priority: 'Critical', team: 'Maintenance Unit', zone: 'Main Hall', action: 'Deploy absorbent mats at all indoor entrances immediately.', status: 'In Progress' },
      { id: 209, priority: 'Medium', team: 'Security Team Alpha', zone: 'Corridor 4', action: 'Monitor indoor density levels to prevent overcrowding.', status: 'Pending' }
    ],
    sectors: [
      { id: 'north_stand_upper', name: "North Stand - Upper Deck", fans: 9200, density: 40, risk: 'primary', staff: 15, details: "Fans evacuated open tiers. Sheltering inside.", startAngle: 210, endAngle: 330, rIn: 190, rOut: 260 },
      { id: 'north_stand_lower', name: "North Stand - Lower Stand", fans: 16800, density: 95, risk: 'error', staff: 28, details: "CONCOURSE OVERFLOW ACTIVE. High density indoors.", startAngle: 210, endAngle: 330, rIn: 120, rOut: 190 },
      { id: 'west_stand_upper', name: "West Concourse Upper", fans: 11000, density: 50, risk: 'primary', staff: 18, details: "Covered walkway operating steady load.", startAngle: 150, endAngle: 210, rIn: 190, rOut: 260 },
      { id: 'west_stand_lower', name: "West Stand Lower", fans: 15500, density: 92, risk: 'error', staff: 25, details: "HIGH SECTOR CONGESTION. Redirection suite active.", startAngle: 150, endAngle: 210, rIn: 120, rOut: 190 },
      { id: 'south_stand_upper', name: "South Stand - Upper Deck", fans: 8500, density: 42, risk: 'primary', staff: 10, details: "Calm. Most fans gathered under shelter decks.", startAngle: 30, endAngle: 150, rIn: 190, rOut: 260 },
      { id: 'south_stand_lower', name: "South Stand - Lower Stand", fans: 13000, density: 80, risk: 'tertiary', staff: 22, details: "Stewards managing dry concourse entrances.", startAngle: 30, endAngle: 150, rIn: 120, rOut: 190 }
    ],
    analytics: {
      flowVelocity: [
        { time: "10m ago", entry: 540, exit: 140 },
        { time: "8m ago", entry: 320, exit: 250 },
        { time: "6m ago", entry: 180, exit: 430 },
        { time: "4m ago", entry: 110, exit: 680 },
        { time: "2m ago", entry: 80, exit: 910 },
        { time: "Current", entry: 50, exit: 1120 }
      ],
      gateWaitTimes: [
        { gate: "Gate A", wait: 18 },
        { gate: "Gate B", wait: 22 },
        { gate: "Gate C", wait: 35 },
        { gate: "Gate D", wait: 8 },
        { gate: "Gate E", wait: 6 }
      ]
    }
  },
  medical: {
    fans: 48320, capacity: 72, risk: 1, ai: 99, wait: 14,
    alertTitle: "MEDICAL INCIDENT",
    alertDesc: "Cardiac event reported in Block 104, Row G. Immediate responder access required.",
    recTitle: "EMERGENCY ROUTING",
    recDesc: "Clear Aisle 4. Dispatch Med Team Alpha from North Base. Hold adjacent seating movement.",
    recConfidence: "99%",
    mapText: "SIM: MEDICAL",
    nodes: [
      { id: 1, top: "80%", left: "50%", right: "auto", color: "error", label: "BLOCK 104: EMERGENCY", hasRing: true },
      { id: 2, top: "20%", left: "40%", right: "auto", color: "secondary", label: "MED TEAM EN ROUTE", hasRing: true }
    ],
    routes: [
      { id: 'route-8', from: "Medical Base", to: "Block 104", reason: "Responder Priority Dispatch", wait: "-6m", impact: "CRITICAL", pressure: "N/A", color: "error", startX: '40%', startY: '20%', endX: '50%', endY: '80%' }
    ],
    fcmNotifications: [
      { id: 109, title: "Medical", text: "Emergency response in Block 104. Please clear Aisle 4 for responders.", type: "error" },
      { id: 110, title: "Emergency", text: "First responders en route from North Stand. Follow steward directions.", type: "primary" }
    ],
    kanbanTasks: [
      { id: 210, priority: 'Critical', team: 'Medical Team Alpha', zone: 'Block 104', action: 'Respond to medical alert. Stabilize casualty.', status: 'In Progress' },
      { id: 211, priority: 'High', team: 'Security Team Delta', zone: 'Aisle 4', action: 'Clear and hold corridor for medical stretcher access.', status: 'Pending' },
      { id: 212, priority: 'Low', team: 'Volunteer Group B', zone: 'North Base', action: 'Assist redirecting casual foot traffic away from Block 104 entrance.', status: 'Done' }
    ],
    sectors: [
      { id: 'north_stand_upper', name: "North Stand - Upper Deck", fans: 12450, density: 65, risk: 'primary', staff: 18, details: "Clear paths. Redirection base active.", startAngle: 210, endAngle: 330, rIn: 190, rOut: 260 },
      { id: 'north_stand_lower', name: "North Stand - Lower Stand", fans: 9800, density: 50, risk: 'primary', staff: 12, details: "Concourse clear. Stewards guiding normal traffic.", startAngle: 210, endAngle: 330, rIn: 120, rOut: 190 },
      { id: 'west_stand_upper', name: "West Concourse Upper", fans: 14120, density: 78, risk: 'primary', staff: 22, details: "Main corridors calm. Regular F&B operations.", startAngle: 150, endAngle: 210, rIn: 190, rOut: 260 },
      { id: 'west_stand_lower', name: "West Stand Lower", fans: 8950, density: 45, risk: 'primary', staff: 10, details: "Flow steady. Stewards monitoring.", startAngle: 150, endAngle: 210, rIn: 120, rOut: 190 },
      { id: 'south_stand_upper', name: "South Stand - Upper Deck", fans: 9200, density: 55, risk: 'primary', staff: 14, details: "South plaza parameters stable. Crowd held.", startAngle: 30, endAngle: 150, rIn: 190, rOut: 260 },
      { id: 'south_stand_lower', name: "South Stand - Lower Stand", fans: 11000, density: 80, risk: 'error', staff: 35, details: "CASUALTY BLOCK. Stretcher priority access route engaged.", startAngle: 30, endAngle: 150, rIn: 120, rOut: 190 }
    ],
    analytics: {
      flowVelocity: [
        { time: "10m ago", entry: 210, exit: 80 },
        { time: "8m ago", entry: 220, exit: 90 },
        { time: "6m ago", entry: 140, exit: 100 },
        { time: "4m ago", entry: 80, exit: 120 },
        { time: "2m ago", entry: 50, exit: 140 },
        { time: "Current", entry: 30, exit: 180 }
      ],
      gateWaitTimes: [
        { gate: "Gate A", wait: 12 },
        { gate: "Gate B", wait: 8 },
        { gate: "Gate C", wait: 6 },
        { gate: "Gate D", wait: 5 },
        { gate: "Gate E", wait: 4 }
      ]
    }
  },
  security: {
    fans: 48320, capacity: 72, risk: 9, ai: 97, wait: 0,
    alertTitle: "SECURITY PROTOCOL",
    alertDesc: "Unattended baggage detected at South Plaza. Security threat level elevated.",
    recTitle: "ZONE ISOLATION",
    recDesc: "Initiate Hard Lockdown for South Plaza. Reroute all exiting traffic through North and East exits only.",
    recConfidence: "98%",
    mapText: "SIM: SECURITY",
    nodes: [
      { id: 1, top: "80%", left: "50%", right: "auto", color: "error", label: "SOUTH PLAZA: THREAT", hasRing: true },
      { id: 2, top: "20%", left: "50%", right: "auto", color: "primary", label: "NORTH EXIT: CLEAR", hasRing: false }
    ],
    routes: [
      { id: 'route-10', from: "South Stand", to: "North Exit", reason: "Immediate Evacuation Rerouting", wait: "-10m", impact: "CRITICAL", pressure: "-50%", color: "primary", startX: '50%', startY: '80%', endX: '50%', endY: '20%' }
    ],
    fcmNotifications: [
      { id: 111, title: "Alert", text: "South Plaza is closed for security check. Please exit via North or East Gates.", type: "error" },
      { id: 112, title: "Security", text: "Lockdown active in Zone 8. Do not approach South gates.", type: "error" }
    ],
    kanbanTasks: [
      { id: 213, priority: 'Critical', team: 'Bomb Squad Unit', zone: 'South Plaza', action: 'Investigate unattended item. Secure area.', status: 'Pending' },
      { id: 214, priority: 'Critical', team: 'Security Team Alpha', zone: 'Turnstiles', action: 'Lock down all South Plaza exits immediately.', status: 'In Progress' },
      { id: 215, priority: 'High', team: 'Volunteer Group A', zone: 'North Exit', action: 'Deploy to North Exit to manage redirected flow.', status: 'Pending' }
    ],
    sectors: [
      { id: 'north_stand_upper', name: "North Stand - Upper Deck", fans: 15450, density: 85, risk: 'primary', staff: 35, details: "North exit fully functional. Receiving evacuated crowd flow.", startAngle: 210, endAngle: 330, rIn: 190, rOut: 260 },
      { id: 'north_stand_lower', name: "North Stand - Lower Stand", fans: 13800, density: 75, risk: 'primary', staff: 24, details: "Evacuation route active. Volunteers structuring exit lines.", startAngle: 210, endAngle: 330, rIn: 120, rOut: 190 },
      { id: 'west_stand_upper', name: "West Concourse Upper", fans: 16070, density: 82, risk: 'tertiary', staff: 22, details: "Directing fans away from South Plaza exits toward West gateways.", startAngle: 150, endAngle: 210, rIn: 190, rOut: 260 },
      { id: 'west_stand_lower', name: "West Stand Lower", fans: 12000, density: 70, risk: 'tertiary', staff: 18, details: "Perimeters monitored. Auxiliary patrols redirecting traffic.", startAngle: 150, endAngle: 210, rIn: 120, rOut: 190 },
      { id: 'south_stand_upper', name: "South Stand - Upper Deck", fans: 0, density: 0, risk: 'error', staff: 40, details: "HARD LOCKDOWN ACTIVE. Standing area completely evacuated.", startAngle: 30, endAngle: 150, rIn: 190, rOut: 260 },
      { id: 'south_stand_lower', name: "South Stand - Lower Stand", fans: 0, density: 0, risk: 'error', staff: 25, details: "HARD LOCKDOWN ACTIVE. Tactical response unit sweeping.", startAngle: 30, endAngle: 150, rIn: 120, rOut: 190 }
    ],
    analytics: {
      flowVelocity: [
        { time: "10m ago", entry: 180, exit: 450 },
        { time: "8m ago", entry: 90, exit: 750 },
        { time: "6m ago", entry: 20, exit: 1100 },
        { time: "4m ago", entry: 0, exit: 1490 },
        { time: "2m ago", entry: 0, exit: 1850 },
        { time: "Current", entry: 0, exit: 2300 }
      ],
      gateWaitTimes: [
        { gate: "Gate A", wait: 99 },
        { gate: "Gate B", wait: 99 },
        { gate: "Gate C", wait: 15 },
        { gate: "Gate D", wait: 8 },
        { gate: "Gate E", wait: 10 }
      ]
    }
  },
  gate_failure: {
    fans: 40000, capacity: 60, risk: 4, ai: 92, wait: 28,
    alertTitle: "INFRASTRUCTURE FAULT",
    alertDesc: "Gate B ticket scanner network failure. Backlog increasing by <span class='font-mono text-error font-bold'>50 pax/min</span>.",
    recTitle: "LOGISTICS REROUTE",
    recDesc: "Deploy mobile scanning units to Gate B. Redirect 30% of approaching queue to Gate C.",
    recConfidence: "91%",
    mapText: "SIM: FAULT",
    nodes: [
      { id: 1, top: "50%", left: "15%", right: "auto", color: "tertiary", label: "GATE B: OFFLINE", hasRing: true },
      { id: 2, top: "50%", left: "30%", right: "auto", color: "primary", label: "GATE C: RECEIVING", hasRing: false }
    ],
    routes: [
      { id: 'route-12', from: "Gate B", to: "Gate C", reason: "Scanner Malfunction Redirection", wait: "-10m", impact: "HIGH", pressure: "-30%", color: "tertiary", startX: '15%', startY: '50%', endX: '30%', endY: '50%' }
    ],
    fcmNotifications: [
      { id: 113, title: "Alert", text: "Gate B scanners experiencing technical issues. Please use Gate C for entry.", type: "tertiary" },
      { id: 114, title: "Info", text: "Mobile scanning teams have been deployed to speed up Gate B entry lanes.", type: "primary" }
    ],
    kanbanTasks: [
      { id: 216, priority: 'High', team: 'Mobile Scan Team', zone: 'Gate B', action: 'Deploy 4 handheld scanners to Gate B entry lanes.', status: 'Pending' },
      { id: 217, priority: 'High', team: 'IT Support', zone: 'Server Room', action: 'Resolve network routing switch issue at Gate B scanner cluster.', status: 'In Progress' },
      { id: 218, priority: 'Low', team: 'Volunteer Group C', zone: 'Gate B', action: 'Direct fans in queue towards Gate C bypass lane.', status: 'Done' }
    ],
    sectors: [
      { id: 'north_stand_upper', name: "North Stand - Upper Deck", fans: 10450, density: 55, risk: 'primary', staff: 15, details: "Normal entry flows scan perimeters. Standard load.", startAngle: 210, endAngle: 330, rIn: 190, rOut: 260 },
      { id: 'north_stand_lower', name: "North Stand - Lower Stand", fans: 8800, density: 45, risk: 'primary', staff: 10, details: "Calm progression. Food vendors operating steady queues.", startAngle: 210, endAngle: 330, rIn: 120, rOut: 190 },
      { id: 'west_stand_upper', name: "West Concourse Upper", fans: 16630, density: 94, risk: 'error', staff: 30, details: "CRITICAL QUEUE BACKLOG near Gate B entrance offline cluster.", startAngle: 150, endAngle: 210, rIn: 190, rOut: 260 },
      { id: 'west_stand_lower', name: "West Stand Lower", fans: 11120, density: 60, risk: 'primary', staff: 18, details: "Handheld scanner units deploy active. Easing lines.", startAngle: 150, endAngle: 210, rIn: 120, rOut: 190 },
      { id: 'south_stand_upper', name: "South Stand - Upper Deck", fans: 9000, density: 50, risk: 'primary', staff: 12, details: "Gate A receiving normal flow perimeters.", startAngle: 30, endAngle: 150, rIn: 190, rOut: 260 },
      { id: 'south_stand_lower', name: "South Stand - Lower Stand", fans: 10200, density: 52, risk: 'primary', staff: 13, details: "Calm progression staircase perimeters.", startAngle: 30, endAngle: 150, rIn: 120, rOut: 190 }
    ],
    analytics: {
      flowVelocity: [
        { time: "10m ago", entry: 580, exit: 90 },
        { time: "8m ago", entry: 490, exit: 100 },
        { time: "6m ago", entry: 360, exit: 110 },
        { time: "4m ago", entry: 290, exit: 120 },
        { time: "2m ago", entry: 220, exit: 140 },
        { time: "Current", entry: 180, exit: 150 }
      ],
      gateWaitTimes: [
        { gate: "Gate A", wait: 14 },
        { gate: "Gate B", wait: 45 },
        { gate: "Gate C", wait: 28 },
        { gate: "Gate D", wait: 9 },
        { gate: "Gate E", wait: 5 }
      ]
    }
  },
  exit_rush: {
    fans: 65000, capacity: 95, risk: 8, ai: 85, wait: 45,
    alertTitle: "POST-MATCH OUTFLOW",
    alertDesc: "Simultaneous egress from all stands. Transport hubs reaching critical mass.",
    recTitle: "EGRESS METERING",
    recDesc: "Pulse release Upper Tiers. Hold lower tier for 5 minutes. Direct flow to auxiliary transport points.",
    recConfidence: "85%",
    mapText: "SIM: EGRESS",
    nodes: [
      { id: 1, top: "50%", left: "15%", right: "auto", color: "error", label: "WEST EXIT: BOTTLENECK", hasRing: true },
      { id: 2, top: "80%", left: "50%", right: "auto", color: "error", label: "SOUTH EXIT: BOTTLENECK", hasRing: true }
    ],
    routes: [
      { id: 'route-14', from: "West Exit", to: "Metro Link", reason: "Metro Egress Congestion Easing", wait: "-15m", impact: "HIGH", pressure: "-25%", color: "error", startX: '15%', startY: '50%', endX: '50%', endY: '80%' }
    ],
    fcmNotifications: [
      { id: 115, title: "Exit Route", text: "Post-match exit is highly congested at West Exit. Use East Exit to Parking.", type: "primary" },
      { id: 116, title: "Alert", text: "Upper Tiers: exit gate release in progress. Lower Tiers: please hold 5 mins.", type: "tertiary" }
    ],
    kanbanTasks: [
      { id: 219, priority: 'Critical', team: 'Security Team Alpha', zone: 'West Gates', action: 'Implement flow metering gating system. Release in pulses.', status: 'In Progress' },
      { id: 220, priority: 'High', team: 'Volunteer Group A', zone: 'Concourse', action: 'Guide lower tier fans to concourse seating while exits clear.', status: 'Pending' },
      { id: 221, priority: 'Low', team: 'Transit Police', zone: 'Metro Plaza', action: 'Coordinate train arrivals with pulse egress gate releases.', status: 'Done' }
    ],
    sectors: [
      { id: 'north_stand_upper', name: "North Stand - Upper Deck", fans: 15000, density: 92, risk: 'error', staff: 32, details: "Upper tier pulse gating in progress. Extreme flow volume.", startAngle: 210, endAngle: 330, rIn: 190, rOut: 260 },
      { id: 'north_stand_lower', name: "North Stand - Lower Stand", fans: 13000, density: 88, risk: 'tertiary', staff: 25, details: "Directing fans down staircases toward West perimeter outlet.", startAngle: 210, endAngle: 330, rIn: 120, rOut: 190 },
      { id: 'west_stand_upper', name: "West Concourse Upper", fans: 16000, density: 95, risk: 'error', staff: 36, details: "CRITICAL BOTTLENECK. Main Metro Egress links saturated.", startAngle: 150, endAngle: 210, rIn: 190, rOut: 260 },
      { id: 'west_stand_lower', name: "West Stand Lower", fans: 14000, density: 90, risk: 'error', staff: 30, details: "Pulse gates active. Egress metered releases controlling density.", startAngle: 150, endAngle: 210, rIn: 120, rOut: 190 },
      { id: 'south_stand_upper', name: "South Stand - Upper Deck", fans: 12000, density: 80, risk: 'tertiary', staff: 20, details: "Shuttle and VIP parking flows proceeding steadily.", startAngle: 30, endAngle: 150, rIn: 190, rOut: 260 },
      { id: 'south_stand_lower', name: "South Stand - Lower Stand", fans: 13500, density: 85, risk: 'tertiary', staff: 24, details: "High egress volumes. Voluteers clearing hallways.", startAngle: 30, endAngle: 150, rIn: 120, rOut: 190 }
    ],
    analytics: {
      flowVelocity: [
        { time: "10m ago", entry: 20, exit: 950 },
        { time: "8m ago", entry: 10, exit: 1450 },
        { time: "6m ago", entry: 0, exit: 2100 },
        { time: "4m ago", entry: 0, exit: 2600 },
        { time: "2m ago", entry: 0, exit: 3100 },
        { time: "Current", entry: 0, exit: 3450 }
      ],
      gateWaitTimes: [
        { gate: "Gate A", wait: 45 },
        { gate: "Gate B", wait: 35 },
        { gate: "Gate C", wait: 42 },
        { gate: "Gate D", wait: 15 },
        { gate: "Gate E", wait: 12 }
      ]
    }
  }
};
