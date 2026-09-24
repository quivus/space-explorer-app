const shot = (file: string) => `https://upload.wikimedia.org/wikipedia/commons/${file}`;

export type PlanetSpec = { label: string; value: string };

export type SolarPlanet = {
  name: string;
  description: string;
  image: string;
  distance: string;
  specs: PlanetSpec[];
};

export const SOLAR_PLANETS: SolarPlanet[] = [
  {
    name: 'Mercury',
    description:
      '**Mercury** is the closest planet to the Sun and the smallest in the solar system. One day there lasts **59 Earth days**, longer than its year of **88 days**.\n\nIt keeps almost no atmosphere, so the surface stays a record of ancient impacts.',
    image: shot('4/4a/Mercury_in_true_color.jpg'),
    distance: '57.9 million km',
    specs: [
      { label: 'Diameter', value: '4,879 km' },
      { label: 'Moons', value: '0' },
      { label: 'Day', value: '59 Earth days' },
      { label: 'Type', value: 'Rock' },
      { label: 'Gravity', value: '3.7 m/s²' },
      { label: 'Year', value: '88 days' },
    ],
  },
  {
    name: 'Venus',
    description:
      '**Venus** is the second planet from the Sun and the hottest world in the solar system. A thick atmosphere traps the heat, and one day lasts **243 Earth days**.\n\nThat slow spin runs backward compared with most planets, so the Sun rises in the west.',
    image: shot('0/08/Venus_from_Mariner_10.jpg'),
    distance: '108.2 million km',
    specs: [
      { label: 'Diameter', value: '12,104 km' },
      { label: 'Moons', value: '0' },
      { label: 'Day', value: '243 Earth days' },
      { label: 'Type', value: 'Rock' },
      { label: 'Gravity', value: '8.9 m/s²' },
      { label: 'Year', value: '225 days' },
    ],
  },
  {
    name: 'Earth',
    description:
      '**Earth** is the third planet from the Sun and the only world currently known to support life. A day lasts **24 hours**, and a year lasts **365 days**.\n\nLiquid water, a breathable atmosphere, and one large moon set it apart from its neighbors.',
    image: shot('c/cb/The_Blue_Marble_%28remastered%29.jpg'),
    distance: '149.6 million km',
    specs: [
      { label: 'Diameter', value: '12,742 km' },
      { label: 'Moons', value: '1' },
      { label: 'Day', value: '24 hours' },
      { label: 'Type', value: 'Rock' },
      { label: 'Gravity', value: '9.8 m/s²' },
      { label: 'Year', value: '365 days' },
    ],
  },
  {
    name: 'Mars',
    description:
      '**Mars** is the fourth planet from the Sun, known as the *Red Planet* because iron oxide colors its surface. A day lasts **24.6 hours**, close to a day on Earth.\n\nTwo small moons, *Phobos* and *Deimos*, orbit a cold desert marked by old volcanoes and dry riverbeds.',
    image: shot('0/02/OSIRIS_Mars_true_color.jpg'),
    distance: '227.9 million km',
    specs: [
      { label: 'Diameter', value: '6,779 km' },
      { label: 'Moons', value: '2' },
      { label: 'Day', value: '24.6 hours' },
      { label: 'Type', value: 'Rock' },
      { label: 'Gravity', value: '3.7 m/s²' },
      { label: 'Year', value: '687 days' },
    ],
  },
  {
    name: 'Jupiter',
    description:
      '**Jupiter** is the fifth planet from the Sun and the largest planet in the solar system. A day lasts about **10 hours**, the shortest of the eight planets.\n\nThe *Great Red Spot* is a storm wider than Earth, and **95 moons** travel with the planet.',
    image: shot('2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg'),
    distance: '778 million km',
    specs: [
      { label: 'Diameter', value: '139,820 km' },
      { label: 'Moons', value: '95' },
      { label: 'Day', value: '10 hours' },
      { label: 'Type', value: 'Gas' },
      { label: 'Gravity', value: '24.8 m/s²' },
      { label: 'Year', value: '12 years' },
    ],
  },
  {
    name: 'Saturn',
    description:
      '**Saturn** is the sixth planet from the Sun, known for a broad system of icy rings. Those rings are thin sheets of ice and rock, bright enough to define the planet at a glance.\n\nA day lasts **10.7 hours**, and **146 moons** share the space beyond the rings.',
    image: shot('c/c7/Saturn_during_Equinox.jpg'),
    distance: '1.4 billion km',
    specs: [
      { label: 'Diameter', value: '116,460 km' },
      { label: 'Moons', value: '146' },
      { label: 'Day', value: '10.7 hours' },
      { label: 'Type', value: 'Gas' },
      { label: 'Gravity', value: '10.4 m/s²' },
      { label: 'Year', value: '29 years' },
    ],
  },
  {
    name: 'Uranus',
    description:
      '**Uranus** is the seventh planet from the Sun, an *ice giant* that rotates on its side. That tilt leaves one pole in sunlight for decades at a time.\n\nA day lasts **17 hours**, and a year lasts **84 years**.',
    image: shot('3/3d/Uranus2.jpg'),
    distance: '2.9 billion km',
    specs: [
      { label: 'Diameter', value: '50,724 km' },
      { label: 'Moons', value: '28' },
      { label: 'Day', value: '17 hours' },
      { label: 'Type', value: 'Ice' },
      { label: 'Gravity', value: '8.9 m/s²' },
      { label: 'Year', value: '84 years' },
    ],
  },
  {
    name: 'Neptune',
    description:
      '**Neptune** is the eighth planet from the Sun, known for a deep blue color and stormy winds. It is the farthest of the eight planets.\n\nA day lasts **16 hours**, and one year takes **165 years**.',
    image: shot('6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg'),
    distance: '4.5 billion km',
    specs: [
      { label: 'Diameter', value: '49,244 km' },
      { label: 'Moons', value: '16' },
      { label: 'Day', value: '16 hours' },
      { label: 'Type', value: 'Ice' },
      { label: 'Gravity', value: '11.2 m/s²' },
      { label: 'Year', value: '165 years' },
    ],
  },
];

export function planetByName(name: string): SolarPlanet | undefined {
  return SOLAR_PLANETS.find((planet) => planet.name.toLowerCase() === name.toLowerCase());
}
