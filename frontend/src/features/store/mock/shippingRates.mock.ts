export interface AreaRate {
  area: string;
  fee: number;
}

export interface StateRate {
  state: string;
  areas: AreaRate[];
}

/** Mock shipping rates. Replace with API call when backend is ready. */
export const MOCK_SHIPPING_RATES: StateRate[] = [
  {
    state: 'Lagos',
    areas: [
      { area: 'Ikeja', fee: 2000 },
      { area: 'Victoria Island', fee: 3000 },
      { area: 'Lekki', fee: 3500 },
      { area: 'Surulere', fee: 2500 },
      { area: 'Yaba', fee: 2000 },
      { area: 'Ajah', fee: 4000 },
    ],
  },
  {
    state: 'Abuja (FCT)',
    areas: [
      { area: 'Wuse', fee: 3000 },
      { area: 'Garki', fee: 3000 },
      { area: 'Gwarinpa', fee: 3500 },
      { area: 'Maitama', fee: 3500 },
      { area: 'Asokoro', fee: 3500 },
    ],
  },
  {
    state: 'Rivers',
    areas: [
      { area: 'Port Harcourt GRA', fee: 4000 },
      { area: 'Rumuola', fee: 4500 },
      { area: 'Rumuigbo', fee: 4500 },
    ],
  },
  {
    state: 'Imo',
    areas: [
      { area: 'Owerri Municipal', fee: 4000 },
      { area: 'Owerri North', fee: 4500 },
      { area: 'Orlu', fee: 5000 },
    ],
  },
  {
    state: 'Anambra',
    areas: [
      { area: 'Awka', fee: 4500 },
      { area: 'Onitsha', fee: 4500 },
      { area: 'Nnewi', fee: 5000 },
    ],
  },
  {
    state: 'Oyo',
    areas: [
      { area: 'Ibadan North', fee: 3500 },
      { area: 'Ibadan South', fee: 3500 },
      { area: 'Ogbomoso', fee: 4500 },
    ],
  },
  {
    state: 'Kano',
    areas: [
      { area: 'Kano Municipal', fee: 5000 },
      { area: 'Nasarawa', fee: 5000 },
    ],
  },
  {
    state: 'Enugu',
    areas: [
      { area: 'Enugu North', fee: 4500 },
      { area: 'Enugu South', fee: 4500 },
    ],
  },
];

/** Lookup fee for a state + area combo. Returns 0 if not found. */
export function getShippingFee(state: string, area: string): number {
  const stateRate = MOCK_SHIPPING_RATES.find((s) => s.state === state);
  if (!stateRate) return 0;
  const areaRate = stateRate.areas.find((a) => a.area === area);
  return areaRate?.fee ?? 0;
}