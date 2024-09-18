"use client";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Menu } from "lucide-react";
import { X } from "lucide-react";
import { Header as FlipHeader } from "./flip/_component/header";
import { Header as RouletteHeader } from "./roulette/_component/header";
import { Sidenav } from "@/components/layout/sidenav";
import Footer from "@/components/layout/footer";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useParams, usePathname } from "next/navigation";
import { GameType, getAllTransaction } from "@/db/action";
import { TonConnectButton } from "@tonconnect/ui-react";
interface Props {
  children: React.ReactNode;
}

export default (props: Props) => {
  const pathName = usePathname().slice(1);
  const [history, setHistory] = useState<any>([]);
  const transactionHistory = async () => {
    const history = await getAllTransaction(pathName.toUpperCase() as GameType);

    setHistory(history);
  };

  useEffect(() => {
    transactionHistory();
  }, []);

  const renderHeader = () => {
    switch (pathName) {
      case "flip":
        return (
          <FlipHeader
            lastTenOutcome={history.map((o) => ({
              outcome: o.outcome,
            }))}
            isLayout={true}
          />
        );
      case "roulette":
        return (
          <RouletteHeader
            lastTenOutcome={history.map((o) => ({
              outcome: o.outcome,
            }))}
            isLayout={true}
          />
        );
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  return (
    <Fragment>
      <div className="flex flex-row  ">
        <div className="hidden md:flex">
          <Sidenav />
        </div>

        <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
          <DialogContent className="flex  border-none bg-shade">
            <Button
              variant="ghost"
              className=" flex md:hidden fixed right-0 z-10 p-4 hover:bg-trasparent"
              onClick={() => setIsOpen(false)}
            >
              {<X size={32} />}
            </Button>
            <div className="overflow-y-scroll h-screen no-scrollbar">
              <Sidenav />
              {renderHeader()}
            </div>
          </DialogContent>
        </Dialog>
        <TonConnectButton />
        <main className="w-full">
          {props.children}
          <Footer />
        </main>
        <Button
          variant="ghost"
          className=" flex md:hidden fixed right-0  z-10 py-8 hover:bg-trasparent"
          onClick={() => setIsOpen(!isOpen)}
        >
          {<Menu size={32} />}
        </Button>
      </div>
    </Fragment>
  );
};
