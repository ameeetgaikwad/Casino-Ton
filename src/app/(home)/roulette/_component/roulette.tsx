"use client";
import { StatusDialog, statusDialogRef } from "@/components/status-dialog";
import React, { Fragment } from "react";
import { Form } from "./form";

export const Roulette = () => {
  return (
    <Fragment>
      <Form />
      <StatusDialog ref={statusDialogRef} />
    </Fragment>
  );
};
