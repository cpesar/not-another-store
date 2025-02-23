import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { ShoppingBagIcon } from "@/public/images/shopping-bags";
import Menu from "./menu";
import CategoryDrawer from "./category-drawer";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <CategoryDrawer />
          <Link href="/" className="flex-start ml-4">
            <ShoppingBagIcon />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>

        <Menu />
      </div>
    </header>
  );
};

export default Header;
