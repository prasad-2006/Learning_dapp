import { WalletSelector } from "./WalletSelector";

export function Header() {
  return (
    <div className="flex gap-2 items-center flex-wrap">
      <WalletSelector />
    </div>
  );
}

export default Header;
