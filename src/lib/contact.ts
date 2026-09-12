/**
 * Contact numbers, single source of truth.
 *
 * `tel` and `wa` MUST stay in international format with no leading zero.
 * A `0317...` or local-format wa.me link silently fails for every foreign
 * buyer, which is the exact failure this module exists to prevent - so the
 * display string and the link digits are defined together, once.
 *
 * Order is significant: [0] is the primary number.
 */
export const phones = [
  { display: "+92 317 4286226", tel: "+923174286226", wa: "923174286226" },
  { display: "+92 300 351 3889", tel: "+923003513889", wa: "923003513889" },
] as const;
