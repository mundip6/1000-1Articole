"use client";

import { useEffect } from "react";
import { sendMetaEvent } from "@/lib/meta/send";

export function ProductTracking({
  sku,
  name,
  price,
  category,
}: {
  sku: string;
  name: string;
  price: number;
  category: string;
}) {
  useEffect(() => {
    void sendMetaEvent("ViewContent", {
      content_ids: [sku],
      content_name: name,
      content_category: category,
      content_type: "product",
      value: price,
      currency: "RON",
    });
  }, [sku, name, price, category]);

  return null;
}
