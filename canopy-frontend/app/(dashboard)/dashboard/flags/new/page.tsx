import React from "react";
import { auth } from "@/auth";
import CreateFlagForm from "./create-form";

export default async function NewFlagPage() {
  const session = await auth();
  const token = session?.user ? (session.user as any).token : undefined;

  return <CreateFlagForm token={token} />;
}
