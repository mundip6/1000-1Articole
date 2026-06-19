import { Suspense } from "react";
import ContClient from "./ContClient";

export const dynamic = "force-dynamic";

export default function ContPage() {
  return (
    <Suspense>
      <ContClient />
    </Suspense>
  );
}
