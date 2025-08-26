import React, { useEffect, useMemo, useState } from "react";
import {
  Shield,
  Plus,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
  Download,
  Upload,
} from "lucide-react";

/** ------------------ Types ------------------ */
type Frequency = "monthly" | "quarterly" | "yearly";
type Status = "Active" | "Expiring Soon" | "Expired";

type Policy = {
  id: string;
  type: string;             // free text (e.g., "Life Insurance", "Health", etc.)
  provider: string;
  policyNumber: string;
  premium: number;          // per frequency
  frequency: Frequency;
  coverageAmount: number;
  startDate: string;        // ISO date YYYY-MM-DD
  endDate: string;          // ISO date YYYY-MM-DD
  lastPaidDate?: string;    // ISO date, optional
  notes?: string;           // optional
};

type Tab = "overview" | "policies";

/** ------------------ Utils ------------------ */
const STORAGE_KEY = "insurance_policies";

const safeId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const INR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const parseNum = (s: string | number) =>
  typeof s === "number" ? s : isNaN(parseFloat(s)) ? 0 : Math.max(0, parseFloat(s));

const addMonths = (iso: string, months: number) => {
  const d = new Date(iso);
  const nd = new Date(d.getFullYear(), d.getMonth() + months, d.getDate());
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${nd.getFullYear()}-${pad(nd.getMonth() + 1)}-${pad(nd.getDate())}`;
};

const todayISO = () => {
  const d = new Date();
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const daysBetween = (aISO: string, bISO: string) => {
  const a = new Date(aISO).setHours(0, 0, 0, 0);
  const b = new Date(bISO).setHours(0, 0, 0, 0);
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
};

const frequencyMonths = (f: Frequency) => (f === "monthly" ? 1 : f === "quarterly" ? 3 : 12);

const annualizedPremium = (p: Policy) => p.premium * (12 / frequencyMonths(p.frequency));

const nextDueFrom = (p: Policy): string => {
  // If lastPaidDate exists, next due = lastPaidDate + freq; else from startDate.
  const base = p.lastPaidDate || p.startDate;
  return addMonths(base, frequencyMonths(p.frequency));
};

const computeStatus = (p: Policy): { status: Status; daysLeft: number } => {
  const t = todayISO();
  const daysLeft = daysBetween(t, p.endDate);
  if (daysLeft < 0) return { status: "Expired", daysLeft };
  if (daysLeft <= 30) return { status: "Expiring Soon", daysLeft };
  return { status: "Active", daysLeft };
};

/** ------------------ Component ------------------ */
const Insurance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [policies, setPolicies] = useState<Policy[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyForm: Policy = {
    id: "",
    type: "",
    provider: "",
    policyNumber: "",
    premium: 0,
    frequency: "yearly",
    coverageAmount: 0,
    startDate: todayISO(),
    endDate: todayISO(),
    lastPaidDate: undefined,
    notes: "",
  };
  const [form, setForm] = useState<Policy>(emptyForm);

  const [query, setQuery] = useState("");

  /** Persist to storage */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(policies));
    window.dispatchEvent(new Event("storage"));
  }, [policies]);

  /** Derived stats */
  const computed = useMemo(() => {
    let totalCoverage = 0;
    let totalAnnualPremium = 0;
    let active = 0;
    let expiring = 0;

    for (const p of policies) {
      const { status } = computeStatus(p);
      totalCoverage += p.coverageAmount;
      totalAnnualPremium += annualizedPremium(p);
      if (status === "Active") active++;
      else if (status === "Expiring Soon") expiring++;
    }
    return { totalCoverage, totalAnnualPremium, active, expiring };
  }, [policies]);

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Expiring Soon":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "Expired":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  /** CRUD */
  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm, id: safeId() });
    setShowModal(true);
  };

  const openEdit = (p: Policy) => {
    setEditingId(p.id);
    setForm({ ...p });
    setShowModal(true);
  };

  const remove = (id: string) => {
    if (!confirm("Delete this policy?")) return;
    setPolicies((prev) => prev.filter((p) => p.id !== id));
  };

  const validateForm = (p: Policy) => {
    if (!p.type.trim()) return "Type is required";
    if (!p.provider.trim()) return "Provider is required";
    if (!p.policyNumber.trim()) return "Policy number is required";
    if (!p.startDate || !p.endDate) return "Start and end dates are required";
    if (new Date(p.endDate) < new Date(p.startDate))
      return "End date must be after start date";
    if (p.premium <= 0) return "Premium must be greater than 0";
    if (p.coverageAmount <= 0) return "Coverage amount must be greater than 0";
    return null;
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateForm(form);
    if (err) {
      alert(err);
      return;
    }
    setPolicies((prev) => {
      const exists = prev.some((x) => x.id === form.id);
      return exists ? prev.map((x) => (x.id === form.id ? { ...form } : x)) : [{ ...form }, ...prev];
    });
    setShowModal(false);
  };

  const markPaid = (p: Policy) => {
    const next = nextDueFrom(p);
    setPolicies((prev) => prev.map((x) => (x.id === p.id ? { ...x, lastPaidDate: next } : x)));
  };

  /** Import/Export JSON */
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(policies, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `insurance-policies-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = async (file: File) => {
    try {
      const text = await file.text();
      const arr = JSON.parse(text) as Policy[];
      if (!Array.isArray(arr)) throw new Error("Invalid file");
      const cleaned = arr
        .filter((p) => p && typeof p === "object")
        .map((p) => ({
          id: p.id || safeId(),
          type: String((p as any).type || "").trim(),
          provider: String((p as any).provider || "").trim(),
          policyNumber: String((p as any).policyNumber || "").trim(),
          premium: parseNum((p as any).premium),
          frequency: (["monthly", "quarterly", "yearly"] as Frequency[]).includes(
            (p as any).frequency
          )
            ? ((p as any).frequency as Frequency)
            : "yearly",
          coverageAmount: parseNum((p as any).coverageAmount),
          startDate: (p as any).startDate || todayISO(),
          endDate: (p as any).endDate || todayISO(),
          lastPaidDate: (p as any).lastPaidDate || undefined,
          notes: (p as any).notes || "",
        }))
        .filter((p) => p.type && p.provider && p.policyNumber);
      setPolicies(cleaned);
      alert("Imported successfully.");
    } catch (e: any) {
      alert(`Import failed: ${e?.message ?? e}`);
    }
  };

  /** Filtered list */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return policies.filter(
      (p) =>
        !q ||
        p.provider.toLowerCase().includes(q) ||
        p.policyNumber.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
    );
  }, [policies, query]);

  /** ------------------ Render ------------------ */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Insurance Management</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={openAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Policy
          </button>

          <button
            onClick={exportJSON}
            className="px-3 py-2 rounded-lg border hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Export
          </button>

          <label className="px-3 py-2 rounded-lg border hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
            <Upload className="h-4 w-4" />
            Import
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importJSON(f);
                e.currentTarget.value = ""; // allow re-upload same file
              }}
            />
          </label>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Policies</p>
              <p className="text-2xl font-bold text-blue-600">{computed.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Coverage</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{(computed.totalCoverage / 100000).toFixed(0)}L
              </p>
            </div>
            <Shield className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Annualised Premium</p>
              <p className="text-2xl font-bold text-purple-600">{INR(computed.totalAnnualPremium)}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon (≤ 30 days)</p>
              <p className="text-2xl font-bold text-orange-600">{computed.expiring}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200 flex">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
        </div>

        <div className="p-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-3">
              {policies.length === 0 ? (
                <p className="text-gray-500">No policies added yet.</p>
              ) : (
                policies.map((policy) => {
                  const { status, daysLeft } = computeStatus(policy);
                  return (
                    <div
                      key={policy.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{policy.type || "—"}</p>
                        <p className="text-sm text-gray-600">{policy.provider || "—"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className="text-sm">{status}</span>
                        <span className="text-xs text-gray-500">
                          {status === "Expired"
                            ? `${Math.abs(daysLeft)} days ago`
                            : `${daysLeft} days left`}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Policies List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search provider, policy number, type…"
              className="w-full pl-9 pr-3 py-2 rounded-md border"
            />
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 bg-black text-white hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {filtered.length === 0 ? (
            <p className="text-gray-500">No policies found.</p>
          ) : (
            filtered.map((policy) => {
              const { status, daysLeft } = computeStatus(policy);
              const nextDue = nextDueFrom(policy);
              return (
                <div key={policy.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{policy.type || "—"}</h3>
                      <p className="text-gray-600">{policy.provider || "—"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      <span className="text-sm font-medium">{status}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Policy Number</span>
                      <span className="font-medium">{policy.policyNumber || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coverage</span>
                      <span className="font-medium text-green-600">{INR(policy.coverageAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Premium ({policy.frequency})</span>
                      <span className="font-medium text-blue-600">{INR(policy.premium)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annualised Premium</span>
                      <span className="font-medium">{INR(annualizedPremium(policy))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Policy Period</span>
                      <span className="font-medium">
                        {policy.startDate} → {policy.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Due</span>
                      <span className="font-medium">
                        {new Date(nextDue).toLocaleDateString()}{" "}
                        <span className="text-xs text-gray-500">
                          ({status === "Expired"
                            ? `${Math.abs(daysLeft)} days ago`
                            : `${daysLeft} days left`})
                        </span>
                      </span>
                    </div>
                    {policy.notes ? (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Notes</span>
                        <span className="font-medium text-gray-700 text-right">{policy.notes}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                    <button
                      onClick={() => markPaid(policy)}
                      className="px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm"
                    >
                      Mark Paid
                    </button>
                    <button
                      onClick={() => openEdit(policy)}
                      className="px-3 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-1 text-sm"
                    >
                      <Edit2 className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={() => remove(policy.id)}
                      className="px-3 py-2 border rounded-lg hover:bg-red-50 text-red-600 border-red-200 flex items-center gap-1 text-sm"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit Policy" : "Add New Policy"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <input
                    type="text"
                    value={form.type}
                    onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., Life Insurance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <input
                    type="text"
                    value={form.provider}
                    onChange={(e) => setForm((s) => ({ ...s, provider: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="LIC India / HDFC Life / etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
                  <input
                    type="text"
                    value={form.policyNumber}
                    onChange={(e) => setForm((s) => ({ ...s, policyNumber: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., LIC-123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    value={form.frequency}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, frequency: e.target.value as Frequency }))
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Premium (per {form.frequency})
                  </label>
                  <input
                    type="number"
                    value={form.premium}
                    onChange={(e) => setForm((s) => ({ ...s, premium: parseNum(e.target.value) }))}
                    required
                    min={1}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="25000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coverage Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={form.coverageAmount}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, coverageAmount: parseNum(e.target.value) }))
                    }
                    required
                    min={1}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="1000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((s) => ({ ...s, startDate: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((s) => ({ ...s, endDate: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Paid Date (optional)
                  </label>
                  <input
                    type="date"
                    value={form.lastPaidDate || ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, lastPaidDate: e.target.value || undefined }))
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={form.notes || ""}
                    onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Nominee, claim steps, support contact, etc."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50 flex items-center gap-2"
                >
                  <X className="h-4 w-4" /> Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" /> {editingId ? "Update" : "Add Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insurance;
