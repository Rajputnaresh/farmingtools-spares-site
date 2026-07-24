// Phase 1.5 network-ledger core — the rules that must be correct.
// Pure functions, no I/O. Server (supabase/schema.sql) implements the SAME
// rules in SQL; this module is the client-side reference + self-check and is
// imported by ledger.html for optimistic rollups. Run `node ledger.js` to test.

// A movement is one transfer: { from, to, sku, qty }. from === null means
// external/opening stock entering the network at `to` (only the importer may do it).
// Balances DERIVE from movements (double-entry): history/audit is free.

export function deriveBalances(movements) {
  const bal = new Map(); // key `${party}|${sku}` -> qty
  const add = (party, sku, d) => {
    if (party == null) return;
    const k = party + "|" + sku;
    bal.set(k, (bal.get(k) || 0) + d);
  };
  for (const m of movements) { add(m.to, m.sku, m.qty); add(m.from, m.sku, -m.qty); }
  return bal;
}

export function available(balances, party, sku) {
  return balances.get(party + "|" + sku) || 0;
}

// Validate + return the movement to append. Throws on any broken rule, so the
// same guard protects every tier (importer->dealer->shopkeeper->enduser).
export function makeTransfer(movements, parties, { from, to, sku, qty }) {
  if (!Number.isInteger(qty) || qty <= 0) throw new Error("qty must be a positive integer");
  if (from === to) throw new Error("from and to must differ");
  if (from == null) throw new Error("use openStock for external stock");
  if (!isDescendant(parties, from, to)) throw new Error("can only ship into your own network");
  const bal = deriveBalances(movements);
  if (available(bal, from, sku) < qty) throw new Error("insufficient stock at source");
  return { from, to, sku, qty };
}

// Only the importer (root: no parent) brings stock in from outside.
export function makeOpenStock(parties, { party, sku, qty }) {
  if (!Number.isInteger(qty) || qty <= 0) throw new Error("qty must be a positive integer");
  const p = parties.find((x) => x.id === party);
  if (!p || p.parent_id != null) throw new Error("only the importer may add external stock");
  return { from: null, to: party, sku, qty };
}

// ---- visibility tree: a party sees itself + all descendants ----
export function descendants(parties, rootId) {
  const kids = new Map();
  for (const p of parties) {
    if (!kids.has(p.parent_id)) kids.set(p.parent_id, []);
    kids.get(p.parent_id).push(p.id);
  }
  const out = new Set([rootId]), stack = [rootId];
  while (stack.length) {
    for (const c of kids.get(stack.pop()) || []) { if (!out.has(c)) { out.add(c); stack.push(c); } }
  }
  return out;
}
// true if `target` is `root` itself or below it (so root is allowed to ship to it)
export function isDescendant(parties, rootId, targetId) {
  return descendants(parties, rootId).has(targetId);
}

// ---- self-check ----
function demo() {
  const assert = (c, m) => { if (!c) throw new Error("FAIL: " + m); };
  const parties = [
    { id: "imp", parent_id: null },
    { id: "dst", parent_id: "imp" },
    { id: "dlr", parent_id: "dst" },
    { id: "shk", parent_id: "dlr" },
    { id: "other", parent_id: "imp" }, // sibling branch under importer
  ];
  const mv = [];
  // importer brings in 100
  mv.push(makeOpenStock(parties, { party: "imp", sku: "S1", qty: 100 }));
  let b = deriveBalances(mv);
  assert(available(b, "imp", "S1") === 100, "opening stock 100");

  // importer bills distributor 30: imp 70, dst 30
  mv.push(makeTransfer(mv, parties, { from: "imp", to: "dst", sku: "S1", qty: 30 }));
  b = deriveBalances(mv);
  assert(available(b, "imp", "S1") === 70 && available(b, "dst", "S1") === 30, "transfer imp->dst");

  // distributor can't ship 40 (only has 30)
  let threw = false;
  try { makeTransfer(mv, parties, { from: "dst", to: "dlr", sku: "S1", qty: 40 }); } catch { threw = true; }
  assert(threw, "overdraw blocked");

  // distributor bills dealer 20, dealer bills shopkeeper 5
  mv.push(makeTransfer(mv, parties, { from: "dst", to: "dlr", sku: "S1", qty: 20 }));
  mv.push(makeTransfer(mv, parties, { from: "dlr", to: "shk", sku: "S1", qty: 5 }));
  b = deriveBalances(mv);
  assert(available(b, "dst", "S1") === 10, "dst 10 left");
  assert(available(b, "dlr", "S1") === 15, "dlr 15 left");
  assert(available(b, "shk", "S1") === 5, "shk got 5");

  // dealer cannot ship into a sibling branch it doesn't own
  threw = false;
  try { makeTransfer(mv, parties, { from: "dlr", to: "other", sku: "S1", qty: 1 }); } catch { threw = true; }
  assert(threw, "cross-branch shipment blocked");

  // visibility: importer sees the whole tree; shopkeeper sees only itself
  const impView = descendants(parties, "imp");
  assert(impView.has("shk") && impView.has("other"), "importer sees all");
  const shkView = descendants(parties, "shk");
  assert(shkView.size === 1 && shkView.has("shk"), "shopkeeper sees only self");
  const dlrView = descendants(parties, "dlr");
  assert(dlrView.has("shk") && !dlrView.has("dst") && !dlrView.has("imp"), "dealer sees down only");

  // only importer opens external stock
  threw = false;
  try { makeOpenStock(parties, { party: "dlr", sku: "S1", qty: 10 }); } catch { threw = true; }
  assert(threw, "non-importer cannot open stock");

  console.log("ledger.js: all checks passed");
}

// node ledger.js -> run self-check (spaces in the path break a plain URL compare)
if (typeof process !== "undefined" && process.argv[1] &&
    import.meta.url === new URL(`file://${process.argv[1]}`).href) demo();
