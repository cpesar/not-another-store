"use client";
// import { APP_NAME } from "@/lib/constants";
// import Image from "next/image";
import { Button } from "@/components/ui/button";
// import { Logo } from "@/images/logo";
import { ShoppingBagIcon } from "@/public/images/shopping-bags";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <ShoppingBagIcon className="w-16 h-16" />
        <div className="p-6  rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold mb-4">Not Found</h1>
          <p className="text-destructive">Could not find requested page</p>
          <Button
            variant="outline"
            className="mt-4 ml-2 "
            onClick={() => (window.location.href = "/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
