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
  CreditCard,
  Copy,
  Send,
  MessageCircle,
  Search,
  Check,
  Menu,
  LogOut,
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
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


/* ---- Bill + control number + customer payment texts ---- */
const PAY_CHANNELS = ["M-Pesa", "Tigo Pesa", "Airtel Money", "HaloPesa", "CRDB Bank", "NMB Bank"];

const BILL_TEXT = {
  sw: {
    nav: { create: "Tengeneza Bili", pay: "Lipa Bili" },
    create: {
      title: "Tengeneza Bili",
      subtitle: "Bili mpya ya mteja yenye vipengele vya bidhaa. Control Number itatengenezwa kiotomatiki.",
      generate: "Tengeneza Bili",
    },
    pending: { colControl: "Control Number" },
    actions: { newTransaction: "Bili Mpya", billSent: "Bili Imetumwa", payment: "Malipo" },
    help: {
      l1: () => <>Tumia <b>Tengeneza Bili</b> kutengeneza bili ya mteja na kupata Control Number.</>,
      l2: () => <>Mteja analipa kupitia <b>Lipa Bili</b> kwa kutumia Control Number.</>,
    },
    bill: {
      createdTitle: "Bili Imetengenezwa",
      createdSub: "Mtumie mteja Control Number ili aweze kulipa.",
      controlLabel: "Control Number",
      customer: "Mteja",
      amount: "Kiasi",
      due: "Tarehe ya Mwisho",
      messageLabel: "Ujumbe kwa mteja",
      sendSms: "Tuma kwa SMS",
      sendWhatsapp: "Tuma kwa WhatsApp",
      copyNumber: "Nakili Namba",
      copyMessage: "Nakili Ujumbe",
      copied: "Imenakiliwa",
      sent: "Imetumwa",
      done: "Maliza",
      note: "SMS na WhatsApp hufunguka kwenye kifaa chako ili ubonyeze Tuma. Hakuna ujumbe unaotumwa kiotomatiki bila wewe.",
      message: (name, amount, control, due) =>
        `Habari ${name}, bili yako ya ${amount} imetengenezwa. Control Number: ${control}. Tumia namba hii kulipa kabla ya ${due}. Asante. - BillManager`,
    },
    pay: {
      title: "Lipa Bili",
      subtitle: "Mteja huweka Control Number kuangalia na kulipa bili yake",
      demo: "Hali ya majaribio: hakuna pesa halisi inayohamishwa. Malipo halisi yanahitaji kuunganishwa na mtoa huduma wa malipo (mfano GePG, Selcom au AzamPay).",
      controlLabel: "Control Number",
      controlPlaceholder: "Weka namba 12 za Control Number",
      find: "Tafuta Bili",
      notFound: "Control Number hii haipo. Hakikisha namba ni sahihi.",
      details: "Maelezo ya Bili",
      customer: "Mteja",
      items: "Bidhaa",
      total: "Jumla",
      due: "Tarehe ya Mwisho",
      status: "Hali",
      alreadyPaid: (d) => `Bili hii tayari imelipwa tarehe ${d}.`,
      expiredMsg: "Bili hii imeisha muda na haiwezi kulipwa tena. Wasiliana na muuzaji.",
      chooseChannel: "Chagua njia ya kulipa",
      accountLabel: "Namba ya simu / akaunti",
      payButton: (amt) => `Lipa ${amt}`,
      errChannel: "Chagua njia ya kulipa na weka namba ya simu au akaunti.",
      confirmTitle: "Thibitisha Malipo",
      confirmText: (ch, acc) => `Ombi la malipo la ${ch} limetumwa kwa ${acc}. Ingiza PIN kwenye simu yako kuthibitisha.`,
      confirmButton: "Nimethibitisha Malipo (Jaribio)",
      cancel: "Ghairi",
      doneTitle: "Malipo Yamefanikiwa",
      receipt: "Namba ya Risiti",
      paidVia: "Njia ya malipo",
      newPayment: "Lipa Bili Nyingine",
    },
  },
  en: {
    nav: { create: "Create Bill", pay: "Pay Bill" },
    create: {
      title: "Create Bill",
      subtitle: "New customer bill with product line items. A control number is generated automatically.",
      generate: "Create Bill",
    },
    pending: { colControl: "Control Number" },
    actions: { newTransaction: "New Bill", billSent: "Bill Sent", payment: "Payment" },
    help: {
      l1: () => <>Use <b>Create Bill</b> to bill a customer and get a Control Number.</>,
      l2: () => <>The customer pays through <b>Pay Bill</b> using the Control Number.</>,
    },
    bill: {
      createdTitle: "Bill Created",
      createdSub: "Send the customer this Control Number so they can pay.",
      controlLabel: "Control Number",
      customer: "Customer",
      amount: "Amount",
      due: "Due Date",
      messageLabel: "Message to customer",
      sendSms: "Send by SMS",
      sendWhatsapp: "Send by WhatsApp",
      copyNumber: "Copy Number",
      copyMessage: "Copy Message",
      copied: "Copied",
      sent: "Sent",
      done: "Done",
      note: "SMS and WhatsApp open on your device so you can press Send. Nothing is sent automatically without you.",
      message: (name, amount, control, due) =>
        `Hello ${name}, your bill of ${amount} has been created. Control Number: ${control}. Use this number to pay before ${due}. Thank you. - BillManager`,
    },
    pay: {
      title: "Pay Bill",
      subtitle: "The customer enters the Control Number to view and pay their bill",
      demo: "Demo mode: no real money moves. Real payments need a payment provider connection (for example GePG, Selcom or AzamPay).",
      controlLabel: "Control Number",
      controlPlaceholder: "Enter the 12-digit Control Number",
      find: "Find Bill",
      notFound: "This Control Number was not found. Please check the number.",
      details: "Bill Details",
      customer: "Customer",
      items: "Items",
      total: "Total",
      due: "Due Date",
      status: "Status",
      alreadyPaid: (d) => `This bill was already paid on ${d}.`,
      expiredMsg: "This bill has expired and can no longer be paid. Please contact the seller.",
      chooseChannel: "Choose how to pay",
      accountLabel: "Phone number / account",
      payButton: (amt) => `Pay ${amt}`,
      errChannel: "Choose a payment method and enter a phone number or account.",
      confirmTitle: "Confirm Payment",
      confirmText: (ch, acc) => `A ${ch} payment request was sent to ${acc}. Enter your PIN on your phone to confirm.`,
      confirmButton: "I Confirmed the Payment (Demo)",
      cancel: "Cancel",
      doneTitle: "Payment Successful",
      receipt: "Receipt Number",
      paidVia: "Paid via",
      newPayment: "Pay Another Bill",
    },
  },
  fr: {
    nav: { create: "Créer une Facture", pay: "Payer une Facture" },
    create: {
      title: "Créer une Facture",
      subtitle: "Nouvelle facture client avec des articles. Un numéro de contrôle est généré automatiquement.",
      generate: "Créer la Facture",
    },
    pending: { colControl: "N° de Contrôle" },
    actions: { newTransaction: "Nouvelle Facture", billSent: "Facture Envoyée", payment: "Paiement" },
    help: {
      l1: () => <>Utilisez <b>Créer une Facture</b> pour facturer un client et obtenir un numéro de contrôle.</>,
      l2: () => <>Le client paie via <b>Payer une Facture</b> avec le numéro de contrôle.</>,
    },
    bill: {
      createdTitle: "Facture Créée",
      createdSub: "Envoyez ce numéro de contrôle au client pour qu'il puisse payer.",
      controlLabel: "N° de Contrôle",
      customer: "Client",
      amount: "Montant",
      due: "Date d'Échéance",
      messageLabel: "Message au client",
      sendSms: "Envoyer par SMS",
      sendWhatsapp: "Envoyer par WhatsApp",
      copyNumber: "Copier le Numéro",
      copyMessage: "Copier le Message",
      copied: "Copié",
      sent: "Envoyé",
      done: "Terminer",
      note: "SMS et WhatsApp s'ouvrent sur votre appareil pour que vous appuyiez sur Envoyer. Rien n'est envoyé automatiquement sans vous.",
      message: (name, amount, control, due) =>
        `Bonjour ${name}, votre facture de ${amount} a été créée. N° de contrôle : ${control}. Utilisez ce numéro pour payer avant le ${due}. Merci. - BillManager`,
    },
    pay: {
      title: "Payer une Facture",
      subtitle: "Le client saisit le numéro de contrôle pour consulter et payer sa facture",
      demo: "Mode démo : aucun argent réel n'est déplacé. Les vrais paiements nécessitent une connexion à un prestataire de paiement (par exemple GePG, Selcom ou AzamPay).",
      controlLabel: "N° de Contrôle",
      controlPlaceholder: "Saisissez le numéro de contrôle à 12 chiffres",
      find: "Rechercher la Facture",
      notFound: "Ce numéro de contrôle est introuvable. Vérifiez le numéro.",
      details: "Détails de la Facture",
      customer: "Client",
      items: "Articles",
      total: "Total",
      due: "Date d'Échéance",
      status: "Statut",
      alreadyPaid: (d) => `Cette facture a déjà été payée le ${d}.`,
      expiredMsg: "Cette facture a expiré et ne peut plus être payée. Contactez le vendeur.",
      chooseChannel: "Choisissez le mode de paiement",
      accountLabel: "Numéro de téléphone / compte",
      payButton: (amt) => `Payer ${amt}`,
      errChannel: "Choisissez un mode de paiement et saisissez un numéro de téléphone ou de compte.",
      confirmTitle: "Confirmer le Paiement",
      confirmText: (ch, acc) => `Une demande de paiement ${ch} a été envoyée à ${acc}. Saisissez votre code PIN sur votre téléphone pour confirmer.`,
      confirmButton: "J'ai Confirmé le Paiement (Démo)",
      cancel: "Annuler",
      doneTitle: "Paiement Réussi",
      receipt: "Numéro de Reçu",
      paidVia: "Payé via",
      newPayment: "Payer une Autre Facture",
    },
  },
};

Object.keys(BILL_TEXT).forEach((l) => {
  const o = BILL_TEXT[l];
  STRINGS[l].nav = { ...STRINGS[l].nav, ...o.nav };
  STRINGS[l].create = { ...STRINGS[l].create, ...o.create };
  STRINGS[l].pending = { ...STRINGS[l].pending, ...o.pending };
  STRINGS[l].help = { ...STRINGS[l].help, ...o.help };
  STRINGS[l].bill = o.bill;
  STRINGS[l].pay = o.pay;
  Object.assign(ACTION_LABELS[l], o.actions);
});


/* ---- Swahili wording fixes ---- */
Object.assign(STRINGS.sw.nav, { pending: "Miamala Inayosubiri Malipo", expired: "Miamala Iliyoisha Muda", stock: "Ingiza / Toa Bidhaa" });
Object.assign(STRINGS.sw.pending, {
  title: "Miamala Inayosubiri Malipo",
  subtitle: (p, o) => `${p} inasubiri · ${o} imechelewa`,
  statPending: "Inayosubiri",
  statOverdue: "Imechelewa",
  subOverdue: "imepita tarehe",
});
Object.assign(STRINGS.sw.history, { statPaid: "Miamala Iliyolipwa" });
Object.assign(STRINGS.sw.expired, {
  title: "Miamala Iliyoisha Muda",
  subtitle: "Miamala iliyopita kikomo cha muda wa kudai",
  statExpired: "Iliyoisha Muda",
});
Object.assign(STRINGS.sw.stock, {
  tabStockIn: "Ingiza Bidhaa",
  tabStockOut: "Toa Bidhaa",
  registerIn: "Ingiza Bidhaa",
  registerOut: "Toa Bidhaa",
  colBatch: "Namba ya Bachi",
});
Object.assign(STRINGS.sw.create, { colBatch: "Namba ya Bachi" });
Object.assign(STRINGS.sw.transfer, { batchLabel: "Namba ya Bachi", colBatch: "Bachi" });
Object.assign(ACTION_LABELS.sw, { stockIn: "Ingiza Bidhaa", stockOut: "Toa Bidhaa" });

/* ---- Sign in (owner / seller) ---- */
const AUTH_TEXT = {
  sw: {
    auth: {
      title: "Karibu BillManager",
      subtitle: "Ingia ili kuendelea",
      roleLabel: "Ingia kama",
      owner: "Mmiliki",
      ownerDesc: "Ufikiaji wa kila kitu",
      seller: "Muuzaji",
      sellerDesc: "Bili, malipo na historia",
      pin: "PIN ya Siri",
      pinPlaceholder: "Weka PIN yako",
      signIn: "Ingia",
      errPin: "PIN si sahihi. Jaribu tena.",
      customerLink: "Wewe ni mteja? Lipa bili yako",
      back: "Rudi kwenye kuingia",
      logout: "Toka",
      ownerOnly: "Ukurasa huu ni wa mmiliki pekee.",
    },
    tabs: { create: "Bili", pending: "Miamala", pay: "Lipa", more: "Zaidi" },
  },
  en: {
    auth: {
      title: "Welcome to BillManager",
      subtitle: "Sign in to continue",
      roleLabel: "Sign in as",
      owner: "Owner",
      ownerDesc: "Full access",
      seller: "Seller",
      sellerDesc: "Bills, payments and history",
      pin: "Secret PIN",
      pinPlaceholder: "Enter your PIN",
      signIn: "Sign in",
      errPin: "Wrong PIN. Try again.",
      customerLink: "Are you a customer? Pay your bill",
      back: "Back to sign in",
      logout: "Log out",
      ownerOnly: "This page is for the owner only.",
    },
    tabs: { create: "Bill", pending: "Pending", pay: "Pay", more: "More" },
  },
  fr: {
    auth: {
      title: "Bienvenue sur BillManager",
      subtitle: "Connectez-vous pour continuer",
      roleLabel: "Se connecter en tant que",
      owner: "Propriétaire",
      ownerDesc: "Accès complet",
      seller: "Vendeur",
      sellerDesc: "Factures, paiements et historique",
      pin: "Code PIN secret",
      pinPlaceholder: "Saisissez votre PIN",
      signIn: "Se connecter",
      errPin: "PIN incorrect. Réessayez.",
      customerLink: "Vous êtes client ? Payez votre facture",
      back: "Retour à la connexion",
      logout: "Déconnexion",
      ownerOnly: "Cette page est réservée au propriétaire.",
    },
    tabs: { create: "Facture", pending: "En attente", pay: "Payer", more: "Plus" },
  },
};
Object.keys(AUTH_TEXT).forEach((l) => {
  STRINGS[l].auth = AUTH_TEXT[l].auth;
  STRINGS[l].tabs = AUTH_TEXT[l].tabs;
});

/* ---- Accounts (owner PIN + sellers) texts ---- */
const AUTH2 = {
  sw: {
    navUsers: "Watumiaji",
    auth: {
      errPinFor: (who) => `PIN si sahihi kwa ${who}. Kila akaunti ina PIN yake.`,
      errLen: "PIN iwe tarakimu 4 hadi 8 pekee.",
      errMatch: "PIN hazilingani.",
      noSellers: "Bado hakuna muuzaji. Mmiliki aingie kwanza na kuongeza muuzaji kwenye ukurasa wa Watumiaji.",
      pickSeller: "Chagua jina lako",
      setupTitle: "Anzisha Akaunti ya Mmiliki",
      setupSub: "Weka PIN ya siri (tarakimu 4 hadi 8). Utaitumia kila unapoingia.",
      pinNew: "PIN Mpya",
      pinConfirm: "Rudia PIN",
      setupBtn: "Hifadhi na Endelea",
      forgot: "Umesahau PIN? Futa data ya tovuti hii kwenye kivinjari ili kuanza upya.",
    },
    users: {
      title: "Watumiaji",
      subtitle: "Dhibiti PIN ya mmiliki na akaunti za wauzaji",
      deviceNote: "Akaunti zinahifadhiwa kwenye kifaa hiki pekee. Ili wauzaji waingie kutoka simu zao wenyewe, tutahitaji hifadhi ya mtandaoni (database).",
      ownerPin: "PIN ya Mmiliki",
      currentPin: "PIN ya sasa",
      newPin: "PIN mpya",
      confirmPin: "Rudia PIN mpya",
      changePin: "Badilisha PIN",
      pinChanged: "PIN imebadilishwa.",
      wrongCurrent: "PIN ya sasa si sahihi.",
      sellers: "Wauzaji",
      noneYet: "Hakuna wauzaji bado. Ongeza wa kwanza hapa chini.",
      addSeller: "Ongeza Muuzaji",
      sellerName: "Jina la Muuzaji",
      sellerNamePh: "Mfano: Asha",
      sellerPin: "PIN ya Muuzaji",
      add: "Ongeza",
      nameRequired: "Weka jina la muuzaji.",
      nameExists: "Jina hili tayari lipo.",
      sellerAdded: "Muuzaji ameongezwa.",
      saved: "PIN imehifadhiwa.",
      editPin: "Badilisha PIN",
      save: "Hifadhi",
      cancel: "Ghairi",
      remove: "Futa",
      confirmRemove: "Bonyeza tena kufuta",
    },
  },
  en: {
    navUsers: "Users",
    auth: {
      errPinFor: (who) => `Wrong PIN for ${who}. Each account has its own PIN.`,
      errLen: "The PIN must be 4 to 8 digits only.",
      errMatch: "The PINs do not match.",
      noSellers: "There is no seller yet. The owner must sign in first and add a seller on the Users page.",
      pickSeller: "Choose your name",
      setupTitle: "Set Up the Owner Account",
      setupSub: "Choose a secret PIN (4 to 8 digits). You will use it every time you sign in.",
      pinNew: "New PIN",
      pinConfirm: "Repeat PIN",
      setupBtn: "Save and Continue",
      forgot: "Forgot the PIN? Clear this site's data in your browser to start over.",
    },
    users: {
      title: "Users",
      subtitle: "Manage the owner PIN and seller accounts",
      deviceNote: "Accounts are saved on this device only. For sellers to sign in from their own phones, we will need an online database.",
      ownerPin: "Owner PIN",
      currentPin: "Current PIN",
      newPin: "New PIN",
      confirmPin: "Repeat new PIN",
      changePin: "Change PIN",
      pinChanged: "PIN changed.",
      wrongCurrent: "The current PIN is wrong.",
      sellers: "Sellers",
      noneYet: "No sellers yet. Add the first one below.",
      addSeller: "Add Seller",
      sellerName: "Seller Name",
      sellerNamePh: "e.g. Asha",
      sellerPin: "Seller PIN",
      add: "Add",
      nameRequired: "Enter the seller's name.",
      nameExists: "This name already exists.",
      sellerAdded: "Seller added.",
      saved: "PIN saved.",
      editPin: "Change PIN",
      save: "Save",
      cancel: "Cancel",
      remove: "Delete",
      confirmRemove: "Tap again to delete",
    },
  },
  fr: {
    navUsers: "Utilisateurs",
    auth: {
      errPinFor: (who) => `PIN incorrect pour ${who}. Chaque compte a son propre PIN.`,
      errLen: "Le PIN doit comporter 4 à 8 chiffres uniquement.",
      errMatch: "Les PIN ne correspondent pas.",
      noSellers: "Aucun vendeur pour le moment. Le propriétaire doit d'abord se connecter et ajouter un vendeur dans la page Utilisateurs.",
      pickSeller: "Choisissez votre nom",
      setupTitle: "Créer le Compte Propriétaire",
      setupSub: "Choisissez un PIN secret (4 à 8 chiffres). Vous l'utiliserez à chaque connexion.",
      pinNew: "Nouveau PIN",
      pinConfirm: "Répétez le PIN",
      setupBtn: "Enregistrer et Continuer",
      forgot: "PIN oublié ? Effacez les données de ce site dans votre navigateur pour recommencer.",
    },
    users: {
      title: "Utilisateurs",
      subtitle: "Gérez le PIN du propriétaire et les comptes vendeurs",
      deviceNote: "Les comptes sont enregistrés sur cet appareil uniquement. Pour que les vendeurs se connectent depuis leur téléphone, il faudra une base de données en ligne.",
      ownerPin: "PIN du Propriétaire",
      currentPin: "PIN actuel",
      newPin: "Nouveau PIN",
      confirmPin: "Répétez le nouveau PIN",
      changePin: "Changer le PIN",
      pinChanged: "PIN modifié.",
      wrongCurrent: "Le PIN actuel est incorrect.",
      sellers: "Vendeurs",
      noneYet: "Aucun vendeur pour le moment. Ajoutez le premier ci-dessous.",
      addSeller: "Ajouter un Vendeur",
      sellerName: "Nom du Vendeur",
      sellerNamePh: "ex : Asha",
      sellerPin: "PIN du Vendeur",
      add: "Ajouter",
      nameRequired: "Saisissez le nom du vendeur.",
      nameExists: "Ce nom existe déjà.",
      sellerAdded: "Vendeur ajouté.",
      saved: "PIN enregistré.",
      editPin: "Changer le PIN",
      save: "Enregistrer",
      cancel: "Annuler",
      remove: "Supprimer",
      confirmRemove: "Touchez à nouveau pour supprimer",
    },
  },
};
Object.keys(AUTH2).forEach((l) => {
  STRINGS[l].nav = { ...STRINGS[l].nav, users: AUTH2[l].navUsers };
  STRINGS[l].auth = { ...STRINGS[l].auth, ...AUTH2[l].auth };
  STRINGS[l].users = AUTH2[l].users;
});

/* ---- Seller restrictions + easier "add seller" texts ---- */
const AUTH3 = {
  sw: {
    navUsers: "Wauzaji",
    users: {
      title: "Wauzaji na PIN",
      subtitle: "Ongeza wauzaji, badilisha PIN zao na PIN yako",
      sellerAdded: "Muuzaji ameongezwa. Sasa anaweza kuingia mwenyewe kwa jina lake na PIN yake.",
      noSellerBanner: "Bado hujaongeza muuzaji. Ongeza muuzaji ili aingie na kuuza kwa PIN yake mwenyewe.",
    },
    create: {
      sellerNote: "Bei, namba ya bachi na tarehe ya kuisha hujazwa na mfumo. Mmiliki pekee ndiye anaweza kubadilisha bei au bidhaa.",
      noStock: "Hakuna bidhaa zinazopatikana kuuzwa kwa sasa.",
      pickProduct: "Chagua bidhaa",
    },
  },
  en: {
    navUsers: "Sellers",
    users: {
      title: "Sellers & PINs",
      subtitle: "Add sellers, and change their PINs and your own",
      sellerAdded: "Seller added. They can now sign in on their own with their name and PIN.",
      noSellerBanner: "You haven't added a seller yet. Add one so they can sign in and sell with their own PIN.",
    },
    create: {
      sellerNote: "Price, batch number and expiry are filled in by the system. Only the owner can change prices or products.",
      noStock: "No products are available to sell right now.",
      pickProduct: "Choose a product",
    },
  },
  fr: {
    navUsers: "Vendeurs",
    users: {
      title: "Vendeurs et PIN",
      subtitle: "Ajoutez des vendeurs, et modifiez leurs PIN et le vôtre",
      sellerAdded: "Vendeur ajouté. Il peut maintenant se connecter seul avec son nom et son PIN.",
      noSellerBanner: "Vous n'avez pas encore ajouté de vendeur. Ajoutez-en un pour qu'il se connecte et vende avec son propre PIN.",
    },
    create: {
      sellerNote: "Le prix, le numéro de lot et l'expiration sont remplis par le système. Seul le propriétaire peut modifier les prix ou les produits.",
      noStock: "Aucun produit disponible à la vente pour le moment.",
      pickProduct: "Choisissez un produit",
    },
  },
};
Object.keys(AUTH3).forEach((l) => {
  STRINGS[l].nav = { ...STRINGS[l].nav, users: AUTH3[l].navUsers };
  STRINGS[l].users = { ...STRINGS[l].users, ...AUTH3[l].users };
  STRINGS[l].create = { ...STRINGS[l].create, ...AUTH3[l].create };
});

/* Accounts live in this browser (localStorage). They are NOT encrypted and are
   NOT shared between devices; real security needs a backend (e.g. Supabase Auth). */
const ACCOUNTS_KEY = "bm_accounts_v1";
const SESSION_KEY = "bm_session_v1";
function loadAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) {
      const a = JSON.parse(raw);
      if (a && a.owner && /^\d{4,8}$/.test(a.owner.pin) && Array.isArray(a.sellers)) return a;
    }
  } catch (e) {
    /* storage unavailable */
  }
  return null;
}
function saveAccounts(a) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(a));
  } catch (e) {
    /* storage unavailable: accounts stay in memory for this visit */
  }
}
const ROLE_ACCESS = {
  owner: ["create", "pending", "pay", "history", "expired", "stock", "transfer", "users"],
  seller: ["create", "pending", "pay", "history"],
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

const SEED_CONTROLS = {
  "INV-1256": "991100256001",
  "INV-0041": "991100041002",
  "INV-0040": "991100040003",
  "INV-0038": "991100038004",
  "INV-0033": "991100033005",
  "INV-0035": "991100035006",
};
seedBills.forEach((b) => {
  b.control = SEED_CONTROLS[b.invoice];
  b.sent = true;
});

function genControl(existing) {
  let c;
  do {
    c = "99" + String(Math.floor(Math.random() * 1e10)).padStart(10, "0");
  } while (existing.includes(c));
  return c;
}

function fmtControl(c) {
  return c ? c.replace(/(\d{4})(?=\d)/g, "$1 ") : "—";
}

function phoneDigits(p) {
  const d = String(p).replace(/\D/g, "");
  return d.startsWith("0") ? "255" + d.slice(1) : d;
}

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
  pending: { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-200", dot: "bg-amber-400" },
  overdue: { bg: "bg-rose-100", text: "text-rose-700", ring: "ring-rose-200", dot: "bg-rose-400" },
  paid: { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-200", dot: "bg-emerald-400" },
  expired: { bg: "bg-rose-100", text: "text-rose-700", ring: "ring-rose-200", dot: "bg-rose-400" },
  neutral: { bg: "bg-slate-100", text: "text-slate-700", ring: "ring-slate-200", dot: "bg-slate-400" },
  info: { bg: "bg-sky-100", text: "text-sky-700", ring: "ring-sky-200", dot: "bg-sky-400" },
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
    tone === "danger" ? "text-rose-700" : tone === "warn" ? "text-amber-700" : tone === "accent" ? "text-violet-700" : "text-slate-900";
  const iconBg =
    tone === "danger" ? "bg-rose-100 text-rose-700" : tone === "warn" ? "bg-amber-100 text-amber-700" : "bg-violet-100 text-violet-700";
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 md:px-5 md:py-4 shadow-md hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</div>
        {Icon && (
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
            <Icon size={14} />
          </div>
        )}
      </div>
      <div className={`text-lg md:text-2xl leading-tight font-semibold tracking-tight break-words ${toneCls}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1.5">{sub}</div>}
    </div>
  );
}

function PageHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-5 pb-4 md:mb-7 md:pb-6 border-b border-slate-200 flex items-start gap-3 md:gap-4">
      {Icon && (
        <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center ring-1 ring-violet-200 shrink-0">
          <Icon size={20} />
        </div>
      )}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">{title}</h1>
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
  return <td className={`px-4 py-3.5 text-sm text-slate-700 ${className}`}>{children}</td>;
}

function Card({ children, className = "" }) {
  return <div className={`bg-white border border-slate-200 rounded-2xl ${className}`}>{children}</div>;
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
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200 transition-colors";

function PrimaryButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

/* ----------------------------- views ----------------------------- */

function ReadBox({ children, mono }) {
  return (
    <div className={`w-full bg-slate-100 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-600 ${mono ? "font-mono" : ""}`}>
      {children}
    </div>
  );
}

function CreateBillView({ inventory, onGenerate }) {
  const { lang, s, user } = useLang();
  const isSeller = !!user && user.role === "seller";
  const t = s.create;
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [rows, setRows] = useState([{ rid: 1, product: "", batch: "BT-0000", qty: 1, unitPrice: 0, expiry: "" }]);
  const [error, setError] = useState("");

  // Sellers may only sell in-date stock that is available; oldest first.
  const sellable = useMemo(
    () =>
      [...inventory]
        .filter((it) => it.qty > 0 && daysBetween(it.expiry, TODAY) >= 0)
        .sort((a, b) => parseDate(a.received) - parseDate(b.received)),
    [inventory]
  );
  const oldestStock = useMemo(
    () => (isSeller ? sellable : [...inventory].sort((a, b) => parseDate(a.received) - parseDate(b.received))).slice(0, 4),
    [inventory, sellable, isSeller]
  );

  const pickProduct = (rid, invId) => {
    const it = inventory.find((x) => String(x.id) === String(invId));
    if (!it) {
      updateRow(rid, { product: "", batch: "BT-0000", unitPrice: 0, expiry: "", invId: null, qty: 1 });
      return;
    }
    updateRow(rid, { product: it.product, batch: it.batch, unitPrice: it.unitPrice, expiry: it.expiry, invId: it.id, qty: 1 });
  };
  const updateQty = (rid, value) => {
    const row = rows.find((r) => r.rid === rid);
    let v = value;
    if (isSeller && row && row.invId) {
      const it = inventory.find((x) => x.id === row.invId);
      if (it && Number(v) > it.qty) v = String(it.qty);
    }
    updateRow(rid, { qty: v });
  };
  const productSelect = (r, cls) => (
    <select value={r.invId || ""} onChange={(e) => pickProduct(r.rid, e.target.value)} className={cls}>
      <option value="">{t.pickProduct}</option>
      {sellable.map((it) => (
        <option key={it.id} value={it.id}>
          {it.product} · {it.batch} ({it.qty})
        </option>
      ))}
    </select>
  );

  const updateRow = (rid, patch) => setRows((rs) => rs.map((r) => (r.rid === rid ? { ...r, ...patch } : r)));
  const addRow = () => setRows((rs) => [...rs, { rid: Date.now(), product: "", batch: "BT-0000", qty: 1, unitPrice: 0, expiry: "" }]);
  const removeRow = (rid) => setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.rid !== rid) : rs));

  const applySuggestion = (item) => {
    const emptyIdx = rows.findIndex((r) => !r.product);
    const patch = { product: item.product, batch: item.batch, unitPrice: item.unitPrice, expiry: item.expiry, invId: item.id };
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
    const validRows = rows.filter((r) => r.product.trim() && Number(r.qty) > 0 && (!isSeller || r.invId));
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

      {isSeller && (
        <div className="mb-5 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 text-xs text-violet-900">{t.sellerNote}</div>
      )}

      <Card className="p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={14} className="text-amber-700" />
          <div className="text-xs font-medium tracking-wide text-slate-500 uppercase">{t.suggestTitle}</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {oldestStock.map((it) => (
            <button
              key={it.id}
              onClick={() => applySuggestion(it)}
              className="text-left bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-300 rounded-xl px-3.5 py-2.5 text-xs transition-all"
            >
              <span className="font-semibold text-amber-800">{it.product}</span>
              <span className="text-amber-700/70"> · {it.batch} · {t.received} {fmtDate(it.received, lang)}</span>
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

      {isSeller && sellable.length === 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">{t.noStock}</div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-medium tracking-wide text-slate-500 uppercase">{t.lineItems}</div>
        <GhostButton onClick={addRow}>
          <Plus size={14} /> {t.addRow}
        </GhostButton>
      </div>

      <Card className="hidden md:block overflow-hidden mb-2">
        <table className="w-full">
          <thead className="bg-slate-100">
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
              <tr key={r.rid} className="border-t border-slate-200">
                <Td>
                  {isSeller ? (
                    productSelect(r, "w-full bg-transparent text-slate-800 outline-none")
                  ) : (
                    <input
                      value={r.product}
                      onChange={(e) => updateRow(r.rid, { product: e.target.value })}
                      placeholder={t.productPlaceholder}
                      className="w-full bg-transparent text-slate-800 placeholder-slate-400 outline-none"
                    />
                  )}
                </Td>
                <Td>
                  {isSeller ? (
                    <span className="font-mono text-xs text-slate-500">{r.invId ? r.batch : "—"}</span>
                  ) : (
                    <input
                      value={r.batch}
                      onChange={(e) => updateRow(r.rid, { batch: e.target.value })}
                      className="w-24 bg-transparent text-slate-500 font-mono text-xs outline-none"
                    />
                  )}
                </Td>
                <Td>
                  <input
                    type="number"
                    min="1"
                    value={r.qty}
                    onChange={(e) => updateQty(r.rid, e.target.value)}
                    className="w-16 bg-transparent text-slate-800 outline-none"
                  />
                </Td>
                <Td>
                  {isSeller ? (
                    <span className="text-slate-800">{r.invId ? fmtTZS(r.unitPrice) : "—"}</span>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      value={r.unitPrice}
                      onChange={(e) => updateRow(r.rid, { unitPrice: e.target.value })}
                      className="w-24 bg-transparent text-slate-800 outline-none"
                    />
                  )}
                </Td>
                <Td>
                  {isSeller ? (
                    <span className="text-xs text-slate-500">{r.invId ? r.expiry.slice(0, 7) : "—"}</span>
                  ) : (
                    <input
                      type="date"
                      value={r.expiry}
                      onChange={(e) => updateRow(r.rid, { expiry: e.target.value })}
                      className="bg-transparent text-slate-500 outline-none text-xs"
                    />
                  )}
                </Td>
                <Td className="text-right font-semibold text-slate-900">
                  {fmtTZS((Number(r.qty) || 0) * (Number(r.unitPrice) || 0))}
                </Td>
                <Td>
                  <button onClick={() => removeRow(r.rid)} className="text-slate-400 hover:text-rose-600 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="md:hidden space-y-3 mb-2">
        {rows.map((r, idx) => (
          <Card key={r.rid} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 uppercase tracking-wide">#{idx + 1}</span>
              <button onClick={() => removeRow(r.rid)} className="text-slate-400 hover:text-rose-600 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
            <Field label={t.colProduct}>
              {isSeller ? (
                productSelect(r, inputCls)
              ) : (
                <input value={r.product} onChange={(e) => updateRow(r.rid, { product: e.target.value })} placeholder={t.productPlaceholder} className={inputCls} />
              )}
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t.colQty}>
                <input type="number" min="1" value={r.qty} onChange={(e) => updateQty(r.rid, e.target.value)} className={inputCls} />
              </Field>
              <Field label={t.colUnitPrice}>
                {isSeller ? (
                  <ReadBox>{r.invId ? fmtTZS(r.unitPrice) : "—"}</ReadBox>
                ) : (
                  <input type="number" min="0" value={r.unitPrice} onChange={(e) => updateRow(r.rid, { unitPrice: e.target.value })} className={inputCls} />
                )}
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t.colBatch}>
                {isSeller ? (
                  <ReadBox mono>{r.invId ? r.batch : "—"}</ReadBox>
                ) : (
                  <input value={r.batch} onChange={(e) => updateRow(r.rid, { batch: e.target.value })} className={inputCls + " font-mono"} />
                )}
              </Field>
              <Field label={t.colExpiry}>
                {isSeller ? (
                  <ReadBox>{r.invId ? r.expiry.slice(0, 7) : "—"}</ReadBox>
                ) : (
                  <input type="date" value={r.expiry} onChange={(e) => updateRow(r.rid, { expiry: e.target.value })} className={inputCls} />
                )}
              </Field>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-xs text-slate-500 uppercase tracking-wide">{t.colSubtotal}</span>
              <span className="text-slate-900 font-semibold">{fmtTZS((Number(r.qty) || 0) * (Number(r.unitPrice) || 0))}</span>
            </div>
          </Card>
        ))}
      </div>

      {error && <div className="text-xs text-rose-600 mb-4 mt-2">{error}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-7">
        <div className="text-slate-500 text-sm">
          {t.total} <span className="block text-3xl font-semibold text-slate-900 tracking-tight mt-0.5">{fmtTZS(total)}</span>
        </div>
        <PrimaryButton onClick={handleGenerate} className="w-full sm:w-auto justify-center">
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
  const billTone = (b) =>
    statusOverride ||
    (b.status === "paid" ? "paid" : b.status === "expired" ? "expired" : b.status === "pending" && daysBetween(TODAY, b.due) > 0 ? "overdue" : "pending");
  const mobileList = (
    <div className="md:hidden space-y-3">
      {bills.map((b) => {
        const tone = billTone(b);
        return (
          <Card key={b.id} className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="text-slate-900 font-medium truncate">{b.customer}</div>
                <div className="text-xs text-slate-500">{b.phone}</div>
              </div>
              <Badge tone={tone}>{st[tone]}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">{t.colTotal}</div>
                <div className="text-slate-900 font-semibold">{fmtTZS(billTotal(b))}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">{t.colDuePaid}</div>
                <div className="text-slate-700 text-sm">{fmtDate(b.paid || b.due, lang)}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">{t.colControl}</div>
                <div className="font-mono text-violet-700 text-sm">{fmtControl(b.control)}</div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200">
              <span className="text-xs text-slate-400 font-mono">{b.invoice} · {b.items.length} {s.common.items}</span>
              {showMarkPaid && (
                <GhostButton onClick={() => onMarkPaid(b.id)} className="hover:!border-emerald-400 hover:!text-emerald-700">
                  <CheckCircle2 size={13} /> {t.markPaid}
                </GhostButton>
              )}
            </div>
          </Card>
        );
      })}
      {bills.length === 0 && <div className="text-center text-sm text-slate-400 py-10">{s.common.noRecords}</div>}
    </div>
  );
  return (
    <>
    {mobileList}
    <Card className="hidden md:block overflow-x-auto">
      <table className="w-full" style={{ minWidth: "980px" }}>
        <thead className="bg-slate-100">
          <tr>
            <Th>{t.colTransaction}</Th>
            <Th>{t.colControl}</Th>
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
              <tr key={b.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                <Td className="text-violet-700 font-mono font-medium text-xs">{b.invoice}</Td>
                <Td className="text-slate-700 font-mono text-xs">{fmtControl(b.control)}</Td>
                <Td className="text-slate-900 font-medium">{b.customer}</Td>
                <Td className="text-slate-500">{b.phone}</Td>
                <Td>{b.items.length} {s.common.items}</Td>
                <Td className="font-semibold text-slate-900">{fmtTZS(total)}</Td>
                <Td className="text-slate-500">{fmtDate(b.created, lang)}</Td>
                <Td className="text-slate-500">{fmtDate(b.paid || b.due, lang)}</Td>
                <Td>
                  <Badge tone={tone}>{label}</Badge>
                </Td>
                {showMarkPaid && (
                  <Td>
                    <GhostButton onClick={() => onMarkPaid(b.id)} className="hover:!border-emerald-400 hover:!text-emerald-700">
                      <CheckCircle2 size={13} /> {t.markPaid}
                    </GhostButton>
                  </Td>
                )}
              </tr>
            );
          })}
          {bills.length === 0 && (
            <tr>
              <td colSpan={10} className="text-center text-sm text-slate-400 py-14">
                {s.common.noRecords}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
    </>
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
      <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-purple-800 text-white p-5 md:p-6 mb-6 shadow-lg">
        <div className="text-xs uppercase tracking-wide text-violet-200 mb-1">{t.statTotalDue}</div>
        <div className="text-3xl md:text-4xl font-semibold tracking-tight mb-5 break-words">{fmtTZS(totalDue)}</div>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-violet-400">
          <div>
            <div className="text-xs text-violet-200">{t.statPending}</div>
            <div className="text-lg font-semibold">{pending.length}</div>
          </div>
          <div>
            <div className="text-xs text-violet-200">{t.statOverdue}</div>
            <div className="text-lg font-semibold">{overdue.length}</div>
          </div>
          <div>
            <div className="text-xs text-violet-200">{t.statOldest}</div>
            <div className="text-lg font-semibold">{oldest} {s.common.daysAgoUnit}</div>
          </div>
        </div>
      </div>
      <BillsTable bills={pending} showMarkPaid onMarkPaid={onMarkPaid} />
    </div>
  );
}

function PaymentHistoryView({ bills }) {
  const { s, user } = useLang();
  const t = s.history;
  const paid = bills.filter((b) => b.status === "paid");
  const totalCollected = paid.reduce((s2, b) => s2 + billTotal(b), 0);
  const avg = paid.length ? totalCollected / paid.length : 0;

  return (
    <div>
      <PageHeader title={t.title} subtitle={t.subtitle(paid.length)} icon={CheckCircle2} />
      {user && user.role === "owner" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Stat label={t.statPaid} value={paid.length} icon={CheckCircle2} />
          <Stat label={t.statCollected} value={fmtTZS(totalCollected)} icon={Wallet} tone="accent" />
          <Stat label={t.statAvg} value={fmtTZS(avg)} icon={Receipt} />
        </div>
      )}
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-7 max-w-2xl">
        <Stat label={t.statSku} value={inventory.length} icon={Boxes} />
        <Stat label={t.statExpiringSoon} value={expiringSoon.length} sub={t.subWithin90} tone={expiringSoon.length ? "warn" : "default"} icon={Clock} />
        <Stat label={t.statExpiredStock} value={expiredStock.length} tone={expiredStock.length ? "danger" : "default"} icon={AlertTriangle} />
      </div>

      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit max-w-full overflow-x-auto">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`text-xs font-medium px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              tab === tb.key ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {tab === "inventory" && (
        <>
        <div className="md:hidden space-y-3">
          {inventory.map((it) => {
            const age = daysBetween(TODAY, it.received);
            const expDays = daysBetween(it.expiry, TODAY);
            return (
              <Card key={it.id} className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="text-slate-900 font-medium">{it.product}</div>
                    <div className="text-xs text-slate-500 font-mono">{it.batch}</div>
                  </div>
                  <div className={`text-lg font-semibold ${it.qty === 0 ? "text-rose-700" : "text-emerald-700"}`}>{it.qty}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">{t.colUnitPrice}</div>
                    <div className="text-slate-700">{fmtTZS(it.unitPrice)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">{t.colExpiry}</div>
                    <div className={expDays < 0 ? "text-rose-700" : expDays <= 90 ? "text-amber-700" : "text-slate-700"}>{it.expiry.slice(0, 7)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">{t.colReceived}</div>
                    <div className="text-slate-700">{fmtDate(it.received, lang)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">{t.colAge}</div>
                    <div className={it.id === oldestId ? "text-amber-700 font-medium" : "text-slate-700"}>
                      {it.id === oldestId ? s.common.oldest : s.common.daysAgo(age)}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-200">{it.supplier}</div>
              </Card>
            );
          })}
        </div>
        <Card className="hidden md:block overflow-x-auto">
          <table className="w-full" style={{ minWidth: "820px" }}>
            <thead className="bg-slate-100">
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
                  <tr key={it.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                    <Td className="text-slate-900 font-medium">{it.product}</Td>
                    <Td className="text-slate-500 font-mono text-xs">{it.batch}</Td>
                    <Td className={it.qty === 0 ? "text-rose-700 font-medium" : "text-emerald-700 font-medium"}>{it.qty}</Td>
                    <Td>{fmtTZS(it.unitPrice)}</Td>
                    <Td className="text-slate-500">{fmtDate(it.received, lang)}</Td>
                    <Td className={expDays < 0 ? "text-rose-700" : expDays <= 90 ? "text-amber-700" : "text-slate-500"}>
                      {it.expiry.slice(0, 7)}
                    </Td>
                    <Td className="text-slate-500">{it.supplier}</Td>
                    <Td className={it.id === oldestId ? "text-amber-700 font-medium" : "text-slate-500"}>
                      {it.id === oldestId ? s.common.oldest : s.common.daysAgo(age)}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
        </>
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
          {msg && <div className="text-xs text-rose-600">{msg}</div>}
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
          {msg && <div className="text-xs text-rose-600">{msg}</div>}
          <PrimaryButton onClick={handleStockOut}>
            <PackageMinus size={15} /> {t.registerOut}
          </PrimaryButton>
        </Card>
      )}

      {tab === "audit" && (
        <Card className="divide-y divide-slate-200">
          {auditLog.map((a) => (
            <div key={a.id} className="px-4 md:px-5 py-3.5 flex flex-col items-start sm:flex-row gap-1.5 sm:gap-4">
              <span className="text-xs text-slate-400 w-24 shrink-0 pt-0.5 font-mono">{fmtDate(a.date, lang)}</span>
              <Badge tone="info">{ACTION_LABELS[lang][a.action] || a.action}</Badge>
              <span className="text-sm text-slate-700">{a.detail}</span>
            </div>
          ))}
          {auditLog.length === 0 && <div className="text-center text-sm text-slate-400 py-14">{t.noAudit}</div>}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
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
          {error && <div className="text-xs text-rose-600 mb-3">{error}</div>}
          <PrimaryButton onClick={handleSubmit}>
            {t.submit} <ChevronRight size={15} />
          </PrimaryButton>
        </Card>

        <div>
          <div className="text-xs font-medium tracking-wide text-slate-500 uppercase mb-4">{t.locationSummary}</div>
          <div className="space-y-2.5">
            {summary.map((sm) => (
              <Card key={sm.loc} className="px-4 py-3.5 flex items-center justify-between">
                <span className="text-sm text-slate-800 font-medium">{locLabels[sm.loc]}</span>
                <span className="text-xs">
                  <span className="text-emerald-700">{sm.rcvd} {t.received}</span>
                  <span className="text-slate-300 mx-2">·</span>
                  <span className="text-violet-700">{sm.sent} {t.sent}</span>
                </span>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs font-medium tracking-wide text-slate-500 uppercase mb-3">{t.log}</div>
      <div className="md:hidden space-y-3">
        {transfers.map((tr) => (
          <Card key={tr.id} className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="text-slate-900 font-medium">{tr.product}</div>
                <div className="text-xs text-slate-500 font-mono">{tr.id} · {tr.batch}</div>
              </div>
              <Badge tone={tr.status === "completed" ? "paid" : "pending"}>
                {tr.status === "completed" ? st.transferCompleted : st.transferPending}
              </Badge>
            </div>
            <div className="text-sm text-slate-700 mb-2">
              {locLabels[tr.from]} <span className="text-slate-400">→</span> {locLabels[tr.to]}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{t.colQty}: <span className="text-slate-800 font-semibold">{tr.qty}</span></span>
              <span>{fmtDate(tr.date, lang)}</span>
            </div>
          </Card>
        ))}
      </div>
      <Card className="hidden md:block overflow-x-auto">
        <table className="w-full" style={{ minWidth: "760px" }}>
          <thead className="bg-slate-100">
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
              <tr key={tr.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                <Td className="text-violet-700 font-mono font-medium text-xs">{tr.id}</Td>
                <Td className="text-slate-900">{tr.product}</Td>
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


function BillCreatedModal({ bill, onClose, onSent }) {
  const { lang, s } = useLang();
  const t = s.bill;
  const [copied, setCopied] = useState("");
  const total = billTotal(bill);
  const message = t.message(bill.customer, fmtTZS(total), fmtControl(bill.control), fmtDate(bill.due, lang));
  const enc = encodeURIComponent(message);
  const digits = phoneDigits(bill.phone);

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      /* clipboard may be blocked; ignore */
    }
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="fixed inset-0 z-20 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xl my-4 sm:my-8">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center ring-1 ring-emerald-200 shrink-0">
            <Check size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{t.createdTitle}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{t.createdSub}</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-violet-200 rounded-xl p-4 mb-4 text-center">
          <div className="text-xs font-medium tracking-wide text-slate-500 uppercase mb-2">{t.controlLabel}</div>
          <div className="text-2xl sm:text-3xl font-mono font-semibold text-violet-700 tracking-wider">{fmtControl(bill.control)}</div>
          <button
            onClick={() => copy(bill.control, "num")}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800"
          >
            {copied === "num" ? <Check size={13} /> : <Copy size={13} />} {copied === "num" ? t.copied : t.copyNumber}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-sm">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t.customer}</div>
            <div className="text-slate-900 font-medium">{bill.customer}</div>
            <div className="text-xs text-slate-500">{bill.phone}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t.amount}</div>
            <div className="text-slate-900 font-semibold">{fmtTZS(total)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t.due}</div>
            <div className="text-slate-900">{fmtDate(bill.due, lang)}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs font-medium tracking-wide text-slate-500 uppercase mb-2">{t.messageLabel}</div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500 leading-relaxed">{message}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
          <a
            href={`sms:${bill.phone.replace(/\s/g, "")}?body=${enc}`}
            onClick={() => onSent(bill.id)}
            className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <Send size={15} /> {t.sendSms}
          </a>
          <a
            href={`https://wa.me/${digits}?text=${enc}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => onSent(bill.id)}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <MessageCircle size={15} /> {t.sendWhatsapp}
          </a>
        </div>
        <div className="flex items-center justify-between mb-5">
          <GhostButton onClick={() => copy(message, "msg")}>
            {copied === "msg" ? <Check size={13} /> : <Copy size={13} />} {copied === "msg" ? t.copied : t.copyMessage}
          </GhostButton>
          {bill.sent && <Badge tone="paid">{t.sent}</Badge>}
        </div>

        <p className="text-xs text-slate-400 mb-5">{t.note}</p>

        <PrimaryButton onClick={onClose} className="w-full justify-center">
          {t.done}
        </PrimaryButton>
      </div>
    </div>
  );
}

function PayView({ bills, onPay }) {
  const { lang, s } = useLang();
  const t = s.pay;
  const st = STATUS_LABELS[lang];
  const [input, setInput] = useState("");
  const [foundId, setFoundId] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [channel, setChannel] = useState("");
  const [account, setAccount] = useState("");
  const [step, setStep] = useState("lookup"); // lookup | confirm | done
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState("");

  const bill = bills.find((b) => b.id === foundId);

  const find = () => {
    const digits = input.replace(/\D/g, "");
    const b = bills.find((x) => x.control === digits);
    setStep("lookup");
    setError("");
    if (b) {
      setFoundId(b.id);
      setNotFound(false);
      setAccount(b.phone);
      setChannel("");
    } else {
      setFoundId(null);
      setNotFound(true);
    }
  };

  const startPay = () => {
    if (!channel || !account.trim()) {
      setError(t.errChannel);
      return;
    }
    setError("");
    setStep("confirm");
  };

  const confirmPay = () => {
    const ref = "RCPT-" + String(Math.floor(Math.random() * 1e8)).padStart(8, "0");
    setReceipt(ref);
    onPay(bill.id, channel);
    setStep("done");
  };

  const reset = () => {
    setInput("");
    setFoundId(null);
    setNotFound(false);
    setChannel("");
    setAccount("");
    setStep("lookup");
    setError("");
  };

  const total = bill ? billTotal(bill) : 0;
  const isOverdue = bill && bill.status === "pending" && daysBetween(TODAY, bill.due) > 0;
  const tone = !bill ? "pending" : bill.status === "paid" ? "paid" : bill.status === "expired" ? "expired" : isOverdue ? "overdue" : "pending";

  return (
    <div>
      <PageHeader title={t.title} subtitle={t.subtitle} icon={CreditCard} />

      <div className="mb-6 bg-amber-100 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">{t.demo}</div>

      <div className="max-w-xl space-y-5">
        <Card className="p-5">
          <Field label={t.controlLabel}>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && find()}
                placeholder={t.controlPlaceholder}
                className={inputCls + " font-mono"}
              />
              <PrimaryButton onClick={find} className="justify-center">
                <Search size={15} /> {t.find}
              </PrimaryButton>
            </div>
          </Field>
          {notFound && <div className="text-xs text-rose-600 mt-3">{t.notFound}</div>}
        </Card>

        {bill && step !== "done" && (
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-medium tracking-wide text-slate-500 uppercase">{t.details}</div>
              <Badge tone={tone}>{st[tone]}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t.customer}</div>
                <div className="text-slate-900 font-medium">{bill.customer}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t.due}</div>
                <div className="text-slate-900">{fmtDate(bill.due, lang)}</div>
              </div>
            </div>
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-200 mb-4">
              {bill.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="text-slate-700">{it.product} <span className="text-slate-400">× {it.qty}</span></span>
                  <span className="text-slate-900">{fmtTZS(it.qty * it.unitPrice)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-3 py-2.5 bg-slate-100 rounded-b-lg">
                <span className="text-xs uppercase tracking-wide text-slate-500">{t.total}</span>
                <span className="text-lg font-semibold text-slate-900">{fmtTZS(total)}</span>
              </div>
            </div>

            {bill.status === "paid" && (
              <div className="text-sm text-emerald-700">{t.alreadyPaid(fmtDate(bill.paid, lang))}</div>
            )}
            {bill.status === "expired" && <div className="text-sm text-rose-700">{t.expiredMsg}</div>}

            {bill.status === "pending" && step === "lookup" && (
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-medium tracking-wide text-slate-500 uppercase mb-2">{t.chooseChannel}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PAY_CHANNELS.map((ch) => (
                      <button
                        key={ch}
                        onClick={() => setChannel(ch)}
                        className={`text-sm px-3 py-2.5 rounded-lg border transition-colors ${
                          channel === ch
                            ? "bg-violet-100 border-violet-400 text-violet-700"
                            : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800"
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
                <Field label={t.accountLabel}>
                  <input value={account} onChange={(e) => setAccount(e.target.value)} className={inputCls} />
                </Field>
                {error && <div className="text-xs text-rose-600">{error}</div>}
                <PrimaryButton onClick={startPay} className="w-full justify-center">
                  <CreditCard size={15} /> {t.payButton(fmtTZS(total))}
                </PrimaryButton>
              </div>
            )}

            {bill.status === "pending" && step === "confirm" && (
              <div className="space-y-4">
                <div className="text-sm font-semibold text-slate-900">{t.confirmTitle}</div>
                <p className="text-sm text-slate-500">{t.confirmText(channel, account)}</p>
                <div className="flex gap-2">
                  <PrimaryButton onClick={confirmPay}>
                    <Check size={15} /> {t.confirmButton}
                  </PrimaryButton>
                  <GhostButton onClick={() => setStep("lookup")}>{t.cancel}</GhostButton>
                </div>
              </div>
            )}
          </Card>
        )}

        {bill && step === "done" && (
          <Card className="p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center ring-1 ring-emerald-200 mb-4">
              <Check size={24} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">{t.doneTitle}</h2>
            <div className="text-2xl font-semibold text-emerald-700 mb-4">{fmtTZS(total)}</div>
            <div className="text-xs text-slate-500 space-y-1 mb-5">
              <div>{t.receipt}: <span className="font-mono text-slate-700">{receipt}</span></div>
              <div>{t.paidVia}: <span className="text-slate-700">{channel}</span></div>
              <div>{bill.customer} · <span className="font-mono">{fmtControl(bill.control)}</span></div>
            </div>
            <GhostButton onClick={reset} className="mx-auto">{t.newPayment}</GhostButton>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- shell ----------------------------- */

const NAV_ICONS = {
  create: Plus,
  pay: CreditCard,
  pending: RotateCw,
  history: CheckCircle2,
  expired: XCircle,
  stock: ArrowUpDown,
  transfer: ArrowLeftRight,
  users: Users,
};
const NAV_ORDER = ["create", "pending", "pay", "history", "expired", "stock", "transfer", "users"];

function LanguageSwitcher({ lang, setLang }) {
  return (
    <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
      {LANGS.map((l) => (
        <button
          key={l.key}
          onClick={() => setLang(l.key)}
          className={`text-xs font-semibold px-2 py-1 rounded-md transition-colors ${
            lang === l.key ? "bg-violet-600 text-white" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function PinInput({ value, onChange, placeholder, onEnter }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        inputMode="numeric"
        autoComplete="off"
        maxLength={8}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        onKeyDown={(e) => e.key === "Enter" && onEnter && onEnter()}
        placeholder={placeholder}
        className={inputCls + " pr-11"}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
      >
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}

function AuthShell({ children }) {
  const { lang, setLang, s } = useLang();
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-violet-700 via-violet-600 to-purple-800 flex flex-col font-sans antialiased">
      <div className="flex justify-end p-4">
        <LanguageSwitcher lang={lang} setLang={setLang} />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-10">{children}</div>
    </div>
  );
}

function SetupScreen({ onDone }) {
  const { s } = useLang();
  const t = s.auth;
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!/^\d{4,8}$/.test(pin)) return setError(t.errLen);
    if (pin !== pin2) return setError(t.errMatch);
    onDone(pin);
  };

  return (
    <AuthShell>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white shadow-lg mb-4">
            <ShieldCheck size={26} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{t.setupTitle}</h1>
          <p className="text-sm text-slate-500 mt-1">{t.setupSub}</p>
        </div>
        <div className="space-y-4">
          <Field label={t.pinNew}>
            <PinInput value={pin} onChange={(v) => { setPin(v); setError(""); }} placeholder="••••" />
          </Field>
          <Field label={t.pinConfirm}>
            <PinInput value={pin2} onChange={(v) => { setPin2(v); setError(""); }} placeholder="••••" onEnter={submit} />
          </Field>
        </div>
        {error && <div className="text-xs text-rose-600 mt-3">{error}</div>}
        <PrimaryButton onClick={submit} className="w-full justify-center mt-5">
          {t.setupBtn} <ChevronRight size={15} />
        </PrimaryButton>
      </div>
    </AuthShell>
  );
}

function LoginScreen({ accounts, onLogin, onCustomer }) {
  const { s } = useLang();
  const t = s.auth;
  const [role, setRole] = useState("owner");
  const [sellerId, setSellerId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const sellers = accounts.sellers;
  const seller = sellers.find((x) => x.id === sellerId) || sellers[0];

  const submit = () => {
    if (role === "owner") {
      if (pin === accounts.owner.pin) {
        onLogin({ role: "owner" });
      } else {
        setError(t.errPinFor(t.owner));
      }
      return;
    }
    if (!seller) {
      setError(t.noSellers);
      return;
    }
    if (pin === seller.pin) {
      onLogin({ role: "seller", id: seller.id, name: seller.name });
    } else {
      setError(t.errPinFor(seller.name));
    }
  };

  const roles = [
    { key: "owner", label: t.owner, desc: t.ownerDesc, icon: ShieldCheck },
    { key: "seller", label: t.seller, desc: t.sellerDesc, icon: Users },
  ];

  return (
    <AuthShell>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-4">
            B
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{t.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{t.subtitle}</p>
        </div>

        <div className="text-xs font-medium tracking-wide text-slate-500 uppercase mb-2">{t.roleLabel}</div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {roles.map((r) => {
            const Icon = r.icon;
            const active = role === r.key;
            return (
              <button
                key={r.key}
                onClick={() => { setRole(r.key); setPin(""); setError(""); }}
                className={`text-left rounded-2xl border-2 p-3.5 transition-colors ${
                  active ? "border-violet-600 bg-violet-50" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${active ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  <Icon size={18} />
                </div>
                <div className={`text-sm font-semibold ${active ? "text-violet-700" : "text-slate-900"}`}>{r.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{r.desc}</div>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {role === "seller" && (
            sellers.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">{t.noSellers}</div>
            ) : (
              <Field label={t.pickSeller}>
                <select
                  value={seller ? seller.id : ""}
                  onChange={(e) => { setSellerId(e.target.value); setPin(""); setError(""); }}
                  className={inputCls}
                >
                  {sellers.map((x) => (
                    <option key={x.id} value={x.id}>{x.name}</option>
                  ))}
                </select>
              </Field>
            )
          )}
          <Field label={t.pin}>
            <PinInput value={pin} onChange={(v) => { setPin(v); setError(""); }} placeholder={t.pinPlaceholder} onEnter={submit} />
          </Field>
        </div>
        {error && <div className="text-xs text-rose-600 mt-3">{error}</div>}
        <PrimaryButton onClick={submit} className="w-full justify-center mt-5">
          {t.signIn} <ChevronRight size={15} />
        </PrimaryButton>
        <p className="text-xs text-slate-400 mt-4 text-center">{t.forgot}</p>
      </div>

      <button onClick={onCustomer} className="mt-6 text-sm text-violet-100 hover:text-white underline underline-offset-4">
        {t.customerLink}
      </button>
    </AuthShell>
  );
}

function Msg({ msg }) {
  if (!msg.text) return null;
  return <div className={`text-xs mt-3 ${msg.type === "err" ? "text-rose-600" : "text-emerald-700"}`}>{msg.text}</div>;
}

function UsersView({ accounts, onChange }) {
  const { s } = useLang();
  const t = s.users;
  const validPin = (v) => /^\d{4,8}$/.test(v);
  const [cur, setCur] = useState("");
  const [np, setNp] = useState("");
  const [np2, setNp2] = useState("");
  const [ownerMsg, setOwnerMsg] = useState({ type: "", text: "" });
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [addMsg, setAddMsg] = useState({ type: "", text: "" });
  const [editId, setEditId] = useState(null);
  const [editPin, setEditPin] = useState("");
  const [delId, setDelId] = useState(null);

  const changeOwner = () => {
    if (cur !== accounts.owner.pin) return setOwnerMsg({ type: "err", text: t.wrongCurrent });
    if (!validPin(np)) return setOwnerMsg({ type: "err", text: s.auth.errLen });
    if (np !== np2) return setOwnerMsg({ type: "err", text: s.auth.errMatch });
    onChange((a) => ({ ...a, owner: { pin: np } }));
    setCur(""); setNp(""); setNp2("");
    setOwnerMsg({ type: "ok", text: t.pinChanged });
  };

  const addSeller = () => {
    const n = name.trim();
    if (!n) return setAddMsg({ type: "err", text: t.nameRequired });
    if (accounts.sellers.some((x) => x.name.toLowerCase() === n.toLowerCase())) return setAddMsg({ type: "err", text: t.nameExists });
    if (!validPin(pin)) return setAddMsg({ type: "err", text: s.auth.errLen });
    onChange((a) => ({ ...a, sellers: [...a.sellers, { id: "s" + Date.now(), name: n, pin }] }));
    setName(""); setPin("");
    setAddMsg({ type: "ok", text: t.sellerAdded });
  };

  const savePin = (id) => {
    if (!validPin(editPin)) return setAddMsg({ type: "err", text: s.auth.errLen });
    onChange((a) => ({ ...a, sellers: a.sellers.map((x) => (x.id === id ? { ...x, pin: editPin } : x)) }));
    setEditId(null); setEditPin("");
    setAddMsg({ type: "ok", text: t.saved });
  };

  const remove = (id) => {
    if (delId !== id) {
      setDelId(id);
      return;
    }
    onChange((a) => ({ ...a, sellers: a.sellers.filter((x) => x.id !== id) }));
    setDelId(null);
  };

  return (
    <div>
      <PageHeader title={t.title} subtitle={t.subtitle} icon={Users} />

      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">{t.deviceNote}</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="text-xs font-medium tracking-wide text-slate-500 uppercase mb-4">{t.ownerPin}</div>
          <div className="space-y-4">
            <Field label={t.currentPin}>
              <PinInput value={cur} onChange={(v) => { setCur(v); setOwnerMsg({ type: "", text: "" }); }} placeholder="••••" />
            </Field>
            <Field label={t.newPin}>
              <PinInput value={np} onChange={(v) => { setNp(v); setOwnerMsg({ type: "", text: "" }); }} placeholder="••••" />
            </Field>
            <Field label={t.confirmPin}>
              <PinInput value={np2} onChange={(v) => { setNp2(v); setOwnerMsg({ type: "", text: "" }); }} placeholder="••••" onEnter={changeOwner} />
            </Field>
          </div>
          <Msg msg={ownerMsg} />
          <PrimaryButton onClick={changeOwner} className="mt-5">
            {t.changePin}
          </PrimaryButton>
        </Card>

        <Card className="p-5">
          <div className="text-xs font-medium tracking-wide text-slate-500 uppercase mb-4">{t.sellers}</div>

          {accounts.sellers.length === 0 ? (
            <div className="text-sm text-slate-500 mb-5">{t.noneYet}</div>
          ) : (
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-200 mb-5">
              {accounts.sellers.map((x) => (
                <div key={x.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-semibold shrink-0">
                        {x.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-900 truncate">{x.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GhostButton onClick={() => { setEditId(editId === x.id ? null : x.id); setEditPin(""); setDelId(null); }}>
                        {t.editPin}
                      </GhostButton>
                      <GhostButton onClick={() => remove(x.id)} className={delId === x.id ? "!border-rose-300 !text-rose-600" : ""}>
                        <Trash2 size={13} /> {delId === x.id ? t.confirmRemove : t.remove}
                      </GhostButton>
                    </div>
                  </div>
                  {editId === x.id && (
                    <div className="mt-3 flex flex-col sm:flex-row gap-2">
                      <div className="flex-1">
                        <PinInput value={editPin} onChange={setEditPin} placeholder={t.newPin} onEnter={() => savePin(x.id)} />
                      </div>
                      <PrimaryButton onClick={() => savePin(x.id)} className="justify-center">{t.save}</PrimaryButton>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-xs font-medium tracking-wide text-slate-500 uppercase mb-3">{t.addSeller}</div>
          <div className="space-y-4">
            <Field label={t.sellerName}>
              <input value={name} onChange={(e) => { setName(e.target.value); setAddMsg({ type: "", text: "" }); }} placeholder={t.sellerNamePh} className={inputCls} />
            </Field>
            <Field label={t.sellerPin}>
              <PinInput value={pin} onChange={(v) => { setPin(v); setAddMsg({ type: "", text: "" }); }} placeholder="••••" onEnter={addSeller} />
            </Field>
          </div>
          <Msg msg={addMsg} />
          <PrimaryButton onClick={addSeller} className="mt-5">
            <Plus size={15} /> {t.add}
          </PrimaryButton>
        </Card>
      </div>
    </div>
  );
}

function CustomerPage({ bills, onPay, onBack }) {
  const { lang, setLang, s } = useLang();
  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm">
            B
          </div>
          <div className="text-base font-semibold text-slate-900 tracking-tight">BillManager</div>
        </div>
        <LanguageSwitcher lang={lang} setLang={setLang} />
      </header>
      <div className="max-w-xl mx-auto px-4 py-5">
        <button onClick={onBack} className="text-sm text-violet-700 hover:underline mb-4">
          ← {s.auth.back}
        </button>
        <PayView bills={bills} onPay={onPay} />
      </div>
    </div>
  );
}

function SidebarBody({ view, setView, pendingCount, expiredStockCount, expiringSoonCount, onNavigate, showLang, user, onLogout }) {
  const { lang, setLang, s } = useLang();
  const go = (key) => {
    setView(key);
    if (onNavigate) onNavigate();
  };
  const allowed = ROLE_ACCESS[user.role];
  const roleLabel = user.role === "owner" ? s.auth.owner : user.name;
  return (
    <>
      <div>
        <div className="px-5 pt-6 pb-5 border-b border-slate-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
            B
          </div>
          <div>
            <div className="text-base font-semibold text-slate-900 tracking-tight leading-tight">BillManager</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.appVersion}</div>
          </div>
          {onNavigate && (
            <button onClick={onNavigate} className="ml-auto text-slate-500 hover:text-slate-800">
              <X size={20} />
            </button>
          )}
        </div>
        {showLang && (
          <div className="px-5 pt-4">
            <LanguageSwitcher lang={lang} setLang={setLang} />
          </div>
        )}
        <nav className="px-3 py-4 space-y-1">
          {NAV_ORDER.filter((key) => allowed.includes(key)).map((key) => {
            const Icon = NAV_ICONS[key];
            const active = view === key;
            return (
              <button
                key={key}
                onClick={() => go(key)}
                className={`relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  active ? "bg-violet-100 text-violet-700 font-medium" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-violet-600" />}
                <Icon size={16} strokeWidth={active ? 2.3 : 2} />
                <span className="flex-1 text-left">{s.nav[key]}</span>
                {key === "pending" && pendingCount > 0 && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-1.5 py-0.5 rounded-md min-w-5 text-center">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
      <div>
        {user.role === "owner" && (
          <div className="mx-4 mb-3 p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              {s.sidebar.expired(expiredStockCount)}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {s.sidebar.soon(expiringSoonCount)}
            </div>
          </div>
        )}
        {user.role === "owner" && (
          <button
            onClick={() => go("users")}
            className="mx-4 mb-3 w-auto self-stretch flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-md transition-colors"
          >
            <Plus size={16} /> {s.users.addSeller}
          </button>
        )}
        <div className="mx-4 mb-5 p-3 rounded-xl bg-violet-50 border border-violet-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center font-semibold text-sm shrink-0">
            {roleLabel.charAt(0)}
          </div>
          <div className="min-w-0 flex-1 text-sm font-medium text-slate-900 truncate">{roleLabel}</div>
          <button onClick={onLogout} title={s.auth.logout} className="text-slate-500 hover:text-rose-600 transition-colors">
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </>
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
  const [createdBill, setCreatedBill] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accounts, setAccounts] = useState(loadAccounts);
  const [user, setUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      const saved = raw ? JSON.parse(raw) : null;
      const acc = loadAccounts();
      if (!saved || !acc) return null;
      if (saved.role === "owner") return { role: "owner" };
      const found = acc.sellers.find((x) => x.id === saved.id);
      return found ? { role: "seller", id: found.id, name: found.name } : null;
    } catch (e) {
      return null;
    }
  });
  const [customerMode, setCustomerMode] = useState(false);

  const s = STRINGS[lang];

  const updateAccounts = (fn) => {
    setAccounts((prev) => {
      const next = fn(prev);
      saveAccounts(next);
      return next;
    });
  };
  const login = (u) => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(u)); } catch (e) { /* storage may be blocked */ }
    setUser(u);
    setView("create");
  };
  const setupOwner = (pin) => {
    const next = { owner: { pin }, sellers: [] };
    saveAccounts(next);
    setAccounts(next);
    login({ role: "owner" });
    setView("users");
  };
  const logout = () => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
    setUser(null);
    setMenuOpen(false);
    setCreatedBill(null);
  };
  const allowedViews = user ? ROLE_ACCESS[user.role] : [];
  const activeView = allowedViews.includes(view) ? view : "create";
  const displayName = user ? (user.role === "owner" ? s.auth.owner : user.name) : "";

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
    const control = genControl(bills.map((b) => b.control));
    const newBill = {
      id: nextId(), invoice, control, sent: false,
      customer: data.customer, phone: data.phone, items: data.items,
      created: TODAY, due: data.due, paid: null, status: "pending",
    };
    setBills((bs) => [newBill, ...bs]);
    addAudit("newTransaction", `${invoice} · ${data.customer} · ${fmtControl(control)} · ${fmtTZS(data.items.reduce((s2, it) => s2 + it.qty * it.unitPrice, 0))}`);
    setCreatedBill(newBill);
  };

  const handleBillSent = (id) => {
    const target = bills.find((b) => b.id === id);
    if (target && !target.sent) addAudit("billSent", `${target.invoice} · ${target.phone}`);
    setBills((bs) => bs.map((b) => (b.id === id ? { ...b, sent: true } : b)));
    setCreatedBill((cb) => (cb && cb.id === id ? { ...cb, sent: true } : cb));
  };

  const handlePay = (id, channel) => {
    const target = bills.find((b) => b.id === id);
    setBills((bs) => bs.map((b) => (b.id === id ? { ...b, status: "paid", paid: TODAY } : b)));
    if (target) addAudit("payment", `${target.invoice} · ${target.customer} · ${channel}`);
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

  const sideProps = { view: activeView, setView, pendingCount, expiredStockCount, expiringSoonCount, user, onLogout: logout };

  return (
    <LangContext.Provider value={{ lang, setLang, s, user }}>
      <style>{`
        html, body, #root { background-color: #f8fafc; margin: 0; padding: 0; height: 100%; width: 100%; }
        * { box-sizing: border-box; }
      `}</style>

      {!user && !customerMode && !accounts && <SetupScreen onDone={setupOwner} />}
      {!user && !customerMode && accounts && <LoginScreen accounts={accounts} onLogin={login} onCustomer={() => setCustomerMode(true)} />}
      {!user && customerMode && <CustomerPage bills={bills} onPay={handlePay} onBack={() => setCustomerMode(false)} />}

      {user && (
        <div className="w-full min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col md:flex-row antialiased overflow-x-clip">
          {/* Mobile top bar */}
          <header className="md:hidden sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm">
                B
              </div>
              <div className="text-base font-semibold text-slate-900 tracking-tight">BillManager</div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher lang={lang} setLang={setLang} />
              <button
                onClick={() => setMenuOpen(true)}
                className="w-9 h-9 rounded-full bg-violet-600 text-white font-semibold text-sm flex items-center justify-center"
              >
                {displayName.charAt(0)}
              </button>
            </div>
          </header>

          {/* Mobile menu drawer */}
          {menuOpen && (
            <div className="md:hidden fixed inset-0 z-30 flex">
              <div className="w-72 max-w-full bg-white border-r border-slate-200 flex flex-col justify-between overflow-y-auto">
                <SidebarBody {...sideProps} onNavigate={() => setMenuOpen(false)} showLang={false} />
              </div>
              <div className="flex-1 bg-black/60" onClick={() => setMenuOpen(false)} />
            </div>
          )}

          {/* Desktop sidebar */}
          <aside className="hidden md:flex w-64 shrink-0 border-r border-slate-200 flex-col justify-between md:sticky md:top-0 md:h-screen md:overflow-y-auto bg-white">
            <SidebarBody {...sideProps} showLang />
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0 w-full mx-auto px-4 pt-5 pb-28 md:px-8 md:py-8 max-w-6xl relative">
            {user.role === "owner" && accounts && accounts.sellers.length === 0 && activeView !== "users" && (
              <div className="mb-5 bg-violet-50 border border-violet-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                <span className="text-sm text-violet-900">{s.users.noSellerBanner}</span>
                <PrimaryButton onClick={() => setView("users")}>
                  <Plus size={15} /> {s.users.addSeller}
                </PrimaryButton>
              </div>
            )}
            {activeView === "create" && <CreateBillView inventory={inventory} onGenerate={handleGenerateBill} />}
            {activeView === "pending" && <PendingBillsView bills={bills} onMarkPaid={handleMarkPaid} />}
            {activeView === "pay" && <PayView bills={bills} onPay={handlePay} />}
            {activeView === "history" && <PaymentHistoryView bills={bills} />}
            {activeView === "expired" && <ExpiredBillsView bills={bills} />}
            {activeView === "stock" && (
              <StockManagementView inventory={inventory} onStockChange={handleStockChange} auditLog={auditLog} addAudit={addAudit} />
            )}
            {activeView === "transfer" && <TransferView inventory={inventory} transfers={transfers} onSubmitTransfer={handleSubmitTransfer} />}
            {activeView === "users" && accounts && <UsersView accounts={accounts} onChange={updateAccounts} />}
          </main>

          {/* Mobile bottom navigation */}
          <nav className="md:hidden fixed bottom-0 inset-x-0 z-10 bg-white border-t border-slate-200 flex">
            {["create", "pending", "pay"].map((key) => {
              const Icon = NAV_ICONS[key];
              const active = activeView === key;
              return (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs ${active ? "text-violet-700 font-semibold" : "text-slate-500"}`}
                >
                  <span className="relative">
                    <Icon size={21} strokeWidth={active ? 2.4 : 2} />
                    {key === "pending" && pendingCount > 0 && (
                      <span className="absolute -top-2 -right-3 bg-amber-500 text-white text-xs font-semibold px-1.5 rounded-full">
                        {pendingCount}
                      </span>
                    )}
                  </span>
                  {s.tabs[key]}
                </button>
              );
            })}
            <button onClick={() => setMenuOpen(true)} className="flex-1 flex flex-col items-center gap-1 py-2.5 text-xs text-slate-500">
              <Menu size={21} />
              {s.tabs.more}
            </button>
          </nav>

          {createdBill && (
            <BillCreatedModal
              bill={createdBill}
              onSent={handleBillSent}
              onClose={() => {
                setCreatedBill(null);
                setView("pending");
              }}
            />
          )}

          {/* Help button */}
          <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-10">
            {showHelp && (
              <div className="mb-3 w-64 sm:w-72 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl text-xs text-slate-500 space-y-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-900 font-semibold text-sm">{s.help.title}</span>
                  <button onClick={() => setShowHelp(false)} className="text-slate-500 hover:text-slate-700">
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
              className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-violet-700 hover:border-violet-300 shadow-lg transition-colors"
            >
              <HelpCircle size={18} />
            </button>
          </div>
        </div>
      )}
    </LangContext.Provider>
  );
}
