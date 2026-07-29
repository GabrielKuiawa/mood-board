const placeholderColors = [
  "#124873",
  "#8f433b",
  "#aa9b8e",
  "#210a0f",
  "#590d0e",
  "#332b25",
  "#a91d15",
  "#494846",
  "#c3b5a9",
];

export function getPinPlaceholderColor(index: number): string {
  return placeholderColors[index % placeholderColors.length];
}
