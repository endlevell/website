export type TechStackGroup = {
  name: string;
  items: string[];
};

export const techStack: TechStackGroup[] = [
  {
    name: 'languages',
    items: ['C', 'C++', 'C#', 'Rust', 'Go', 'Python', 'JavaScript', 'TypeScript', 'Lua', 'Java', 'Kotlin'],
  },
  {
    name: 'systems',
    items: ['Arch Linux', 'Void Linux', 'Nix'],
  },
  {
    name: 'android',
    items: ['POCO F3', 'PixelOS A16 QPR2'],
  },
];
