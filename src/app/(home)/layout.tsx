import React, { Fragment } from "react";
import { Sidenav } from "@/components/layout/sidenav";
import Footer from "@/components/layout/footer";
import MainLayout from "@/components/layout/MainLayout";
interface Props {
  children: React.ReactNode;
}

export default (props: Props) => {
  return (
    <Fragment>
      <div className="flex flex-row  ">
        <Sidenav />
        <main className="w-full">
          {props.children}
          <Footer />
        </main>
      </div>
    </Fragment>
  );
};
