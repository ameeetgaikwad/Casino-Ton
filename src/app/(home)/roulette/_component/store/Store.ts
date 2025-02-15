import { ethers } from "ethers";
import { makeAutoObservable } from "mobx";
import { Pad, pad, pad2 } from "./pad";
const CHIP_CONFIG = ['1', '5', '10', '20', '100'] as const;
export type ChipType = (typeof CHIP_CONFIG)[number];
export class Store {
  chip = CHIP_CONFIG;
  pad = pad
  pad2 = pad2
  selectedChip: ChipType = '1'
  chipItems: Array<Pad & { chipValue: string }> = []

  constructor() {
    makeAutoObservable(this);
  }


  updateSelectedChip = (chip: ChipType) => {
    this.selectedChip = chip;
  }


  appendChipItems = (items: Pad) => {
    this.chipItems = [...this.chipItems, { ...items, chipValue: this.selectedChip }]
  }


  undoChipItems = () => {
    this.chipItems = this.chipItems.filter((_, index) => index !== this.chipItems.length - 1);
  }
  clearAllChipItems = () => {
    this.chipItems = []
  }


  getImage = (chip: string) => {
    return chip === '0.001'
      ? '/assets/imgs/roulette/wager-1.png'
      : chip === '0.005'
        ? '/assets/imgs/roulette/wager-2.png'
        : chip === '0.010'
          ? '/assets/imgs/roulette/wager-3.png'
          : chip === '0.020'
            ? '/assets/imgs/roulette/wager-4.png'
            : '/assets/imgs/roulette/wager-5.png'
  }

  get result() {
    const guess = this.chipItems.map(item => item.value);
    const guessType = this.chipItems.map(item => item.type);
    const amount = this.chipItems.map(item => Number(item.chipValue));
    return { guess, amount, guessType }
  }

  get totalWager() {
    return this.chipItems.reduce((p, c) => p + Number(c.chipValue), 0)
  }
}

