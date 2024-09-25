import { CoinFace } from "@/components/coin-face";

import { CustomConnectButton } from "@/components/CustomConnectButton";
// import { InferSelectModel, schema } from "@/db";
import { TonConnectButton } from "@tonconnect/ui-react";
// interface HeaderProps {
//   lastTenOutcome: Array<Pick<InferSelectModel<typeof schema.transactionHistory>, "outcome">>;
// }

export const Header = () => {
  return (
    <header className="flex place-items-start justify-between ">
      <div className="hidden md:flex  gap-4 items-center">
        {/* <h3 className="text-m">Last 10 Results</h3>
        <div className="flex gap-2">
          {lastTenOutcome.map(({ outcome }, key) =>
            outcome === "HEAD" ? <CoinFace.Head key={key} /> : <CoinFace.Tail key={key} />
          )}
        </div> */}
      </div>

      <div className="flex gap-16">
        <CustomConnectButton />
      </div>
    </header>
  );
};
