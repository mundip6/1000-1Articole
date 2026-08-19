import { getSettings, SETTINGS_KEYS } from "@/lib/settings";
import Footer from "./Footer";

export default async function FooterServer() {
  const settings = await getSettings([
    SETTINGS_KEYS.MIN_ORDER_BAIA_MARE,
    SETTINGS_KEYS.MIN_ORDER_OTHER,
    SETTINGS_KEYS.SHIPPING_FEE_BAIA_MARE,
    SETTINGS_KEYS.SHIPPING_FEE_OTHER,
  ]);
  return (
    <Footer
      minBM={settings[SETTINGS_KEYS.MIN_ORDER_BAIA_MARE]}
      minOther={settings[SETTINGS_KEYS.MIN_ORDER_OTHER]}
      feeBM={settings[SETTINGS_KEYS.SHIPPING_FEE_BAIA_MARE]}
      feeOther={settings[SETTINGS_KEYS.SHIPPING_FEE_OTHER]}
    />
  );
}
