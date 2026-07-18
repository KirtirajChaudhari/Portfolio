export interface Poem {
  id: string;
  title: string;
  body: string;
  note?: string;
}

export const poetryCollectionTitle = "Collected Notebooks";

export const poems: Poem[] = [
  {
    id: "poem-1",
    title: "Placeholder One",
    body: "This is a placeholder poem.\nIt has lines and breaks.\nJust to test the page flipping,\nAnd check the layout makes.",
    note: "Nashik, 2026",
  },
  {
    id: "poem-2",
    title: "Placeholder Two",
    body: "Another placeholder,\nfor the second page.\nTesting the layout,\non this digital stage.",
  },
  {
    id: "poem-3",
    title: "Placeholder Three",
    body: "A third placeholder poem.\nTo ensure the dynamically sized array\nworks flawlessly without delay.",
    note: "For the tests",
  },
];
