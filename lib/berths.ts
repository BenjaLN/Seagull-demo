/**
 * Mock berth data for Rungsted Havn
 * Generates berths along each pier with realistic coordinates
 */

export type Pier = "Bro 3" | "Bro 5" | "Bro 7" | "Bro 9" | "Bro 11" | "Bro 4" | "Bro 6" | "Bro 8"
export type BerthStatus = "available" | "booked" | "occupied"

export interface Booking {
  id: string
  spot_id: string
  guest_name: string
  guest_phone: string
  start_at: string
  end_at: string
  status: 'reserved' | 'checked_in' | 'checked_out' | 'cancelled' | 'booked'
  payment_status: 'paid' | 'pending' | 'failed' | 'refunded'
  amount: number
  created_at: string
  updated_at: string
  boat_name?: string
  boat_length?: number
  boat_width?: number
}

export interface Berth {
  id: string
  pier: Pier
  lat: number
  lng: number
  status: BerthStatus
  endDate?: string // Optional end date for manual bookings
}

// Pier configurations with approximate positions relative to harbor center
const PIER_CONFIGS: Record<Pier, { 
  startLat: number, 
  startLng: number, 
  endLat: number, 
  endLng: number, 
  berthCount: number 
}> = {
  "Bro 3": { 
    startLat: 55.8845, startLng: 12.5445, 
    endLat: 55.8845, endLng: 12.5465, 
    berthCount: 10 
  },
  "Bro 5": { 
    startLat: 55.8848, startLng: 12.5442, 
    endLat: 55.8848, endLng: 12.5468, 
    berthCount: 12 
  },
  "Bro 7": { 
    startLat: 55.8851, startLng: 12.5440, 
    endLat: 55.8851, endLng: 12.5470, 
    berthCount: 12 
  },
  "Bro 9": { 
    startLat: 55.8854, startLng: 12.5438, 
    endLat: 55.8854, endLng: 12.5472, 
    berthCount: 10 
  },
  "Bro 11": { 
    startLat: 55.8857, startLng: 12.5435, 
    endLat: 55.8857, endLng: 12.5475, 
    berthCount: 8 
  },
  "Bro 4": { 
    startLat: 55.8842, startLng: 12.5450, 
    endLat: 55.8842, endLng: 12.5460, 
    berthCount: 8 
  },
  "Bro 6": { 
    startLat: 55.8845, startLng: 12.5448, 
    endLat: 55.8845, endLng: 12.5462, 
    berthCount: 10 
  },
  "Bro 8": { 
    startLat: 55.8848, startLng: 12.5445, 
    endLat: 55.8848, endLng: 12.5465, 
    berthCount: 9 
  }
}

/**
 * Generate berths along a pier line
 */
function generateBerthsForPier(pier: Pier): Berth[] {
  const config = PIER_CONFIGS[pier]
  const berths: Berth[] = []
  
  for (let i = 0; i < config.berthCount; i++) {
    const ratio = i / (config.berthCount - 1)
    
    // Interpolate position along the pier
    const lat = config.startLat + (config.endLat - config.startLat) * ratio
    const lng = config.startLng + (config.endLng - config.startLng) * ratio
    
    // Add some random variation to make it look more natural
    const latVariation = (Math.random() - 0.5) * 0.0001
    const lngVariation = (Math.random() - 0.5) * 0.0001
    
    berths.push({
      id: `${pier}-${i + 1}`,
      pier,
      lat: lat + latVariation,
      lng: lng + lngVariation,
      status: Math.random() > 0.3 ? "available" : "occupied" // 70% available by default
    })
  }
  
  return berths
}

/**
 * Generate all berths for all piers
 */
export function generateAllBerths(): Berth[] {
  // Only include Bro 4 berths and filter for Bro 4-2 specifically
  const bro4Berths = generateBerthsForPier("Bro 4")
  const bro4_2 = bro4Berths.find(berth => berth.id === "B4-02")
  
  // Add specific berth at coordinates 55°53'03.7"N 12°32'42.1"E
  // Converted to decimal: 55.884361, 12.545028
  const specificBerth1: Berth = {
    id: "9",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.884361,
    lng: 12.545028,
    status: "available"
  }
  
  // Add specific berth at coordinates 55°53'03.6"N 12°32'41.4"E
  // Converted to decimal: 55.884333, 12.544833
  const specificBerth2: Berth = {
    id: "1",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.884333,
    lng: 12.544833,
    status: "available"
  }
  
  // Add specific berth at coordinates 55°53'03.4"N 12°32'42.3"E
  // Converted to decimal: 55.884278, 12.545083
  const specificBerth3: Berth = {
    id: "GAMMA",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.884278,
    lng: 12.545083,
    status: "available"
  }
  
  // Add specific berth at coordinates 55°53'03.3"N 12°32'41.6"E
  // Converted to decimal: 55.884250, 12.544889
  const specificBerth4: Berth = {
    id: "DELTA",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.884250,
    lng: 12.544889,
    status: "available"
  }
  
  // Add specific berth at coordinates 55°52'59.8"N 12°32'43.7"E
  // Converted to decimal: 55.883278, 12.545472
  const specificBerth5: Berth = {
    id: "EPSILON",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.883278,
    lng: 12.545472,
    status: "available"
  }
  
  // Add specific berth at coordinates 55°52'59.9"N 12°32'44.4"E
  // Converted to decimal: 55.883306, 12.545667
  const specificBerth6: Berth = {
    id: "ZETA",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.883306,
    lng: 12.545667,
    status: "available"
  }
  
  // Add specific berth at coordinates 55°53'04.0"N 12°32'43.9"E
  // Converted to decimal: 55.884444, 12.545528
  const specificBerth7: Berth = {
    id: "ETA",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.884444,
    lng: 12.545528,
    status: "available"
  }
  
  // Add specific berth at coordinates 55°53'00.3"N 12°32'46.2"E
  // Converted to decimal: 55.883417, 12.546167
  const specificBerth8: Berth = {
    id: "THETA",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.883417,
    lng: 12.546167,
    status: "available"
  }
  
  // Add specific berth at coordinates 55°53'04.2"N 12°32'44.8"E
  // Converted to decimal: 55.884500, 12.545778
  const specificBerth9: Berth = {
    id: "IOTA",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.884500,
    lng: 12.545778,
    status: "available"
  }
  
  // Add specific berth at coordinates 55°53'00.5"N 12°32'47.1"E
  // Converted to decimal: 55.883472, 12.546417
  const specificBerth10: Berth = {
    id: "KAPPA",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.883472,
    lng: 12.546417,
    status: "available"
  }
  
  // Add specific berth at coordinates 55°53'00.9"N 12°32'48.9"E
  // Converted to decimal: 55.883583, 12.546917
  const specificBerth11: Berth = {
    id: "LAMBDA",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.883583,
    lng: 12.546917,
    status: "available"
  }
  
  // Add specific berth at coordinates 55°53'04.8"N 12°32'46.3"E
  // Converted to decimal: 55.884667, 12.546194
  const specificBerth12: Berth = {
    id: "MU",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.884667,
    lng: 12.546194,
    status: "available"
  }
  
  // Add specific berth at coordinates 55°53'05.0"N 12°32'47.2"E
  // Converted to decimal: 55.884722, 12.546444
  const specificBerth13: Berth = {
    id: "NU",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.884722,
    lng: 12.546444,
    status: "available"
  }
  
  
  // Add specific berth at coordinates 55.883633, 12.547140
  const specificBerth18: Berth = {
    id: "XI",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.883633,
    lng: 12.547140,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.883710, 12.547644
  const specificBerth19: Berth = {
    id: "OMICRON",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.883710,
    lng: 12.547644,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.884808, 12.546966
  const specificBerth20: Berth = {
    id: "PI",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.884808,
    lng: 12.546966,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.883748, 12.547869
  const specificBerth21: Berth = {
    id: "RHO",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.883748,
    lng: 12.547869,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.884846, 12.547185
  const specificBerth22: Berth = {
    id: "SIGMA",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.884846,
    lng: 12.547185,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.884161, 12.548340
  const specificBerth23: Berth = {
    id: "TAU",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.884161,
    lng: 12.548340,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.884197, 12.548555
  const specificBerth24: Berth = {
    id: "UPSILON",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.884197,
    lng: 12.548555,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.885042, 12.547743
  const specificBerth25: Berth = {
    id: "PHI",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.885042,
    lng: 12.547743,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.885088, 12.548009
  const specificBerth26: Berth = {
    id: "CHI",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.885088,
    lng: 12.548009,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.886164, 12.545059
  const specificBerth27: Berth = {
    id: "PSI",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.886164,
    lng: 12.545059,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.886162, 12.545248
  const specificBerth28: Berth = {
    id: "OMEGA",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.886162,
    lng: 12.545248,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.886735, 12.545032
  const specificBerth29: Berth = {
    id: "ALPHA2",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.886735,
    lng: 12.545032,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.886737, 12.545273
  const specificBerth30: Berth = {
    id: "BETA2",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.886737,
    lng: 12.545273,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.886156, 12.545774
  const specificBerth31: Berth = {
    id: "GAMMA2",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.886156,
    lng: 12.545774,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.886151, 12.545965
  const specificBerth32: Berth = {
    id: "DELTA2",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.886151,
    lng: 12.545965,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.886730, 12.545758
  const specificBerth33: Berth = {
    id: "EPSILON2",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.886730,
    lng: 12.545758,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.886728, 12.545963
  const specificBerth34: Berth = {
    id: "ZETA2",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.886728,
    lng: 12.545963,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.886158, 12.546477
  const specificBerth35: Berth = {
    id: "ETA2",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.886158,
    lng: 12.546477,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.886389, 12.546692
  const specificBerth36: Berth = {
    id: "THETA2",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.886389,
    lng: 12.546692,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.886594, 12.546483
  const specificBerth37: Berth = {
    id: "IOTA2",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.886594,
    lng: 12.546483,
    status: "available"
  }
  
  // Add specific berth at coordinates 55.886595, 12.546692
  const specificBerth38: Berth = {
    id: "KAPPA2",
    pier: "Bro 3", // Assign to Bro 3 for organization
    lat: 55.886595,
    lng: 12.546692,
    status: "available"
  }
  
  
  // Generate evenly spaced dots between two points
  // Each berth gets a unique sequential ID and individual status
  const generateLineBerths = (startLat: number, startLng: number, endLat: number, endLng: number, numBerths: number, startNumber: number, reverse: boolean = false, pier: Pier = "Bro 3"): Berth[] => {
    const berths: Berth[] = []
    const latStep = (endLat - startLat) / (numBerths - 1)
    const lngStep = (endLng - startLng) / (numBerths - 1)
    
    for (let i = 0; i < numBerths; i++) {
      const lat = startLat + (latStep * i)
      const lng = startLng + (lngStep * i)
      const berthNumber = reverse ? startNumber - i : startNumber + i
      berths.push({
        id: `${berthNumber}`,
        pier: pier,
        lat: lat,
        lng: lng,
        status: "available"
      })
    }
    return berths
  }
  
  // Generate line berths between DELTA and EPSILON
  const lineBerths = generateLineBerths(
    55.884250, 12.544889, // DELTA
    55.883278, 12.545472, // EPSILON
    7, // 7 berths total (2-8)
    2 // Starting number for this line (2-8)
  )
  
  // Generate line berths between GAMMA and ZETA
  // Using the same spacing as between GAMMA and BETA (0.000083 lat, 0.000055 lng)
  const lineBerths2 = generateLineBerths(
    55.884278, 12.545083, // GAMMA
    55.883306, 12.545667, // ZETA
    8, // 8 berths total (including start and end points)
    10 // Starting number for this line (10-17)
  )
  
  // Generate line berths between ETA and THETA
  // Using the same spacing as between GAMMA and BETA (0.000083 lat, 0.000055 lng)
  const lineBerths3 = generateLineBerths(
    55.884444, 12.545528, // ETA
    55.883417, 12.546167, // THETA
    8, // 8 berths total (including start and end points)
    18, // Starting number for this line (18-25)
    false, // Forward numbering
    "Bro 5" // Assign to Bro 5
  )
  
  // Generate line berths between IOTA and KAPPA
  // Using the same spacing as between GAMMA and BETA (0.000083 lat, 0.000055 lng)
  const lineBerths4 = generateLineBerths(
    55.884500, 12.545778, // IOTA
    55.883472, 12.546417, // KAPPA
    8, // 8 berths total (including start and end points)
    26, // Starting number for this line (26-33)
    false, // Forward numbering
    "Bro 5" // Assign to Bro 5
  )
  
  // Generate line berths between MU and LAMBDA
  // Using the same spacing as between GAMMA and BETA (0.000083 lat, 0.000055 lng)
  const lineBerths5 = generateLineBerths(
    55.884667, 12.546194, // MU
    55.883583, 12.546917, // LAMBDA
    8, // 8 berths total (including start and end points)
    34, // Starting number for this line (34-41)
    false, // Forward numbering
    "Bro 7" // Assign to Bro 7
  )
  
  // Generate line berths between NU and XI
  // Using the same spacing as between GAMMA and BETA (0.000083 lat, 0.000055 lng)
  const lineBerths6 = generateLineBerths(
    55.884722, 12.546444, // NU
    55.883633, 12.547140, // XI
    8, // 8 berths total (including start and end points)
    42, // Starting number for this line (42-49)
    false, // Forward numbering
    "Bro 7" // Assign to Bro 7
  )
  
  // Generate line berths between PI and OMICRON
  // Using the same spacing as between GAMMA and BETA (0.000083 lat, 0.000055 lng)
  const lineBerths7 = generateLineBerths(
    55.884808, 12.546966, // PI
    55.883710, 12.547644, // OMICRON
    8, // 8 berths total (including start and end points)
    50, // Starting number for this line (50-57)
    false, // Forward numbering
    "Bro 9" // Assign to Bro 9
  )
  
  // Generate line berths between SIGMA and RHO
  // Using the same spacing as between GAMMA and BETA (0.000083 lat, 0.000055 lng)
  const lineBerths8 = generateLineBerths(
    55.884846, 12.547185, // SIGMA
    55.883748, 12.547869, // RHO
    8, // 8 berths total (including start and end points)
    58, // Starting number for this line (58-65)
    false, // Forward numbering
    "Bro 9" // Assign to Bro 9
  )
  
  // Generate line berths between TAU and PHI
  // Using the same spacing as between GAMMA and BETA (0.000083 lat, 0.000055 lng)
  const lineBerths9 = generateLineBerths(
    55.884161, 12.548340, // TAU
    55.885042, 12.547743, // PHI
    8, // 8 berths total (including start and end points)
    73, // Starting number for this line (73-66, reversed)
    true, // Reverse numbering
    "Bro 11" // Assign to Bro 11
  )
  
  // Generate line berths between CHI and UPSILON
  // Using the same spacing as between GAMMA and BETA (0.000083 lat, 0.000055 lng)
  const lineBerths10 = generateLineBerths(
    55.885088, 12.548009, // CHI
    55.884197, 12.548555, // UPSILON
    8, // 8 berths total (including start and end points)
    74, // Starting number for this line (74-81, forward)
    false, // Forward numbering
    "Bro 11" // Assign to Bro 11
  )
  
  // Generate line berths between PSI and ALPHA2
  // Using the same spacing as between GAMMA and BETA (0.000083 lat, 0.000055 lng)
  const lineBerths11 = generateLineBerths(
    55.886164, 12.545059, // PSI
    55.886735, 12.545032, // ALPHA2
    8, // 8 berths total (including start and end points)
    82, // Starting number for this line (82-89, forward)
    false, // Forward numbering
    "Bro 4" // Assign to Bro 4
  )
  
  // Generate line berths between OMEGA and BETA2
  // Using the same spacing as between GAMMA and BETA (0.000083 lat, 0.000055 lng)
  const lineBerths12 = generateLineBerths(
    55.886162, 12.545248, // OMEGA
    55.886737, 12.545273, // BETA2
    8, // 8 berths total (including start and end points)
    90, // Starting number for this line (90-97, forward)
    false, // Forward numbering
    "Bro 4" // Assign to Bro 4
  )
  
  // Generate line berths between EPSILON2 and GAMMA2
  // Using the same spacing as between GAMMA and BETA (0.000083 lat, 0.000055 lng)
  const lineBerths13 = generateLineBerths(
    55.886730, 12.545758, // EPSILON2
    55.886156, 12.545774, // GAMMA2
    8, // 8 berths total (including start and end points)
    105, // Starting number for this line (105-98, reversed)
    true, // Reverse numbering
    "Bro 6" // Assign to Bro 6
  )
  
  // Generate line berths between DELTA2 and ZETA2
  // Using the same spacing as between GAMMA and BETA (0.000083 lat, 0.000055 lng)
  const lineBerths14 = generateLineBerths(
    55.886151, 12.545965, // DELTA2
    55.886728, 12.545963, // ZETA2
    8, // 8 berths total (including start and end points)
    106, // Starting number for this line (106-113, forward)
    false, // Forward numbering
    "Bro 6" // Assign to Bro 6
  )
  
  // Generate line berths between ETA2 and IOTA2
  // Using the same spacing as between GAMMA and BETA (0.000083 lat, 0.000055 lng)
  const lineBerths15 = generateLineBerths(
    55.886158, 12.546477, // ETA2
    55.886594, 12.546483, // IOTA2
    8, // 8 berths total (including start and end points)
    114, // Starting number for this line (114-121, forward)
    false, // Forward numbering
    "Bro 8" // Assign to Bro 8
  )
  
  // Generate line berths between THETA2 and KAPPA2
  // Using half the number of dots (4 total) with equal spacing
  const lineBerths16 = generateLineBerths(
    55.886389, 12.546692, // THETA2
    55.886595, 12.546692, // KAPPA2
    4, // 4 berths total (including start and end points)
    122, // Starting number for this line (122-125, forward)
    false, // Forward numbering
    "Bro 8" // Assign to Bro 8
  )
  
  // Return all berths: special berths + line berths + Bro 4-2
  const result = [specificBerth1, specificBerth2, specificBerth3, specificBerth4, specificBerth5, specificBerth6, specificBerth7, specificBerth8, specificBerth9, specificBerth10, specificBerth11, specificBerth12, specificBerth13, specificBerth18, specificBerth19, specificBerth20, specificBerth21, specificBerth22, specificBerth23, specificBerth24, specificBerth25, specificBerth26, specificBerth27, specificBerth28, specificBerth29, specificBerth30, specificBerth31, specificBerth32, specificBerth33, specificBerth34, specificBerth35, specificBerth36, specificBerth37, specificBerth38, ...lineBerths, ...lineBerths2, ...lineBerths3, ...lineBerths4, ...lineBerths5, ...lineBerths6, ...lineBerths7, ...lineBerths8, ...lineBerths9, ...lineBerths10, ...lineBerths11, ...lineBerths12, ...lineBerths13, ...lineBerths14, ...lineBerths15, ...lineBerths16]
  if (bro4_2) {
    result.push(bro4_2)
  }
  
  return result
}

/**
 * Get all unique piers
 */
export function getAllPiers(): Pier[] {
  return ["Bro 3", "Bro 5", "Bro 7", "Bro 9", "Bro 11", "Bro 4", "Bro 6", "Bro 8"]
}

/**
 * Filter berths by pier
 */
export function filterBerthsByPier(berths: Berth[], pier: Pier | "all"): Berth[] {
  if (pier === "all") return berths
  return berths.filter(berth => berth.pier === pier)
}

/**
 * Apply booking reservations to berths
 * This function takes a list of bookings and applies their status to the corresponding berths
 */
export function applyBookingReservations(berths: Berth[], bookings: Booking[]): Berth[] {
  const now = new Date()
  
  return berths.map(berth => {
    // Find bookings for this berth
    const berthBookings = bookings.filter(booking => booking.spot_id === berth.id)
    
    if (berthBookings.length === 0) {
      return berth // No bookings, keep original status
    }
    
    // Check for any active bookings (reserved or booked and within date range)
    const activeBooking = berthBookings.find(booking => {
      const startDate = new Date(booking.start_at)
      const endDate = new Date(booking.end_at)
      // Set time to start of day for proper date comparison
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      const nowDate = new Date(now)
      nowDate.setHours(0, 0, 0, 0)
      
      // Check if booking is active (reserved or booked) and within date range
      return (booking.status === 'reserved' || booking.status === 'booked') && 
             nowDate >= startDate && nowDate <= endDate
    })
    
    if (activeBooking) {
      return { ...berth, status: 'booked' as BerthStatus, endDate: activeBooking.end_at }
    }
    
    // Default to available if no active bookings
    return { ...berth, status: 'available' as BerthStatus }
  })
}

/**
 * Search berths by ID
 */
export function searchBerths(berths: Berth[], query: string): Berth[] {
  if (!query.trim()) return berths
  return berths.filter(berth => 
    berth.id.toLowerCase().includes(query.toLowerCase())
  )
}
