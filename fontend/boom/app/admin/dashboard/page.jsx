"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  writeBatch,
  increment,
} from "firebase/firestore";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  Activity,
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Bell,
  CheckCircle2,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

import { auth, db } from "@/lib/firebase";


// ============================================================
// HELPERS
// ============================================================

const formatUSD = (value) => {
  const number = Number(value || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const formatDate = (value) => {
  if (!value) return "—";

  try {
    let date;

    if (value?.toDate) {
      date = value.toDate();
    } else if (value?.seconds) {
      date = new Date(value.seconds * 1000);
    } else {
      date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "—";
  }
};

const formatShortDate = (value) => {
  if (!value) return "—";

  try {
    let date;

    if (value?.toDate) {
      date = value.toDate();
    } else if (value?.seconds) {
      date = new Date(value.seconds * 1000);
    } else {
      date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return "—";
  }
};

const getTimestampValue = (value) => {
  if (!value) return 0;

  if (typeof value === "number") {
    return value;
  }

  if (value?.seconds) {
    return value.seconds * 1000;
  }

  if (value?.toDate) {
    return value.toDate().getTime();
  }

  const parsed = new Date(value).getTime();

  return Number.isNaN(parsed) ? 0 : parsed;
};

const getStatusClasses = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (
    normalized === "approved" ||
    normalized === "completed" ||
    normalized === "success" ||
    normalized === "successful" ||
    normalized === "active"
  ) {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  }

  if (
    normalized === "pending" ||
    normalized === "processing"
  ) {
    return "border-amber-500/20 bg-amber-500/10 text-amber-400";
  }

  if (
    normalized === "rejected" ||
    normalized === "failed" ||
    normalized === "cancelled" ||
    normalized === "suspended"
  ) {
    return "border-red-500/20 bg-red-500/10 text-red-400";
  }

  return "border-slate-500/20 bg-slate-500/10 text-slate-400";
};

const getInitials = (name, email) => {
  const source = String(name || email || "U").trim();

  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
};


// ============================================================
// ADMIN DASHBOARD
// ============================================================

export default function AdminDashboardPage() {
  const router = useRouter();

  // ----------------------------------------------------------
  // AUTH
  // ----------------------------------------------------------

  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ----------------------------------------------------------
  // DATA
  // ----------------------------------------------------------

  const [stats, setStats] = useState({
    totalUsers: 0,
    confirmedDeposits: 0,
    withdrawals: 0,
    totalInvested: 0,
  });

  const [users, setUsers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [search, setSearch] = useState("");
  const [notif, setNotif] = useState("");
  const [sendingNotification, setSendingNotification] =
    useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [actionMessage, setActionMessage] = useState({
    type: "",
    text: "",
  });

  // ==========================================================
  // AUTHENTICATION
  // ==========================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          router.replace("/admin/login");
          return;
        }

        const tokenResult = await user.getIdTokenResult(true);

        if (tokenResult.claims?.admin !== true) {
          await signOut(auth);

          router.replace("/admin/login");
          return;
        }

        setAdminUser({
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "Administrator",
        });
      } catch (authError) {
        console.error("Admin authentication error:", authError);

        await signOut(auth).catch(() => {});

        router.replace("/admin/login");
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // ==========================================================
  // LOAD USERS
  // ==========================================================

  const loadUsers = async () => {
    const usersRef = collection(db, "users");

    const snapshot = await getDocs(usersRef);

    const result = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    result.sort(
      (a, b) =>
        getTimestampValue(b.createdAt) -
        getTimestampValue(a.createdAt)
    );

    setUsers(result);

    return result;
  };

  // ==========================================================
  // LOAD DEPOSITS
  // ==========================================================

  const loadDeposits = async () => {
    const depositsRef = collection(db, "deposits");

    let result = [];

    try {
      const orderedQuery = query(
        depositsRef,
        orderBy("createdAt", "desc"),
        limit(100)
      );

      const snapshot = await getDocs(orderedQuery);

      result = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
    } catch (queryError) {
      console.warn(
        "Ordered deposits query failed. Loading without order:",
        queryError
      );

      const snapshot = await getDocs(depositsRef);

      result = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      result.sort(
        (a, b) =>
          getTimestampValue(b.createdAt) -
          getTimestampValue(a.createdAt)
      );

      result = result.slice(0, 100);
    }

    setDeposits(result);

    return result;
  };

  // ==========================================================
  // LOAD WITHDRAWALS
  // ==========================================================

  const loadWithdrawals = async () => {
    const withdrawalsRef = collection(db, "withdrawals");

    let result = [];

    try {
      const orderedQuery = query(
        withdrawalsRef,
        orderBy("createdAt", "desc"),
        limit(100)
      );

      const snapshot = await getDocs(orderedQuery);

      result = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
    } catch (queryError) {
      console.warn(
        "Ordered withdrawals query failed. Loading without order:",
        queryError
      );

      const snapshot = await getDocs(withdrawalsRef);

      result = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      result.sort(
        (a, b) =>
          getTimestampValue(b.createdAt) -
          getTimestampValue(a.createdAt)
      );

      result = result.slice(0, 100);
    }

    setWithdrawals(result);

    return result;
  };

  // ==========================================================
  // LOAD TRANSACTIONS
  // ==========================================================

  const loadTransactions = async () => {
    const transactionsRef = collection(db, "transactions");

    let result = [];

    try {
      const orderedQuery = query(
        transactionsRef,
        orderBy("createdAt", "desc"),
        limit(200)
      );

      const snapshot = await getDocs(orderedQuery);

      result = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
    } catch (queryError) {
      console.warn(
        "Ordered transactions query failed. Loading without order:",
        queryError
      );

      const snapshot = await getDocs(transactionsRef);

      result = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      result.sort(
        (a, b) =>
          getTimestampValue(b.createdAt) -
          getTimestampValue(a.createdAt)
      );

      result = result.slice(0, 200);
    }

    setTransactions(result);

    return result;
  };

  // ==========================================================
  // CALCULATE STATS
  // ==========================================================

  const calculateStats = (
    loadedUsers,
    loadedDeposits,
    loadedWithdrawals
  ) => {
    const totalUsers = loadedUsers.length;

    const confirmedDeposits = loadedDeposits
      .filter((item) => {
        const status = String(
          item.status || ""
        ).toLowerCase();

        return (
          status === "approved" ||
          status === "completed" ||
          status === "confirmed" ||
          status === "successful" ||
          status === "success"
        );
      })
      .reduce(
        (total, item) =>
          total + Number(item.amount || 0),
        0
      );

    const withdrawalTotal = loadedWithdrawals
      .filter((item) => {
        const status = String(
          item.status || ""
        ).toLowerCase();

        return (
          status === "approved" ||
          status === "completed" ||
          status === "confirmed" ||
          status === "successful" ||
          status === "success"
        );
      })
      .reduce(
        (total, item) =>
          total + Number(item.amount || 0),
        0
      );

    const totalInvested = loadedUsers.reduce(
      (total, user) =>
        total + Number(user.totalInvested || 0),
      0
    );

    setStats({
      totalUsers,
      confirmedDeposits,
      withdrawals: withdrawalTotal,
      totalInvested,
    });
  };

  // ==========================================================
  // LOAD EVERYTHING
  // ==========================================================

  const loadDashboard = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [
        loadedUsers,
        loadedDeposits,
        loadedWithdrawals,
        loadedTransactions,
      ] = await Promise.all([
        loadUsers(),
        loadDeposits(),
        loadWithdrawals(),
        loadTransactions(),
      ]);

      calculateStats(
        loadedUsers,
        loadedDeposits,
        loadedWithdrawals
      );
    } catch (loadError) {
      console.error(
        "Failed to load admin dashboard:",
        loadError
      );

      if (
        loadError?.code === "permission-denied" ||
        loadError?.code === "firestore/permission-denied"
      ) {
        setError(
          "Firestore denied access to the admin dashboard. Check your Firestore Security Rules and make sure this account has the admin claim."
        );
      } else {
        setError(
          loadError?.message ||
            "Unable to load dashboard data."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    if (!adminUser) return;

    loadDashboard(false);

    const interval = setInterval(() => {
      loadDashboard(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [adminUser]);

  // ==========================================================
  // APPROVE DEPOSIT
  // ==========================================================

  const approveDeposit = async (deposit) => {
    if (!deposit?.id) return;

    const status = String(
      deposit.status || ""
    ).toLowerCase();

    if (
      status === "approved" ||
      status === "completed" ||
      status === "confirmed" ||
      status === "successful"
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Approve this deposit of ${formatUSD(
        deposit.amount
      )}?`
    );

    if (!confirmed) return;

    setProcessingId(deposit.id);
    setActionMessage({
      type: "",
      text: "",
    });

    try {
      const userId =
        deposit.userId ||
        deposit.uid ||
        deposit.user_id;

      if (!userId) {
        throw new Error(
          "This deposit does not have a user ID."
        );
      }

      const userRef = doc(db, "users", userId);

      const depositRef = doc(
        db,
        "deposits",
        deposit.id
      );

      const transactionRef = doc(
        collection(db, "transactions")
      );

      const amount = Number(deposit.amount || 0);

      if (amount <= 0) {
        throw new Error(
          "The deposit amount is invalid."
        );
      }

      const batch = writeBatch(db);

      batch.update(depositRef, {
        status: "approved",
        approvedAt: serverTimestamp(),
        approvedBy: adminUser.uid,
        updatedAt: serverTimestamp(),
      });

      batch.update(userRef, {
        balance: increment(amount),
        totalDeposited: increment(amount),
        updatedAt: serverTimestamp(),
      });

      batch.set(transactionRef, {
        userId,
        type: "deposit",
        category: "deposit",
        amount,
        status: "completed",
        reference:
          deposit.reference ||
          deposit.paymentReference ||
          deposit.id,
        description: "Deposit approved by administrator",
        source: "admin",
        relatedDepositId: deposit.id,
        createdAt: serverTimestamp(),
        createdBy: adminUser.uid,
      });

      await batch.commit();

      setActionMessage({
        type: "success",
        text: "Deposit approved successfully.",
      });

      await loadDashboard(true);
    } catch (actionError) {
      console.error(
        "Approve deposit error:",
        actionError
      );

      setActionMessage({
        type: "error",
        text:
          actionError?.message ||
          "Unable to approve deposit.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================================
  // REJECT DEPOSIT
  // ==========================================================

  const rejectDeposit = async (deposit) => {
    if (!deposit?.id) return;

    const confirmed = window.confirm(
      `Reject this deposit of ${formatUSD(
        deposit.amount
      )}?`
    );

    if (!confirmed) return;

    setProcessingId(deposit.id);
    setActionMessage({
      type: "",
      text: "",
    });

    try {
      const depositRef = doc(
        db,
        "deposits",
        deposit.id
      );

      await updateDoc(depositRef, {
        status: "rejected",
        rejectedAt: serverTimestamp(),
        rejectedBy: adminUser.uid,
        updatedAt: serverTimestamp(),
      });

      setActionMessage({
        type: "success",
        text: "Deposit rejected successfully.",
      });

      await loadDashboard(true);
    } catch (actionError) {
      console.error(
        "Reject deposit error:",
        actionError
      );

      setActionMessage({
        type: "error",
        text:
          actionError?.message ||
          "Unable to reject deposit.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================================
  // APPROVE WITHDRAWAL
  // ==========================================================

  const approveWithdrawal = async (withdrawal) => {
    if (!withdrawal?.id) return;

    const status = String(
      withdrawal.status || ""
    ).toLowerCase();

    if (
      status === "approved" ||
      status === "completed" ||
      status === "confirmed" ||
      status === "successful"
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Approve this withdrawal of ${formatUSD(
        withdrawal.amount
      )}?`
    );

    if (!confirmed) return;

    setProcessingId(withdrawal.id);
    setActionMessage({
      type: "",
      text: "",
    });

    try {
      const userId =
        withdrawal.userId ||
        withdrawal.uid ||
        withdrawal.user_id;

      if (!userId) {
        throw new Error(
          "This withdrawal does not have a user ID."
        );
      }

      const amount = Number(
        withdrawal.amount || 0
      );

      if (amount <= 0) {
        throw new Error(
          "The withdrawal amount is invalid."
        );
      }

      const userRef = doc(db, "users", userId);

      const withdrawalRef = doc(
        db,
        "withdrawals",
        withdrawal.id
      );

      const transactionRef = doc(
        collection(db, "transactions")
      );

      const batch = writeBatch(db);

      batch.update(withdrawalRef, {
        status: "approved",
        approvedAt: serverTimestamp(),
        approvedBy: adminUser.uid,
        updatedAt: serverTimestamp(),
      });

      batch.update(userRef, {
        totalWithdrawn: increment(amount),
        updatedAt: serverTimestamp(),
      });

      batch.set(transactionRef, {
        userId,
        type: "withdrawal",
        category: "withdrawal",
        amount,
        status: "completed",
        reference:
          withdrawal.reference ||
          withdrawal.id,
        description:
          "Withdrawal approved by administrator",
        source: "admin",
        relatedWithdrawalId: withdrawal.id,
        createdAt: serverTimestamp(),
        createdBy: adminUser.uid,
      });

      await batch.commit();

      setActionMessage({
        type: "success",
        text: "Withdrawal approved successfully.",
      });

      await loadDashboard(true);
    } catch (actionError) {
      console.error(
        "Approve withdrawal error:",
        actionError
      );

      setActionMessage({
        type: "error",
        text:
          actionError?.message ||
          "Unable to approve withdrawal.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================================
  // REJECT WITHDRAWAL
  // ==========================================================

  const rejectWithdrawal = async (withdrawal) => {
    if (!withdrawal?.id) return;

    const confirmed = window.confirm(
      `Reject this withdrawal of ${formatUSD(
        withdrawal.amount
      )}?`
    );

    if (!confirmed) return;

    setProcessingId(withdrawal.id);
    setActionMessage({
      type: "",
      text: "",
    });

    try {
      const withdrawalRef = doc(
        db,
        "withdrawals",
        withdrawal.id
      );

      await updateDoc(withdrawalRef, {
        status: "rejected",
        rejectedAt: serverTimestamp(),
        rejectedBy: adminUser.uid,
        updatedAt: serverTimestamp(),
      });

      setActionMessage({
        type: "success",
        text: "Withdrawal rejected successfully.",
      });

      await loadDashboard(true);
    } catch (actionError) {
      console.error(
        "Reject withdrawal error:",
        actionError
      );

      setActionMessage({
        type: "error",
        text:
          actionError?.message ||
          "Unable to reject withdrawal.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================================
  // BROADCAST NOTIFICATION
  // ==========================================================

  const sendBroadcast = async () => {
    const message = notif.trim();

    if (!message) {
      setActionMessage({
        type: "error",
        text: "Please enter an announcement.",
      });

      return;
    }

    if (message.length > 500) {
      setActionMessage({
        type: "error",
        text:
          "Announcement must be 500 characters or less.",
      });

      return;
    }

    setSendingNotification(true);
    setActionMessage({
      type: "",
      text: "",
    });

    try {
      await addDoc(collection(db, "notifications"), {
        type: "broadcast",
        title: "Energy-Vest Announcement",
        message,
        audience: "all",
        createdBy: adminUser.uid,
        createdByEmail: adminUser.email || "",
        createdAt: serverTimestamp(),
        status: "active",
      });

      setNotif("");

      setActionMessage({
        type: "success",
        text: "Announcement broadcast successfully.",
      });
    } catch (notificationError) {
      console.error(
        "Broadcast notification error:",
        notificationError
      );

      setActionMessage({
        type: "error",
        text:
          notificationError?.message ||
          "Unable to broadcast announcement.",
      });
    } finally {
      setSendingNotification(false);
    }
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = async () => {
    try {
      await signOut(auth);

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("firebaseToken");
        localStorage.removeItem("admin");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("user");
        localStorage.removeItem("googleUser");
      }

      router.replace("/admin/login");
    } catch (logoutError) {
      console.error(
        "Logout error:",
        logoutError
      );
    }
  };

  // ==========================================================
  // FILTER TRANSACTIONS
  // ==========================================================

  const filteredTransactions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return transactions;
    }

    return transactions.filter((transaction) => {
      const values = [
        transaction.id,
        transaction.userId,
        transaction.email,
        transaction.type,
        transaction.category,
        transaction.status,
        transaction.reference,
        transaction.description,
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(term)
      );
    });
  }, [transactions, search]);

  // ==========================================================
  // PENDING DEPOSITS
  // ==========================================================

  const pendingDeposits = useMemo(() => {
    return deposits.filter((deposit) => {
      const status = String(
        deposit.status || "pending"
      ).toLowerCase();

      return (
        status === "pending" ||
        status === "processing"
      );
    });
  }, [deposits]);

  // ==========================================================
  // PENDING WITHDRAWALS
  // ==========================================================

  const pendingWithdrawals = useMemo(() => {
    return withdrawals.filter((withdrawal) => {
      const status = String(
        withdrawal.status || "pending"
      ).toLowerCase();

      return (
        status === "pending" ||
        status === "processing"
      );
    });
  }, [withdrawals]);

  // ==========================================================
  // AUTH LOADING
  // ==========================================================

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
            <LoaderIcon />
          </div>

          <p className="mt-5 text-sm text-slate-400">
            Verifying administrator access...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================================
  // MAIN DASHBOARD
  // ==========================================================

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>

            <div>
              <p className="text-base font-bold text-white">
                Energy-Vest Admin
              </p>

              <p className="hidden text-xs text-slate-500 sm:block">
                Financial operations console
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-5 md:flex">

            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Administrator
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-white">
                {adminUser?.displayName ||
                  "Administrator"}
              </p>

              <p className="text-xs text-slate-500">
                {adminUser?.email || ""}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-300 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (previous) => !previous
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 px-4 py-4 md:hidden">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">
                {adminUser?.displayName ||
                  "Administrator"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {adminUser?.email || ""}
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ======================================================
          CONTENT
      ======================================================= */}

      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure administrator session
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Dashboard overview
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Live operational data from the Energy-Vest
              Firestore database.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            {refreshing
              ? "Refreshing..."
              : "Refresh data"}
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

            <div>
              <p className="text-sm font-semibold text-red-300">
                Dashboard error
              </p>

              <p className="mt-1 text-sm leading-6 text-red-300/80">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ACTION MESSAGE */}

        {actionMessage.text && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 ${
              actionMessage.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/10"
                : "border-red-500/20 bg-red-500/10"
            }`}
          >
            {actionMessage.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            )}

            <p
              className={`text-sm ${
                actionMessage.type === "success"
                  ? "text-emerald-300"
                  : "text-red-300"
              }`}
            >
              {actionMessage.text}
            </p>
          </div>
        )}

        {/* ======================================================
            STATS GRID
        ======================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Total Users</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-white">
              {loading ? "—" : stats.totalUsers}
            </p>
            <p className="mt-1 text-xs text-slate-500">Registered investor accounts</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Confirmed Deposits</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <ArrowDownToLine className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-white">
              {loading ? "—" : formatUSD(stats.confirmedDeposits)}
            </p>
            <p className="mt-1 text-xs text-slate-500">Approved platform deposits</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Total Withdrawals</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                <ArrowUpFromLine className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-white">
              {loading ? "—" : formatUSD(stats.withdrawals)}
            </p>
            <p className="mt-1 text-xs text-slate-500">Processed payout requests</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Active Investments</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10">
                <Wallet className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-white">
              {loading ? "—" : formatUSD(stats.totalInvested)}
            </p>
            <p className="mt-1 text-xs text-slate-500">Total capital deployed</p>
          </div>

        </div>

        {/* ======================================================
            BROADCAST ANNOUNCEMENT
        ======================================================= */}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
              <Bell className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Broadcast Announcement</h2>
              <p className="text-xs text-slate-500">Send system-wide notification to all users</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={notif}
              onChange={(e) => setNotif(e.target.value)}
              placeholder="Type announcement message..."
              className="w-full flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            />
            <button
              type="button"
              onClick={sendBroadcast}
              disabled={sendingNotification || !notif.trim()}
              className="flex h-11 items-center justify-center gap-2 shrink-0 rounded-xl bg-emerald-500 px-6 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Send className="h-4 w-4" />
              {sendingNotification ? "Broadcasting..." : "Broadcast"}
            </button>
          </div>
        </div>

        {/* ======================================================
            PENDING DEPOSITS & WITHDRAWALS
        ======================================================= */}

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">

          {/* PENDING DEPOSITS */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                  <ArrowDownToLine className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">Pending Deposits</h2>
                  <p className="text-xs text-slate-500">{pendingDeposits.length} awaiting verification</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {loading ? (
                <div className="py-8 text-center text-sm text-slate-500">Loading deposits...</div>
              ) : pendingDeposits.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">No pending deposits</div>
              ) : (
                pendingDeposits.map((deposit) => (
                  <div
                    key={deposit.id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="text-base font-bold text-white">{formatUSD(deposit.amount)}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{deposit.userEmail || deposit.email || deposit.userId}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{formatDate(deposit.createdAt)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => approveDeposit(deposit)}
                        disabled={processingId === deposit.id}
                        className="flex h-9 items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectDeposit(deposit)}
                        disabled={processingId === deposit.id}
                        className="flex h-9 items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PENDING WITHDRAWALS */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                  <ArrowUpFromLine className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">Pending Withdrawals</h2>
                  <p className="text-xs text-slate-500">{pendingWithdrawals.length} awaiting authorization</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {loading ? (
                <div className="py-8 text-center text-sm text-slate-500">Loading withdrawals...</div>
              ) : pendingWithdrawals.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">No pending withdrawals</div>
              ) : (
                pendingWithdrawals.map((withdrawal) => (
                  <div
                    key={withdrawal.id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="text-base font-bold text-white">{formatUSD(withdrawal.amount)}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{withdrawal.userEmail || withdrawal.email || withdrawal.userId}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{formatDate(withdrawal.createdAt)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => approveWithdrawal(withdrawal)}
                        disabled={processingId === withdrawal.id}
                        className="flex h-9 items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectWithdrawal(withdrawal)}
                        disabled={processingId === withdrawal.id}
                        className="flex h-9 items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* ======================================================
            REGISTERED USERS TABLE
        ======================================================= */}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Registered Users</h2>
                <p className="text-xs text-slate-500">{users.length} total registered accounts</p>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-slate-400">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Balance</th>
                  <th className="pb-3 font-medium">Invested</th>
                  <th className="pb-3 font-medium">Deposited</th>
                  <th className="pb-3 font-medium">Withdrawn</th>
                  <th className="pb-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="text-slate-300">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white">
                            {getInitials(u.displayName || u.fullName || u.name, u.email)}
                          </div>
                          <div>
                            <p className="font-medium text-white">{u.displayName || u.fullName || u.name || "Unnamed User"}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-white">{formatUSD(u.balance)}</td>
                      <td className="py-4">{formatUSD(u.totalInvested)}</td>
                      <td className="py-4 text-emerald-400">{formatUSD(u.totalDeposited)}</td>
                      <td className="py-4 text-amber-400">{formatUSD(u.totalWithdrawn)}</td>
                      <td className="py-4 text-xs text-slate-500">{formatShortDate(u.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ======================================================
            TRANSACTION LOG
        ======================================================= */}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10">
                <Activity className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">System Transactions</h2>
                <p className="text-xs text-slate-500">Audit log of system activities</p>
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-slate-400">
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">User / Email</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      Loading transactions...
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No matching transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="text-slate-300">
                      <td className="py-4 font-medium capitalize text-white">
                        {tx.type || tx.category || "Transaction"}
                      </td>
                      <td className="py-4 text-xs text-slate-400">
                        {tx.email || tx.userId || "—"}
                      </td>
                      <td className="py-4 font-semibold text-white">
                        {formatUSD(tx.amount)}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusClasses(
                            tx.status
                          )}`}
                        >
                          {tx.status || "Pending"}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-slate-400">
                        {tx.description || tx.reference || "—"}
                      </td>
                      <td className="py-4 text-xs text-slate-500">
                        {formatDate(tx.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}

// ============================================================
// HELPER COMPONENTS
// ============================================================

function LoaderIcon() {
  return (
    <svg
      className="h-6 w-6 animate-spin text-emerald-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}