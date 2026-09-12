# The packaging QR code

The QR printed on the salt bags encodes:

```
https://www.aaatradehouse.com/pack
```

`/pack` is a **redirect defined in `vercel.json`**, not a page. It sends
visitors to the homepage today and can be pointed anywhere later — a
product page, a spec sheet, a distributor form — **without reprinting a
single bag.**

## Why not point the QR straight at the homepage

Because then the destination is fixed in ink. A redirect we own gives the
same permanence with none of the lock-in.

## Why not the previous qrco.de link

The old code pointed at `https://qrco.de/bh02Ki`, a third-party dynamic
redirect. It worked, but the printed bags would have depended on someone
else's service staying alive and someone's subscription being paid. If it
lapsed, every bag already in the world would stop scanning at once, with
no way to fix printed stock. `aaatradehouse.com` is yours for as long as
you renew it.

## Two rules for whoever edits this later

**Keep the redirect temporary (307), never permanent (301).** A 301 is
cached hard by browsers, sometimes indefinitely. If `/pack` is ever made
permanent and later needs to change, anyone who scanned before the change
keeps landing on the old destination and there is nothing you can do about
it. `"permanent": false` is deliberate.

**Never delete `/pack`.** It is printed on physical goods. Removing the
redirect breaks bags that are already in warehouses and on shelves.
