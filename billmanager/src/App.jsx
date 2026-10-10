import React, { useState, useMemo, createContext, useContext } from "react";
import {
  Plus,
  RotateCw,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  ArrowLeftRight,
  HelpCircle,
  Trash2,
  X,
  Clock,
  AlertTriangle,
  Wallet,
  Receipt,
  Boxes,
  PackagePlus,
  PackageMinus,
  Sparkles,
  ChevronRight,
} from "lucide-react";

/* ----------------------------- i18n ----------------------------- */

const LANGS = [
  { key: "sw", label: "SW" },
  { key: "en", label: "EN" },
  { key: "fr", label: "FR" },
];

const MONTHS = {
  sw: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ago", "Sep", "Okt", "Nov", "Des"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  fr: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"],
};

const LOCATION_KEYS = ["depot", "arusha", "mwanza", "mobile"];
const LOCATION_LABELS = {
  sw: { depot: "Ghala Kuu - Kariakoo", arusha: "Tawi - Arusha", mwanza: "Tawi - Mwanza", mobile: "Kitengo cha Simu" },
  en: { depot: "Main Depot - Kariakoo", arusha: "Branch - Arusha", mwanza: "Branch - Mwanza", mobile: "Mobile Unit" },
  fr: { depot: "Dépôt Principal - Kariakoo", arusha: "Succursale - Arusha", mwanza: "Succursale - Mwanza", mobile: "Unité Mobile" },
};

const ACTION_LABELS = {
  sw: { newTransaction: "Muamala Mpya", stockIn: "Bidhaa Ndani", stockOut: "Bidhaa Nje", transfer: "Uhamisho" },
  en: { newTransaction: "New Transaction", stockIn: "Stock In", stockOut: "Stock Out", transfer: "Transfer" },
  fr: { newTransaction: "Nouvelle Transaction", stockIn: "Entrée de Stock", stockOut: "Sortie de Stock", transfer: "Transfert" },
};

const STATUS_LABELS = {
  sw: { pending: "Inasubiri", overdue: "Imechelewa", paid: "Imelipwa", expired: "Imeisha Muda", transferCompleted: "Imekamilika", transferPending: "Inasubiri" },
  en: { pending: "Pending", overdue: "Overdue", paid: "Paid", expired: "Expired", transferCompleted: "Completed", transferPending: "Pending" },
  fr: { pending: "En Attente", overdue: "En Retard", paid: "Payé", expired: "Expiré", transferCompleted: "Terminé", transferPending: "En Attente" },
};

const STRINGS = {
  sw: {
    appVersion: "v1.0 · 19/08/2026",
    nav: {
      create: "Tengeneza Muamala",
      pending: "Miamala Yanayosubiri Malipo",
      history: "Historia ya Malipo",
      expired: "Miamala Yaliyoisha Muda",
      stock: "Bidhaa Ndani / Nje",
      transfer: "Uhamisho",
    },
    sidebar: { expired: (n) => `${n} SKU zimeisha muda`, soon: (n) => `${n} inakaribia kuisha` },
    common: {
      items: "bidhaa",
      noRecords: "Hakuna rekodi za kuonyesha hapa.",
      daysAgoUnit: "siku",
      oldest: "zamani zaidi",
      daysAgo: (n) => `siku ${n} zilizopita`,
    },
    create: {
      title: "Tengeneza Muamala",
      subtitle: "Muamala mpya wa mteja wenye vipengele vya bidhaa",
      suggestTitle: "Hisa za Zamani Zaidi — Pendekezo la Kwanza",
      received: "imepokelewa",
      customerName: "Jina la Mteja",
      customerPlaceholder: "Jina kamili",
      phone: "Namba ya Simu",
      phonePlaceholder: "+255 7XX XXX XXX",
      dueDate: "Tarehe ya Mwisho",
      lineItems: "Vipengele vya Muamala",
      addRow: "Ongeza Mstari",
      colProduct: "Bidhaa / Huduma",
      colBatch: "Namba ya Bati",
      colQty: "Idadi",
      colUnitPrice: "Bei kwa Kipimo",
      colExpiry: "Muda wa Mwisho",
      colSubtotal: "Jumla Ndogo",
      productPlaceholder: "Bidhaa au huduma",
      total: "Jumla",
      generate: "Tengeneza Muamala",
      errFields: "Tafadhali jaza jina la mteja, namba ya simu, na tarehe ya mwisho.",
      errItems: "Ongeza angalau bidhaa moja yenye jina na idadi.",
    },
    pending: {
      title: "Miamala Yanayosubiri Malipo",
      subtitle: (p, o) => `${p} yanasubiri · ${o} yamechelewa`,
      statPending: "Yanayosubiri",
      statOverdue: "Yamechelewa",
      subOverdue: "yamepita tarehe",
      statTotalDue: "Jumla Inayodaiwa",
      statOldest: "Ya Zamani Zaidi",
      subAgo: "zilizopita",
      colTransaction: "Muamala",
      colCustomer: "Mteja",
      colPhone: "Simu",
      colItems: "Bidhaa",
      colTotal: "Jumla",
      colCreated: "Imeundwa",
      colDuePaid: "Mwisho / Imelipwa",
      colStatus: "Hali",
      markPaid: "Weka Imelipwa",
    },
    history: {
      title: "Historia ya Malipo",
      subtitle: (n) => `${n} miamala iliyokamilika`,
      statPaid: "Miamala Yaliyolipwa",
      statCollected: "Jumla Iliyokusanywa",
      statAvg: "Wastani wa Muamala",
    },
    expired: {
      title: "Miamala Yaliyoisha Muda",
      subtitle: "Miamala yaliyopita kikomo cha muda wa kudai",
      statExpired: "Yaliyoisha Muda",
      statValueLost: "Thamani Iliyopotea",
      subUncollected: "haijakusanywa",
    },
    stock: {
      title: "Usimamizi wa Bidhaa",
      subtitle: "Hisa, bidhaa zinazoingia/kutoka, na kumbukumbu",
      statSku: "SKU",
      statExpiringSoon: "Zinakaribia Kuisha",
      subWithin90: "ndani ya siku 90",
      statExpiredStock: "Zilizoisha Muda",
      tabInventory: "Hisa",
      tabStockIn: "Bidhaa Zinaingia",
      tabStockOut: "Bidhaa Zinatoka",
      tabAudit: "Kumbukumbu",
      colProduct: "Bidhaa",
      colBatch: "Bati",
      colQty: "Idadi",
      colUnitPrice: "Bei kwa Kipimo",
      colReceived: "Imepokelewa",
      colExpiry: "Muda wa Mwisho",
      colSupplier: "Msambazaji",
      colAge: "Umri",
      productNamePlaceholder: "Jina la bidhaa",
      supplierLabel: "Msambazaji",
      supplierPlaceholder: "Mfano: MSD - Bohari Kuu ya Dawa",
      registerIn: "Sajili Bidhaa Zinazoingia",
      batchPlaceholder: "Mfano: BT-1774",
      qtyOut: "Idadi ya Kutoa",
      registerOut: "Sajili Bidhaa Zinazotoka",
      errStockIn: "Jaza jina la bidhaa na idadi sahihi.",
      errBatchMissing: "Bati hilo halikupatikana kwenye hisa.",
      errQtyExceeds: "Idadi unayotaka kutoa inazidi hisa iliyopo.",
      noAudit: "Hakuna kumbukumbu bado.",
    },
    transfer: {
      title: "Uhamisho wa Bidhaa",
      subtitle: "Hamisha hisa kati ya maeneo au watumiaji",
      newRequest: "Ombi Jipya la Uhamisho",
      productLabel: "Bidhaa",
      productPlaceholder: "Chagua bidhaa",
      batchLabel: "Namba ya Bati",
      qtyLabel: "Idadi",
      fromLabel: "Kutoka",
      toLabel: "Kwenda",
      selectPlaceholder: "— chagua —",
      err: "Jaza bidhaa, idadi, na maeneo tofauti ya kutoka na kwenda.",
      submit: "Tuma Uhamisho",
      locationSummary: "Muhtasari wa Maeneo",
      received: "amepokea",
      sent: "ametuma",
      log: "Kumbukumbu ya Uhamisho",
      colId: "Kitambulisho",
      colProduct: "Bidhaa",
      colBatch: "Bati",
      colQty: "Idadi",
      colFrom: "Kutoka",
      colTo: "Kwenda",
      colDate: "Tarehe",
      colStatus: "Hali",
    },
    help: {
      title: "Msaada wa Haraka",
      l1: (b) => <>Tumia <b>Tengeneza Muamala</b> kutengeneza muamala mpya wa mteja.</>,
      l2: (b) => <>Bofya <b>Weka Imelipwa</b> kwenye Miamala Yanayosubiri mara mteja anapolipa.</>,
      l3: "Fuatilia hisa na uhamisho kupitia kurasa za Bidhaa na Uhamisho.",
    },
  },
  en: {
    appVersion: "v1.0 · 19/08/2026",
    nav: {
      create: "Create Transaction",
      pending: "Transactions Awaiting Payment",
      history: "Payment History",
      expired: "Expired Transactions",
      stock: "Stock In / Out",
      transfer: "Transfer",
    },
    sidebar: { expired: (n) => `${n} SKUs expired`, soon: (n) => `${n} expiring soon` },
    common: {
      items: "items",
      noRecords: "No records to show here.",
      daysAgoUnit: "days",
      oldest: "oldest",
      daysAgo: (n) => `${n} days ago`,
    },
    create: {
      title: "Create Transaction",
      subtitle: "New customer transaction with product line items",
      suggestTitle: "Oldest Stock — Suggest First",
      received: "received",
      customerName: "Customer Name",
      customerPlaceholder: "Full name",
      phone: "Phone Number",
      phonePlaceholder: "+255 7XX XXX XXX",
      dueDate: "Due Date",
      lineItems: "Line Items",
      addRow: "Add Row",
      colProduct: "Product / Service",
      colBatch: "Batch No.",
      colQty: "Qty",
      colUnitPrice: "Unit Price",
      colExpiry: "Expiry",
      colSubtotal: "Subtotal",
      productPlaceholder: "Product or service",
      total: "Total",
      generate: "Generate Transaction",
      errFields: "Please fill in the customer name, phone number, and due date.",
      errItems: "Add at least one item with a name and quantity.",
    },
    pending: {
      title: "Transactions Awaiting Payment",
      subtitle: (p, o) => `${p} pending · ${o} overdue`,
      statPending: "Pending",
      statOverdue: "Overdue",
      subOverdue: "past due date",
      statTotalDue: "Total Due",
      statOldest: "Oldest Pending",
      subAgo: "ago",
      colTransaction: "Transaction",
      colCustomer: "Customer",
      colPhone: "Phone",
      colItems: "Items",
      colTotal: "Total",
      colCreated: "Created",
      colDuePaid: "Due / Paid",
      colStatus: "Status",
      markPaid: "Mark Paid",
    },
    history: {
      title: "Payment History",
      subtitle: (n) => `${n} completed transactions`,
      statPaid: "Paid Transactions",
      statCollected: "Total Collected",
      statAvg: "Avg Transaction",
    },
    expired: {
      title: "Expired Transactions",
      subtitle: "Transactions past the collection deadline",
      statExpired: "Expired",
      statValueLost: "Value Lost",
      subUncollected: "uncollected",
    },
    stock: {
      title: "Stock Management",
      subtitle: "Inventory, stock in/out, and audit log",
      statSku: "SKUs",
      statExpiringSoon: "Expiring Soon",
      subWithin90: "within 90 days",
      statExpiredStock: "Expired Stock",
      tabInventory: "Inventory",
      tabStockIn: "Stock In",
      tabStockOut: "Stock Out",
      tabAudit: "Audit Log",
      colProduct: "Product",
      colBatch: "Batch",
      colQty: "Qty",
      colUnitPrice: "Unit Price",
      colReceived: "Received",
      colExpiry: "Expiry",
      colSupplier: "Supplier",
      colAge: "Age",
      productNamePlaceholder: "Product name",
      supplierLabel: "Supplier",
      supplierPlaceholder: "e.g. MSD - Central Medical Store",
      registerIn: "Register Incoming Stock",
      batchPlaceholder: "e.g. BT-1774",
      qtyOut: "Quantity to Remove",
      registerOut: "Register Outgoing Stock",
      errStockIn: "Fill in the product name and a valid quantity.",
      errBatchMissing: "That batch was not found in stock.",
      errQtyExceeds: "The quantity to remove exceeds available stock.",
      noAudit: "No log entries yet.",
    },
    transfer: {
      title: "Product Transfer",
      subtitle: "Move stock between locations or users",
      newRequest: "New Transfer Request",
      productLabel: "Product",
      productPlaceholder: "Select product",
      batchLabel: "Batch No.",
      qtyLabel: "Quantity",
      fromLabel: "From",
      toLabel: "To",
      selectPlaceholder: "— select —",
      err: "Fill in the product, quantity, and different from/to locations.",
      submit: "Submit Transfer",
      locationSummary: "Location Summary",
      received: "received",
      sent: "sent",
      log: "Transfer Log",
      colId: "ID",
      colProduct: "Product",
      colBatch: "Batch",
      colQty: "Qty",
      colFrom: "From",
      colTo: "To",
      colDate: "Date",
      colStatus: "Status",
    },
    help: {
      title: "Quick Help",
      l1: (b) => <>Use <b>Create Transaction</b> to create a new customer transaction.</>,
      l2: (b) => <>Click <b>Mark Paid</b> on Pending Transactions once the customer pays.</>,
      l3: "Track stock and transfers through the Stock and Transfer pages.",
    },
  },
  fr: {
    appVersion: "v1.0 · 19/08/2026",
    nav: {
      create: "Créer une Transaction",
      pending: "Transactions en Attente de Paiement",
      history: "Historique des Paiements",
      expired: "Transactions Expirées",
      stock: "Entrées / Sorties de Stock",
      transfer: "Transfert",
    },
    sidebar: { expired: (n) => `${n} SKU expirés`, soon: (n) => `${n} bientôt expiré(s)` },
    common: {
      items: "articles",
      noRecords: "Aucun enregistrement à afficher ici.",
      daysAgoUnit: "jours",
      oldest: "le plus ancien",
      daysAgo: (n) => `il y a ${n} jours`,
    },
    create: {
      title: "Créer une Transaction",
      subtitle: "Nouvelle transaction client avec des articles",
      suggestTitle: "Stock le Plus Ancien — Suggestion Prioritaire",
      received: "reçu le",
      customerName: "Nom du Client",
      customerPlaceholder: "Nom complet",
      phone: "Numéro de Téléphone",
      phonePlaceholder: "+255 7XX XXX XXX",
      dueDate: "Date d'Échéance",
      lineItems: "Articles de la Transaction",
      addRow: "Ajouter une Ligne",
      colProduct: "Produit / Service",
      colBatch: "N° de Lot",
      colQty: "Qté",
      colUnitPrice: "Prix Unitaire",
      colExpiry: "Expiration",
      colSubtotal: "Sous-total",
      productPlaceholder: "Produit ou service",
      total: "Total",
      generate: "Générer la Transaction",
      errFields: "Veuillez renseigner le nom du client, le numéro de téléphone et la date d'échéance.",
      errItems: "Ajoutez au moins un article avec un nom et une quantité.",
    },
    pending: {
      title: "Transactions en Attente de Paiement",
      subtitle: (p, o) => `${p} en attente · ${o} en retard`,
      statPending: "En Attente",
      statOverdue: "En Retard",
      subOverdue: "date dépassée",
      statTotalDue: "Total Dû",
      statOldest: "La Plus Ancienne",
      subAgo: "il y a",
      colTransaction: "Transaction",
      colCustomer: "Client",
      colPhone: "Téléphone",
      colItems: "Articles",
      colTotal: "Total",
      colCreated: "Créée le",
      colDuePaid: "Échéance / Payé",
      colStatus: "Statut",
      markPaid: "Marquer Payé",
    },
    history: {
      title: "Historique des Paiements",
      subtitle: (n) => `${n} transactions terminées`,
      statPaid: "Transactions Payées",
      statCollected: "Total Collecté",
      statAvg: "Transaction Moyenne",
    },
    expired: {
      title: "Transactions Expirées",
      subtitle: "Transactions ayant dépassé le délai de recouvrement",
      statExpired: "Expirées",
      statValueLost: "Valeur Perdue",
      subUncollected: "non recouvrée",
    },
    stock: {
      title: "Gestion des Stocks",
      subtitle: "Inventaire, entrées/sorties de stock et journal",
      statSku: "SKU",
      statExpiringSoon: "Bientôt Expiré",
      subWithin90: "dans les 90 jours",
      statExpiredStock: "Stock Expiré",
      tabInventory: "Inventaire",
      tabStockIn: "Entrées de Stock",
      tabStockOut: "Sorties de Stock",
      tabAudit: "Journal d'Audit",
      colProduct: "Produit",
      colBatch: "Lot",
      colQty: "Qté",
      colUnitPrice: "Prix Unitaire",
      colReceived: "Reçu le",
      colExpiry: "Expiration",
      colSupplier: "Fournisseur",
      colAge: "Ancienneté",
      productNamePlaceholder: "Nom du produit",
      supplierLabel: "Fournisseur",
      supplierPlaceholder: "ex : MSD - Entrepôt Central",
      registerIn: "Enregistrer l'Entrée de Stock",
      batchPlaceholder: "ex : BT-1774",
      qtyOut: "Quantité à Retirer",
      registerOut: "Enregistrer la Sortie de Stock",
      errStockIn: "Renseignez le nom du produit et une quantité valide.",
      errBatchMissing: "Ce lot n'a pas été trouvé en stock.",
      errQtyExceeds: "La quantité à retirer dépasse le stock disponible.",
      noAudit: "Aucune entrée de journal pour le moment.",
    },
    transfer: {
      title: "Transfert de Produits",
      subtitle: "Déplacer le stock entre les emplacements ou les utilisateurs",
      newRequest: "Nouvelle Demande de Transfert",
      productLabel: "Produit",
      productPlaceholder: "Sélectionner un produit",
      batchLabel: "N° de Lot",
      qtyLabel: "Quantité",
      fromLabel: "De",
      toLabel: "Vers",
      selectPlaceholder: "— sélectionner —",
      err: "Renseignez le produit, la quantité et des emplacements différents.",
      submit: "Soumettre le Transfert",
      locationSummary: "Résumé des Emplacements",
      received: "reçu",
      sent: "envoyé",
      log: "Journal des Transferts",
      colId: "ID",
      colProduct: "Produit",
      colBatch: "Lot",
      colQty: "Qté",
      colFrom: "De",
      colTo: "Vers",
      colDate: "Date",
      colStatus: "Statut",
    },
    help: {
      title: "Aide Rapide",
      l1: (b) => <>Utilisez <b>Créer une Transaction</b> pour créer une nouvelle transaction client.</>,
      l2: (b) => <>Cliquez sur <b>Marquer Payé</b> dès que le client règle sa transaction.</>,
      l3: "Suivez le stock et les transferts via les pages Stock et Transfert.",
    },
  },
};

const LangContext = createContext({ lang: "sw", setLang: () => {}, s: STRINGS.sw });
const useLang = () => useContext(LangContext);

/* ----------------------------- helpers ----------------------------- */

function parseDate(d) {
  if (d instanceof Date) return d;
  return new Date(d + "T00:00:00");
}

function fmtDate(d, lang) {
  const dt = parseDate(d);
  const months = MONTHS[lang] || MONTHS.sw;
  return `${String(dt.getDate()).padStart(2, "0")} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
}

function fmtTZS(n) {
  return "TZS " + Math.round(n).toLocaleString("en-US");
}

function daysBetween(a, b) {
  const ms = parseDate(a).getTime() - parseDate(b).getTime();
  return Math.round(ms / 86400000);
}

function todayISO() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(
    t.getDate()
  ).padStart(2, "0")}`;
}

const TODAY = todayISO();
let idCounter = 1000;
const nextId = () => idCounter++;

/* ----------------------------- seed data ----------------------------- */

const seedInventory = [
  { id: 1, product: "Metformin 850mg", batch: "BT-1774", qty: 150, unitPrice: 3500, received: "2023-11-30", expiry: "2025-06-15", supplier: "MSD - Bohari Kuu ya Dawa" },
  { id: 2, product: "Losartan 50mg", batch: "BT-2090", qty: 200, unitPrice: 6200, received: "2024-01-22", expiry: "2025-12-20", supplier: "Shelys Pharmaceuticals" },
  { id: 3, product: "Amoxicillin 500mg", batch: "BT-2241", qty: 120, unitPrice: 8000, received: "2024-02-10", expiry: "2025-11-05", supplier: "Zenufa Laboratories" },
  { id: 4, product: "Paracetamol 500mg", batch: "BT-1892", qty: 300, unitPrice: 1200, received: "2024-03-18", expiry: "2025-09-01", supplier: "Tanzania Pharmaceutical Industries" },
  { id: 5, product: "Diazepam 5mg", batch: "BT-2777", qty: 60, unitPrice: 4000, received: "2024-04-14", expiry: "2025-08-01", supplier: "Zenufa Laboratories" },
  { id: 6, product: "Coartem 20/120mg", batch: "BT-3105", qty: 80, unitPrice: 12000, received: "2025-06-05", expiry: "2026-10-15", supplier: "MSD - Bohari Kuu ya Dawa" },
  { id: 7, product: "ORS - Maji ya Chumvi na Sukari", batch: "BT-3320", qty: 500, unitPrice: 900, received: "2025-07-12", expiry: "2027-05-01", supplier: "Tanzania Pharmaceutical Industries" },
];

const seedBills = [
  {
    id: nextId(), invoice: "INV-1256", customer: "Juma Mwakasege", phone: "+255 754 220 981",
    items: [{ product: "ORS - Maji ya Chumvi na Sukari", qty: 20, unitPrice: 900 }],
    created: TODAY, due: TODAY, paid: null, status: "pending",
  },
  {
    id: nextId(), invoice: "INV-0041", customer: "Neema Kessy", phone: "+255 786 112 340",
    items: [
      { product: "Losartan 50mg", qty: 15, unitPrice: 6200 },
      { product: "Amoxicillin 500mg", qty: 6, unitPrice: 8000 },
    ],
    created: "2026-08-01", due: "2026-08-15", paid: null, status: "pending",
  },
  {
    id: nextId(), invoice: "INV-0040", customer: "Baraka Chuwa", phone: "+255 713 998 221",
    items: [{ product: "Coartem 20/120mg", qty: 4, unitPrice: 12000 }],
    created: "2026-07-28", due: "2026-07-28", paid: null, status: "pending",
  },
  {
    id: nextId(), invoice: "INV-0038", customer: "Halima Ngowi", phone: "+255 715 664 882",
    items: [
      { product: "Metformin 850mg", qty: 30, unitPrice: 3500 },
      { product: "Diazepam 5mg", qty: 25, unitPrice: 4000 },
    ],
    created: "2026-07-10", due: "2026-07-24", paid: "2026-07-24", status: "paid",
  },
  {
    id: nextId(), invoice: "INV-0033", customer: "Tausi Rashid", phone: "+255 741 887 990",
    items: [{ product: "Amoxicillin 500mg", qty: 7, unitPrice: 8000 }],
    created: "2026-05-20", due: "2026-06-03", paid: "2026-06-03", status: "paid",
  },
  {
    id: nextId(), invoice: "INV-0035", customer: "Godfrey Massawe", phone: "+255 767 004 552",
    items: [{ product: "Paracetamol 500mg", qty: 58, unitPrice: 1200 }],
    created: "2026-06-01", due: "2026-06-15", paid: null, status: "expired",
  },
];

const seedTransfers = [
  { id: "TR-001", product: "Coartem 20/120mg", batch: "BT-3105", qty: 20, from: "depot", to: "arusha", date: "2026-08-15", status: "completed" },
  { id: "TR-002", product: "Paracetamol 500mg", batch: "BT-1892", qty: 40, from: "depot", to: "mobile", date: "2026-08-17", status: "pending" },
];

const seedAudit = [
  { id: nextId(), date: "2026-08-17", action: "transfer", detail: "TR-002 · Paracetamol 500mg · BT-1892 · +40 → Kitengo cha Simu" },
  { id: nextId(), date: "2026-08-15", action: "transfer", detail: "TR-001 · Coartem 20/120mg · BT-3105 · +20 → Tawi - Arusha" },
  { id: nextId(), date: "2026-07-12", action: "stockIn", detail: "ORS - Maji ya Chumvi na Sukari · BT-3320 · +500 ← Tanzania Pharmaceutical Industries" },
];

const billTotal = (b) => b.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);

/* ----------------------------- design atoms ----------------------------- */

const TONE_STYLES = {
  pending: { bg: "bg-amber-400/10", text: "text-amber-300", ring: "ring-amber-400/20", dot: "bg-amber-400" },
  overdue: { bg: "bg-rose-400/10", text: "text-rose-300", ring: "ring-rose-400/20", dot: "bg-rose-400" },
  paid: { bg: "bg-emerald-400/10", text: "text-emerald-300", ring: "ring-emerald-400/20", dot: "bg-emerald-400" },
  expired: { bg: "bg-rose-400/10", text: "text-rose-300", ring: "ring-rose-400/20", dot: "bg-rose-400" },
  neutral: { bg: "bg-slate-400/10", text: "text-slate-300", ring: "ring-slate-400/20", dot: "bg-slate-400" },
  info: { bg: "bg-sky-400/10", text: "text-sky-300", ring: "ring-sky-400/20", dot: "bg-sky-400" },
};

function Badge({ children, tone = "neutral" }) {
  const s = TONE_STYLES[tone] || TONE_STYLES.neutral;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${s.bg} ${s.text} ${s.ring}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {children}
    </span>
  );
}

function Stat({ label, value, sub, tone = "default", icon: Icon }) {
  const toneCls =
    tone === "danger" ? "text-rose-300" : tone === "warn" ? "text-amber-300" : tone === "accent" ? "text-indigo-300" : "text-slate-50";
  const iconBg =
    tone === "danger" ? "bg-rose-400/10 text-rose-300" : tone === "warn" ? "bg-amber-400/10 text-amber-300" : "bg-indigo-400/10 text-indigo-300";
  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 shadow-md hover:border-white/20 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</div>
        {Icon && (
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
            <Icon size={14} />
          </div>
        )}
      </div>
      <div className={`text-2xl leading-none font-semibold tracking-tight ${toneCls}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1.5">{sub}</div>}
    </div>
  );
}

function PageHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-7 pb-6 border-b border-white/10 flex items-start gap-4">
      {Icon && (
        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-300 flex items-center justify-center ring-1 ring-indigo-400/20 shrink-0">
          <Icon size={20} />
        </div>
      )}
      <div>
        <h1 className="text-2xl font-semibold text-slate-50 tracking-tight">{title}</h1>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function Th({ children, className = "" }) {
  return (
    <th className={`text-left text-xs font-medium tracking-wide text-slate-500 uppercase px-4 py-3 ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return <td className={`px-4 py-3.5 text-sm text-slate-300 ${className}`}>{children}</td>;
}

function Card({ children, className = "" }) {
  return <div className={`bg-slate-900 border border-white/10 rounded-2xl ${className}`}>{children}</div>;
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium tracking-wide text-slate-500 uppercase block mb-2">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-slate-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10 transition-colors";

function PrimaryButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 border border-white/10 hover:border-white/25 hover:bg-white/5 rounded-lg px-3 py-2 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

/* ----------------------------- views ----------------------------- */

function CreateBillView({ inventory, onGenerate }) {
  const { lang, s } = useLang();
  const t = s.create;
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [rows, setRows] = useState([{ rid: 1, product: "", batch: "BT-0000", qty: 1, unitPrice: 0, expiry: "" }]);
  const [error, setError] = useState("");

  const oldestStock = useMemo(
    () => [...inventory].sort((a, b) => parseDate(a.received) - parseDate(b.received)).slice(0, 4),
    [inventory]
  );

  const updateRow = (rid, patch) => setRows((rs) => rs.map((r) => (r.rid === rid ? { ...r, ...patch } : r)));
  const addRow = () => setRows((rs) => [...rs, { rid: Date.now(), product: "", batch: "BT-0000", qty: 1, unitPrice: 0, expiry: "" }]);
  const removeRow = (rid) => setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.rid !== rid) : rs));

  const applySuggestion = (item) => {
    const emptyIdx = rows.findIndex((r) => !r.product);
    const patch = { product: item.product, batch: item.batch, unitPrice: item.unitPrice, expiry: item.expiry };
    if (emptyIdx >= 0) {
      setRows((rs) => rs.map((r, i) => (i === emptyIdx ? { ...r, ...patch } : r)));
    } else {
      setRows((rs) => [...rs, { rid: Date.now(), qty: 1, ...patch }]);
    }
  };

  const total = rows.reduce((s2, r) => s2 + (Number(r.qty) || 0) * (Number(r.unitPrice) || 0), 0);

  const handleGenerate = () => {
    if (!customerName.trim() || !phone.trim() || !dueDate) {
      setError(t.errFields);
      return;
    }
    const validRows = rows.filter((r) => r.product.trim() && Number(r.qty) > 0);
    if (validRows.length === 0) {
      setError(t.errItems);
      return;
    }
    setError("");
    onGenerate({
      customer: customerName.trim(),
      phone: phone.trim(),
      due: dueDate,
      items: validRows.map((r) => ({ product: r.product, qty: Number(r.qty), unitPrice: Number(r.unitPrice) })),
    });
    setCustomerName("");
    setPhone("");
    setDueDate("");
    setRows([{ rid: Date.now(), product: "", batch: "BT-0000", qty: 1, unitPrice: 0, expiry: "" }]);
  };

  return (
    <div>
      <PageHeader title={t.title} subtitle={t.subtitle} icon={Plus} />

      <Card className="p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={14} className="text-amber-300" />
          <div className="text-xs font-medium tracking-wide text-slate-400 uppercase">{t.suggestTitle}</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {oldestStock.map((it) => (
            <button
              key={it.id}
              onClick={() => applySuggestion(it)}
              className="text-left bg-amber-400/5 hover:bg-amber-400/10 border border-amber-400/20 hover:border-amber-400/30 rounded-xl px-3.5 py-2.5 text-xs transition-all"
            >
              <span className="font-semibold text-amber-200">{it.product}</span>
              <span className="text-amber-400/60"> · {it.batch} · {t.received} {fmtDate(it.received, lang)}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Field label={t.customerName}>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={t.customerPlaceholder} className={inputCls} />
        </Field>
        <Field label={t.phone}>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.phonePlaceholder} className={inputCls} />
        </Field>
        <Field label={t.dueDate}>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputCls} />
        </Field>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-medium tracking-wide text-slate-500 uppercase">{t.lineItems}</div>
        <GhostButton onClick={addRow}>
          <Plus size={14} /> {t.addRow}
        </GhostButton>
      </div>

      <Card className="overflow-hidden mb-2">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <Th>{t.colProduct}</Th>
              <Th>{t.colBatch}</Th>
              <Th>{t.colQty}</Th>
              <Th>{t.colUnitPrice}</Th>
              <Th>{t.colExpiry}</Th>
              <Th className="text-right">{t.colSubtotal}</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.rid} className="border-t border-white/10">
                <Td>
                  <input
                    value={r.product}
                    onChange={(e) => updateRow(r.rid, { product: e.target.value })}
                    placeholder={t.productPlaceholder}
                    className="w-full bg-transparent text-slate-200 placeholder-slate-600 outline-none"
                  />
                </Td>
                <Td>
                  <input
                    value={r.batch}
                    onChange={(e) => updateRow(r.rid, { batch: e.target.value })}
                    className="w-24 bg-transparent text-slate-500 font-mono text-xs outline-none"
                  />
                </Td>
                <Td>
                  <input
                    type="number"
                    min="1"
                    value={r.qty}
                    onChange={(e) => updateRow(r.rid, { qty: e.target.value })}
                    className="w-16 bg-transparent text-slate-200 outline-none"
                  />
                </Td>
                <Td>
                  <input
                    type="number"
                    min="0"
                    value={r.unitPrice}
                    onChange={(e) => updateRow(r.rid, { unitPrice: e.target.value })}
                    className="w-24 bg-transparent text-slate-200 outline-none"
                  />
                </Td>
                <Td>
                  <input
                    type="date"
                    value={r.expiry}
                    onChange={(e) => updateRow(r.rid, { expiry: e.target.value })}
                    className="bg-transparent text-slate-500 outline-none text-xs"
                  />
                </Td>
                <Td className="text-right font-semibold text-slate-100">
                  {fmtTZS((Number(r.qty) || 0) * (Number(r.unitPrice) || 0))}
                </Td>
                <Td>
                  <button onClick={() => removeRow(r.rid)} className="text-slate-600 hover:text-rose-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {error && <div className="text-xs text-rose-400 mb-4 mt-2">{error}</div>}

      <div className="flex items-center justify-between mt-7">
        <div className="text-slate-500 text-sm">
          {t.total} <span className="block text-3xl font-semibold text-slate-50 tracking-tight mt-0.5">{fmtTZS(total)}</span>
        </div>
        <PrimaryButton onClick={handleGenerate}>
          {t.generate} <ChevronRight size={15} />
        </PrimaryButton>
      </div>
    </div>
  );
}

function BillsTable({ bills, showMarkPaid, onMarkPaid, statusOverride }) {
  const { lang, s } = useLang();
  const t = s.pending;
  const st = STATUS_LABELS[lang];
  return (
    <Card className="overflow-x-auto">
      <table className="w-full" style={{ minWidth: "820px" }}>
        <thead className="bg-white/5">
          <tr>
            <Th>{t.colTransaction}</Th>
            <Th>{t.colCustomer}</Th>
            <Th>{t.colPhone}</Th>
            <Th>{t.colItems}</Th>
            <Th>{t.colTotal}</Th>
            <Th>{t.colCreated}</Th>
            <Th>{t.colDuePaid}</Th>
            <Th>{t.colStatus}</Th>
            {showMarkPaid && <Th></Th>}
          </tr>
        </thead>
        <tbody>
          {bills.map((b) => {
            const total = billTotal(b);
            const isOverdue = b.status === "pending" && daysBetween(TODAY, b.due) > 0;
            const tone = statusOverride || (b.status === "paid" ? "paid" : b.status === "expired" ? "expired" : isOverdue ? "overdue" : "pending");
            const label = st[tone];
            return (
              <tr key={b.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                <Td className="text-indigo-300 font-mono font-medium text-xs">{b.invoice}</Td>
                <Td className="text-slate-100 font-medium">{b.customer}</Td>
                <Td className="text-slate-500">{b.phone}</Td>
                <Td>{b.items.length} {s.common.items}</Td>
                <Td className="font-semibold text-slate-100">{fmtTZS(total)}</Td>
                <Td className="text-slate-500">{fmtDate(b.created, lang)}</Td>
                <Td className="text-slate-500">{fmtDate(b.paid || b.due, lang)}</Td>
                <Td>
                  <Badge tone={tone}>{label}</Badge>
                </Td>
                {showMarkPaid && (
                  <Td>
                    <GhostButton onClick={() => onMarkPaid(b.id)} className="hover:!border-emerald-400/50 hover:!text-emerald-300">
                      <CheckCircle2 size={13} /> {t.markPaid}
                    </GhostButton>
                  </Td>
                )}
              </tr>
            );
          })}
          {bills.length === 0 && (
            <tr>
              <td colSpan={9} className="text-center text-sm text-slate-600 py-14">
                {s.common.noRecords}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}

function PendingBillsView({ bills, onMarkPaid }) {
  const { s } = useLang();
  const t = s.pending;
  const pending = bills.filter((b) => b.status === "pending");
  const overdue = pending.filter((b) => daysBetween(TODAY, b.due) > 0);
  const totalDue = pending.reduce((s2, b) => s2 + billTotal(b), 0);
  const oldest = pending.reduce((max, b) => Math.max(max, daysBetween(TODAY, b.created)), 0);

  return (
    <div>
      <PageHeader title={t.title} subtitle={t.subtitle(pending.length, overdue.length)} icon={RotateCw} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label={t.statPending} value={pending.length} icon={Receipt} />
        <Stat label={t.statOverdue} value={overdue.length} sub={t.subOverdue} tone={overdue.length ? "danger" : "default"} icon={AlertTriangle} />
        <Stat label={t.statTotalDue} value={fmtTZS(totalDue)} icon={Wallet} tone="accent" />
        <Stat label={t.statOldest} value={`${oldest} ${s.common.daysAgoUnit}`} sub={t.subAgo} icon={Clock} />
      </div>
      <BillsTable bills={pending} showMarkPaid onMarkPaid={onMarkPaid} />
    </div>
  );
}

function PaymentHistoryView({ bills }) {
  const { s } = useLang();
  const t = s.history;
  const paid = bills.filter((b) => b.status === "paid");
  const totalCollected = paid.reduce((s2, b) => s2 + billTotal(b), 0);
  const avg = paid.length ? totalCollected / paid.length : 0;

  return (
    <div>
      <PageHeader title={t.title} subtitle={t.subtitle(paid.length)} icon={CheckCircle2} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Stat label={t.statPaid} value={paid.length} icon={CheckCircle2} />
        <Stat label={t.statCollected} value={fmtTZS(totalCollected)} icon={Wallet} tone="accent" />
        <Stat label={t.statAvg} value={fmtTZS(avg)} icon={Receipt} />
      </div>
      <BillsTable bills={paid} statusOverride="paid" />
    </div>
  );
}

function ExpiredBillsView({ bills }) {
  const { s } = useLang();
  const t = s.expired;
  const expired = bills.filter((b) => b.status === "expired");
  const valueLost = expired.reduce((s2, b) => s2 + billTotal(b), 0);

  return (
    <div>
      <PageHeader title={t.title} subtitle={t.subtitle} icon={XCircle} />
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
        <Stat label={t.statExpired} value={expired.length} icon={XCircle} />
        <Stat label={t.statValueLost} value={fmtTZS(valueLost)} sub={t.subUncollected} tone="danger" icon={AlertTriangle} />
      </div>
      <BillsTable bills={expired} statusOverride="expired" />
    </div>
  );
}

function StockManagementView({ inventory, onStockChange, auditLog, addAudit }) {
  const { lang, s } = useLang();
  const t = s.stock;
  const [tab, setTab] = useState("inventory");
  const [inProduct, setInProduct] = useState("");
  const [inBatch, setInBatch] = useState("BT-0000");
  const [inQty, setInQty] = useState(1);
  const [inSupplier, setInSupplier] = useState("");
  const [outBatch, setOutBatch] = useState("");
  const [outQty, setOutQty] = useState(1);
  const [msg, setMsg] = useState("");

  const expiringSoon = inventory.filter((it) => {
    const d = daysBetween(it.expiry, TODAY);
    return d >= 0 && d <= 90;
  });
  const expiredStock = inventory.filter((it) => daysBetween(it.expiry, TODAY) < 0);
  const oldestId = [...inventory].sort((a, b) => parseDate(a.received) - parseDate(b.received))[0]?.id;

  const tabs = [
    { key: "inventory", label: t.tabInventory },
    { key: "stockin", label: t.tabStockIn },
    { key: "stockout", label: t.tabStockOut },
    { key: "audit", label: t.tabAudit },
  ];

  const handleStockIn = () => {
    if (!inProduct.trim() || Number(inQty) <= 0) {
      setMsg(t.errStockIn);
      return;
    }
    setMsg("");
    onStockChange({ type: "in", product: inProduct.trim(), batch: inBatch.trim() || "BT-0000", qty: Number(inQty), supplier: inSupplier.trim() || "—" });
    addAudit("stockIn", `${inProduct.trim()} · ${inBatch.trim() || "BT-0000"} · +${inQty} ← ${inSupplier.trim() || "—"}`);
    setInProduct(""); setInBatch("BT-0000"); setInQty(1); setInSupplier("");
  };

  const handleStockOut = () => {
    const item = inventory.find((it) => it.batch === outBatch);
    if (!item) {
      setMsg(t.errBatchMissing);
      return;
    }
    if (Number(outQty) > item.qty) {
      setMsg(t.errQtyExceeds);
      return;
    }
    setMsg("");
    onStockChange({ type: "out", batch: outBatch, qty: Number(outQty) });
    addAudit("stockOut", `${item.product} · ${outBatch} · -${outQty}`);
    setOutBatch(""); setOutQty(1);
  };

  return (
    <div>
      <PageHeader title={t.title} subtitle={t.subtitle} icon={Boxes} />

      <div className="grid grid-cols-3 gap-4 mb-7 max-w-2xl">
        <Stat label={t.statSku} value={inventory.length} icon={Boxes} />
        <Stat label={t.statExpiringSoon} value={expiringSoon.length} sub={t.subWithin90} tone={expiringSoon.length ? "warn" : "default"} icon={Clock} />
        <Stat label={t.statExpiredStock} value={expiredStock.length} tone={expiredStock.length ? "danger" : "default"} icon={AlertTriangle} />
      </div>

      <div className="flex gap-1 mb-6 bg-white/5 p-1 rounded-xl w-fit">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`text-xs font-medium px-3.5 py-2 rounded-lg transition-colors ${
              tab === tb.key ? "bg-indigo-500 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {tab === "inventory" && (
        <Card className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: "820px" }}>
            <thead className="bg-white/5">
              <tr>
                <Th>{t.colProduct}</Th>
                <Th>{t.colBatch}</Th>
                <Th>{t.colQty}</Th>
                <Th>{t.colUnitPrice}</Th>
                <Th>{t.colReceived}</Th>
                <Th>{t.colExpiry}</Th>
                <Th>{t.colSupplier}</Th>
                <Th>{t.colAge}</Th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((it) => {
                const age = daysBetween(TODAY, it.received);
                const expDays = daysBetween(it.expiry, TODAY);
                return (
                  <tr key={it.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                    <Td className="text-slate-100 font-medium">{it.product}</Td>
                    <Td className="text-slate-500 font-mono text-xs">{it.batch}</Td>
                    <Td className={it.qty === 0 ? "text-rose-300 font-medium" : "text-emerald-300 font-medium"}>{it.qty}</Td>
                    <Td>{fmtTZS(it.unitPrice)}</Td>
                    <Td className="text-slate-500">{fmtDate(it.received, lang)}</Td>
                    <Td className={expDays < 0 ? "text-rose-300" : expDays <= 90 ? "text-amber-300" : "text-slate-400"}>
                      {it.expiry.slice(0, 7)}
                    </Td>
                    <Td className="text-slate-500">{it.supplier}</Td>
                    <Td className={it.id === oldestId ? "text-amber-300 font-medium" : "text-slate-500"}>
                      {it.id === oldestId ? s.common.oldest : s.common.daysAgo(age)}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "stockin" && (
        <Card className="max-w-xl p-5 space-y-4">
          <Field label={t.colProduct}>
            <input value={inProduct} onChange={(e) => setInProduct(e.target.value)} placeholder={t.productNamePlaceholder} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t.colBatch}>
              <input value={inBatch} onChange={(e) => setInBatch(e.target.value)} className={inputCls} />
            </Field>
            <Field label={t.colQty}>
              <input type="number" min="1" value={inQty} onChange={(e) => setInQty(e.target.value)} className={inputCls} />
            </Field>
          </div>
          <Field label={t.supplierLabel}>
            <input value={inSupplier} onChange={(e) => setInSupplier(e.target.value)} placeholder={t.supplierPlaceholder} className={inputCls} />
          </Field>
          {msg && <div className="text-xs text-rose-400">{msg}</div>}
          <PrimaryButton onClick={handleStockIn}>
            <PackagePlus size={15} /> {t.registerIn}
          </PrimaryButton>
        </Card>
      )}

      {tab === "stockout" && (
        <Card className="max-w-xl p-5 space-y-4">
          <Field label={t.colBatch}>
            <input value={outBatch} onChange={(e) => setOutBatch(e.target.value)} placeholder={t.batchPlaceholder} className={inputCls} />
          </Field>
          <Field label={t.qtyOut}>
            <input type="number" min="1" value={outQty} onChange={(e) => setOutQty(e.target.value)} className={inputCls} />
          </Field>
          {msg && <div className="text-xs text-rose-400">{msg}</div>}
          <PrimaryButton onClick={handleStockOut}>
            <PackageMinus size={15} /> {t.registerOut}
          </PrimaryButton>
        </Card>
      )}

      {tab === "audit" && (
        <Card className="divide-y divide-white/10">
          {auditLog.map((a) => (
            <div key={a.id} className="px-5 py-3.5 flex items-start gap-4">
              <span className="text-xs text-slate-600 w-24 shrink-0 pt-0.5 font-mono">{fmtDate(a.date, lang)}</span>
              <Badge tone="info">{ACTION_LABELS[lang][a.action] || a.action}</Badge>
              <span className="text-sm text-slate-300">{a.detail}</span>
            </div>
          ))}
          {auditLog.length === 0 && <div className="text-center text-sm text-slate-600 py-14">{t.noAudit}</div>}
        </Card>
      )}
    </div>
  );
}

function TransferView({ inventory, transfers, onSubmitTransfer }) {
  const { lang, s } = useLang();
  const t = s.transfer;
  const st = STATUS_LABELS[lang];
  const locLabels = LOCATION_LABELS[lang];
  const [product, setProduct] = useState("");
  const [batch, setBatch] = useState("BT-0000");
  const [qty, setQty] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");

  const summary = LOCATION_KEYS.map((loc) => ({
    loc,
    sent: transfers.filter((tr) => tr.from === loc).length,
    rcvd: transfers.filter((tr) => tr.to === loc && tr.status === "completed").length,
  }));

  const handleSubmit = () => {
    if (!product.trim() || !from || !to || from === to || Number(qty) <= 0) {
      setError(t.err);
      return;
    }
    setError("");
    onSubmitTransfer({ product: product.trim(), batch: batch.trim() || "BT-0000", qty: Number(qty), from, to });
    setProduct(""); setBatch("BT-0000"); setQty(1); setFrom(""); setTo("");
  };

  return (
    <div>
      <PageHeader title={t.title} subtitle={t.subtitle} icon={ArrowLeftRight} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-7">
        <Card className="p-5">
          <div className="text-xs font-medium tracking-wide text-slate-500 uppercase mb-4">{t.newRequest}</div>
          <div className="mb-4">
            <Field label={t.productLabel}>
              <input list="product-options" value={product} onChange={(e) => setProduct(e.target.value)} placeholder={t.productPlaceholder} className={inputCls} />
              <datalist id="product-options">
                {inventory.map((it) => (
                  <option key={it.id} value={it.product} />
                ))}
              </datalist>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field label={t.batchLabel}>
              <input value={batch} onChange={(e) => setBatch(e.target.value)} className={inputCls} />
            </Field>
            <Field label={t.qtyLabel}>
              <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <Field label={t.fromLabel}>
              <select value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls}>
                <option value="">{t.selectPlaceholder}</option>
                {LOCATION_KEYS.map((l) => <option key={l} value={l}>{locLabels[l]}</option>)}
              </select>
            </Field>
            <Field label={t.toLabel}>
              <select value={to} onChange={(e) => setTo(e.target.value)} className={inputCls}>
                <option value="">{t.selectPlaceholder}</option>
                {LOCATION_KEYS.map((l) => <option key={l} value={l}>{locLabels[l]}</option>)}
              </select>
            </Field>
          </div>
          {error && <div className="text-xs text-rose-400 mb-3">{error}</div>}
          <PrimaryButton onClick={handleSubmit}>
            {t.submit} <ChevronRight size={15} />
          </PrimaryButton>
        </Card>

        <div>
          <div className="text-xs font-medium tracking-wide text-slate-500 uppercase mb-4">{t.locationSummary}</div>
          <div className="space-y-2.5">
            {summary.map((sm) => (
              <Card key={sm.loc} className="px-4 py-3.5 flex items-center justify-between">
                <span className="text-sm text-slate-200 font-medium">{locLabels[sm.loc]}</span>
                <span className="text-xs">
                  <span className="text-emerald-300">{sm.rcvd} {t.received}</span>
                  <span className="text-slate-700 mx-2">·</span>
                  <span className="text-indigo-300">{sm.sent} {t.sent}</span>
                </span>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs font-medium tracking-wide text-slate-500 uppercase mb-3">{t.log}</div>
      <Card className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: "760px" }}>
          <thead className="bg-white/5">
            <tr>
              <Th>{t.colId}</Th>
              <Th>{t.colProduct}</Th>
              <Th>{t.colBatch}</Th>
              <Th>{t.colQty}</Th>
              <Th>{t.colFrom}</Th>
              <Th>{t.colTo}</Th>
              <Th>{t.colDate}</Th>
              <Th>{t.colStatus}</Th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((tr) => (
              <tr key={tr.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                <Td className="text-indigo-300 font-mono font-medium text-xs">{tr.id}</Td>
                <Td className="text-slate-100">{tr.product}</Td>
                <Td className="text-slate-500 font-mono text-xs">{tr.batch}</Td>
                <Td>{tr.qty}</Td>
                <Td className="text-slate-500">{locLabels[tr.from]}</Td>
                <Td className="text-slate-500">{locLabels[tr.to]}</Td>
                <Td className="text-slate-500">{fmtDate(tr.date, lang)}</Td>
                <Td>
                  <Badge tone={tr.status === "completed" ? "paid" : "pending"}>
                    {tr.status === "completed" ? st.transferCompleted : st.transferPending}
                  </Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ----------------------------- shell ----------------------------- */

const NAV_ICONS = {
  create: Plus,
  pending: RotateCw,
  history: CheckCircle2,
  expired: XCircle,
  stock: ArrowUpDown,
  transfer: ArrowLeftRight,
};
const NAV_ORDER = ["create", "pending", "history", "expired", "stock", "transfer"];

function LanguageSwitcher({ lang, setLang }) {
  return (
    <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
      {LANGS.map((l) => (
        <button
          key={l.key}
          onClick={() => setLang(l.key)}
          className={`text-xs font-semibold px-2 py-1 rounded-md transition-colors ${
            lang === l.key ? "bg-indigo-500 text-white" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("sw");
  const [view, setView] = useState("create");
  const [bills, setBills] = useState(seedBills);
  const [inventory, setInventory] = useState(seedInventory);
  const [transfers, setTransfers] = useState(seedTransfers);
  const [auditLog, setAuditLog] = useState(seedAudit);
  const [showHelp, setShowHelp] = useState(false);

  const s = STRINGS[lang];

  const pendingCount = bills.filter((b) => b.status === "pending").length;
  const expiredStockCount = inventory.filter((it) => daysBetween(it.expiry, TODAY) < 0).length;
  const expiringSoonCount = inventory.filter((it) => {
    const d = daysBetween(it.expiry, TODAY);
    return d >= 0 && d <= 90;
  }).length;

  const addAudit = (action, detail) => {
    setAuditLog((log) => [{ id: nextId(), date: TODAY, action, detail }, ...log]);
  };

  const handleGenerateBill = (data) => {
    const invoice = "INV-" + String(2000 + bills.length).padStart(4, "0");
    setBills((bs) => [
      { id: nextId(), invoice, customer: data.customer, phone: data.phone, items: data.items, created: TODAY, due: data.due, paid: null, status: "pending" },
      ...bs,
    ]);
    addAudit("newTransaction", `${invoice} · ${data.customer} · ${fmtTZS(data.items.reduce((s2, it) => s2 + it.qty * it.unitPrice, 0))}`);
    setView("pending");
  };

  const handleMarkPaid = (id) => {
    setBills((bs) => bs.map((b) => (b.id === id ? { ...b, status: "paid", paid: TODAY } : b)));
  };

  const handleStockChange = ({ type, product, batch, qty, supplier }) => {
    setInventory((inv) => {
      if (type === "in") {
        const existing = inv.find((it) => it.batch === batch);
        if (existing) {
          return inv.map((it) => (it.batch === batch ? { ...it, qty: it.qty + qty } : it));
        }
        return [
          ...inv,
          { id: nextId(), product, batch, qty, unitPrice: 0, received: TODAY, expiry: "2028-01-01", supplier },
        ];
      }
      return inv.map((it) => (it.batch === batch ? { ...it, qty: Math.max(0, it.qty - qty) } : it));
    });
  };

  const handleSubmitTransfer = ({ product, batch, qty, from, to }) => {
    const id = "TR-" + String(transfers.length + 1).padStart(3, "0");
    setTransfers((ts) => [{ id, product, batch, qty, from, to, date: TODAY, status: "pending" }, ...ts]);
    addAudit("transfer", `${id} · ${product} · ${batch} · ${qty} ${from} → ${to}`);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, s }}>
      <div className="w-full min-h-screen bg-slate-950">
        <style>{`
          html, body, #root { background-color: #020617; margin: 0; padding: 0; height: 100%; width: 100%; }
          * { box-sizing: border-box; }
        `}</style>
        <div className="w-full min-h-screen bg-slate-950 text-slate-200 font-sans flex antialiased overflow-x-hidden">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 border-r border-white/10 flex flex-col justify-between min-h-screen bg-slate-950">
            <div>
              <div className="px-5 pt-6 pb-5 border-b border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  B
                </div>
                <div>
                  <div className="text-base font-semibold text-slate-50 tracking-tight leading-tight">BillManager</div>
                  <div className="text-xs text-slate-600 mt-0.5">{s.appVersion}</div>
                </div>
              </div>
              <div className="px-5 pt-4">
                <LanguageSwitcher lang={lang} setLang={setLang} />
              </div>
              <nav className="px-3 py-4 space-y-1">
                {NAV_ORDER.map((key) => {
                  const Icon = NAV_ICONS[key];
                  const active = view === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setView(key)}
                      className={`relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        active ? "bg-indigo-500/20 text-indigo-200 font-medium" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      }`}
                    >
                      {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-indigo-400" />}
                      <Icon size={16} strokeWidth={active ? 2.3 : 2} />
                      <span className="flex-1 text-left">{s.nav[key]}</span>
                      {key === "pending" && pendingCount > 0 && (
                        <span className="bg-amber-400/20 text-amber-300 text-xs font-semibold px-1.5 py-0.5 rounded-md min-w-5 text-center">
                          {pendingCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="mx-4 mb-5 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                {s.sidebar.expired(expiredStockCount)}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {s.sidebar.soon(expiringSoonCount)}
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0 px-8 py-8 max-w-6xl relative bg-slate-950">
            {view === "create" && <CreateBillView inventory={inventory} onGenerate={handleGenerateBill} />}
            {view === "pending" && <PendingBillsView bills={bills} onMarkPaid={handleMarkPaid} />}
            {view === "history" && <PaymentHistoryView bills={bills} />}
            {view === "expired" && <ExpiredBillsView bills={bills} />}
            {view === "stock" && (
              <StockManagementView inventory={inventory} onStockChange={handleStockChange} auditLog={auditLog} addAudit={addAudit} />
            )}
            {view === "transfer" && <TransferView inventory={inventory} transfers={transfers} onSubmitTransfer={handleSubmitTransfer} />}
          </main>

          {/* Help button */}
          <div className="fixed bottom-6 right-6 z-10">
            {showHelp && (
              <div className="mb-3 w-72 bg-slate-900 border border-white/10 rounded-2xl p-4 shadow-2xl text-xs text-slate-400 space-y-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-100 font-semibold text-sm">{s.help.title}</span>
                  <button onClick={() => setShowHelp(false)} className="text-slate-500 hover:text-slate-300">
                    <X size={14} />
                  </button>
                </div>
                <p>{s.help.l1()}</p>
                <p>{s.help.l2()}</p>
                <p>{s.help.l3}</p>
              </div>
            )}
            <button
              onClick={() => setShowHelp((v) => !v)}
              className="w-11 h-11 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-indigo-300 hover:border-indigo-400/40 shadow-lg transition-colors"
            >
              <HelpCircle size={18} />
            </button>
          </div>
        </div>
      </div>
    </LangContext.Provider>
  );
}
