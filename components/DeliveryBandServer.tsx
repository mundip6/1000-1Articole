import { getSettings, SETTINGS_KEYS } from "@/lib/settings";
import DeliveryBand from "./DeliveryBand";

export default async function DeliveryBandServer() {
  const settings = await getSettings([
    SETTINGS_KEYS.MIN_ORDER_BAIA_MARE,
    SETTINGS_KEYS.MIN_ORDER_OTHER,
  ]);
  return (
    <DeliveryBand
      minBM={settings[SETTINGS_KEYS.MIN_ORDER_BAIA_MARE]}
      minOther={settings[SETTINGS_KEYS.MIN_ORDER_OTHER]}
    />
  );
}
