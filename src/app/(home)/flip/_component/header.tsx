import { CoinFace } from "@/components/coin-face";
import { ConnectButton } from "@/components/connect-button";
import { InferSelectModel, schema } from "@/lib/db";

interface HeaderProps {
  lastTenOutcome: Array<
    Pick<InferSelectModel<typeof schema.transactionHistory>, "outcome">
  >;
  isLayout?: boolean;
}

export const Header = ({ lastTenOutcome, isLayout = false }: HeaderProps) => {
  return (
    <header className="flex place-items-start justify-between ">
      <div className="flex md:flex-row flex-col gap-4 items-center">
        <h3 className="text-m">Last 10 Results</h3>
        <div className="flex md:flex-row flex-col gap-2">
          {lastTenOutcome.map(({ outcome }, key) =>
            outcome === "HEAD" ? (
              <CoinFace.Head key={key} />
            ) : (
              <CoinFace.Tail key={key} />
            )
          )}
        </div>
      </div>

      {!isLayout && (
        <div className="flex gap-16">
          <ConnectButton />
        </div>
      )}
    </header>
  );
};
