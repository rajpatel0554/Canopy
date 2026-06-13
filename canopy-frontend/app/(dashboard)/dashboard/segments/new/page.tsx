import React from "react";
import { auth } from "@/auth";
import CreateSegmentForm from "./create-form";

export default async function NewSegmentPage() {
  const session = await auth();
  const token = session?.user ? (session.user as any).token : undefined;

  return <CreateSegmentForm token={token} />;
}
