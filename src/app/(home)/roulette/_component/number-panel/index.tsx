"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { ElementRef, Fragment, useRef } from "react";
import { useRoulette } from "../store";
import { RenderChips } from "./render-chips";
import "./style.css";

export const NumberPanel = observer(() => {
  const ref = useRef<ElementRef<"div">>(null);
  const {
    pad,
    pad2,
    chipItems,
    appendChipItems,
    undoChipItems,
    clearAllChipItems,
  } = useRoulette();
  return (
    <Fragment>
      <div className="flex gap-2 font-medium" ref={ref}>
        {/* Zero */}
        <div className="flex-shrink-0 w-1/6 sm:w-1/12">
          <RenderChips
            chips={chipItems}
            item={pad[0]}
            className="w-full h-full bg-green-500 text-white text-lg sm:text-xl md:text-2xl font-bold"
            onClick={() => appendChipItems(pad[0])}
          />
        </div>

        <div className="flex-grow flex flex-col gap-2">
          {/* Numbers 1-36 */}
          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-12 gap-1 sm:gap-2">
            {pad.slice(1).map((item, index) => (
              <RenderChips
                key={index}
                className={cn(
                  "aspect-square text-lg sm:text-xl md:text-2xl font-bold",
                  Number(item.value) % 2 === 0 ? "bg-[#1f2737]" : "bg-[#c72f40]"
                )}
                chips={chipItems}
                item={item}
                onClick={() => appendChipItems(item)}
              />
            ))}
          </div>

          {/* Special bets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
            {pad2.map((item, index) => (
              <RenderChips
                style={{ backgroundColor: item.color }}
                key={index}
                className={cn(
                  "h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg font-semibold",
                  item.color
                )}
                chips={chipItems}
                item={item}
                onClick={() => appendChipItems(item)}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-4 mt-2">
            <Button
              variant="ghost"
              className="w-1/3 sm:w-1/4 py-2 text-sm sm:text-base border-solid border-[#f6f6f6] border-[1px]"
              onClick={undoChipItems}
            >
              Undo
            </Button>
            <Button
              variant="ghost"
              className="w-1/3 sm:w-1/4 py-2 text-sm sm:text-base border-solid border-[#f6f6f6] border-[1px]"
              onClick={clearAllChipItems}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
});
