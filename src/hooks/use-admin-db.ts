"use client";

import { useCallback, useMemo, useState } from "react";
import { createId, loadDB, saveDB, type AdminDB } from "@/lib/admin-store";

export function useAdminDB() {
  const [db, setDb] = useState<AdminDB | null>(() => (typeof window === "undefined" ? null : loadDB()));

  const update = useCallback((recipe: (prev: AdminDB) => AdminDB) => {
    setDb((prev) => {
      if (!prev) return prev;
      const next = recipe(prev);
      saveDB(next);
      return next;
    });
  }, []);

  const kpis = useMemo(() => {
    if (!db) return null;
    const revenue = db.orders.reduce((sum, order) => sum + order.amount, 0);
    const activeUsers = db.users.length;
    const totalCards = db.cards.length;
    return {
      totalOrders: db.orders.length,
      revenue,
      activeUsers,
      totalCards,
      activity: db.activity.slice(0, 8),
      totalTaps: db.cards.reduce((sum, card) => sum + card.taps, 0),
      linkClicks: db.profiles.length * 110,
    };
  }, [db]);

  return { db, update, kpis, createId };
}
