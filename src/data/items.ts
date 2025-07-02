import { Item } from '../types/Item';

export const items: Item[] = [
{
  id: '1',
  name: 'Scarf',
  value: 13,
  demand: 5,
  rateOfChange: 'Rising',
  prestige: 2,
  status: 'Obtainable',
  obtainedFrom: 'Obtained as a drop from the Attack Titan Raid Raids ',
  gemTax: 0,
  goldTax: 500000,
  category: 'Artifact',
  rarity: null,
  emoji: '/scarf.png'
},
{
  id: '2',
  name: 'Armour Serum',
  demand: 5,
  value: 15,
  rateOfChange: 'Stable',
  gemTax: 5000,
  goldTax: 0,
  prestige: 3,
  status: 'Obtainable',
  obtainedFrom: 'Obtained as a drop from the Armored Titan Raid',
  category: 'Raid Drop',
  rarity: null,
  emoji: '/armourserum.png'
},
];