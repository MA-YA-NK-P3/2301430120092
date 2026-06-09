"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface Notification {
  id: string;
  recipient_id: string;
  type: string;
  priority: string;
  title: string;
  message: string;
  notification_type?: string;
  status: string;
  is_read: boolean;
  created_at: string;
  [key: string]: any;
}

interface PriorityNotification extends Notification {
  priority_score?: number;
  weight?: number;
  recency_score?: number;
}

export default function PriorityInboxPage() {
  const [notifications, setNotifications] = useState<PriorityNotification[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topN, setTopN] = useState(10);

  useEffect(() => {
    fetchAndCalculatePriority();
  }, [topN]);

  const fetchAndCalculatePriority = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch notifications from the local API route
      const response = await fetch("/api/notifications");

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const allNotifications = Array.isArray(data) ? data : [];

      // Filter unread notifications
      const unreadNotifications = allNotifications.filter(
        (n: Notification) => !n.is_read
      );

      // Calculate priority scores
      const priorityNotifications = unreadNotifications
        .map((notif: Notification) => {
          const score = calculatePriorityScore(notif);
          return {
            ...notif,
            priority_score: score,
            weight: getWeight(notif),
            recency_score: getRecencyScore(notif.created_at),
          };
        })
        .sort((a: PriorityNotification, b: PriorityNotification) => {
          return (b.priority_score || 0) - (a.priority_score || 0);
        })
        .slice(0, topN);

      setNotifications(priorityNotifications);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch notifications. Make sure the API is running.";
      setError(errorMessage);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculatePriorityScore = (notification: Notification): number => {
    const weight = getWeight(notification);
    const recencyScore = getRecencyScore(notification.created_at);
    const priorityBoost = getPriorityBoost(notification.priority);

    return weight * 100 * priorityBoost + recencyScore;
  };

  const getWeight = (notification: Notification): number => {
    const type = notification.notification_type || "Event";
    const weights: { [key: string]: number } = {
      Placement: 3,
      Result: 2,
      Event: 1,
    };
    return weights[type] || 1;
  };

  const getRecencyScore = (createdAt: string): number => {
    const notificationTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const ageInMinutes = (currentTime - notificationTime) / (1000 * 60);

    if (ageInMinutes < 60) return 100;
    if (ageInMinutes < 24 * 60) return 50;
    return 10;
  };

  const getPriorityBoost = (priority: string): number => {
    const boosts: { [key: string]: number } = {
      urgent: 1.5,
      high: 1.2,
      normal: 1.0,
      low: 0.8,
    };
    return boosts[priority] || 1.0;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority: string): string => {
    const colors: { [key: string]: string } = {
      urgent: "#ff4444",
      high: "#ff9800",
      normal: "#2196f3",
      low: "#4caf50",
    };
    return colors[priority] || "#2196f3";
  };

  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      Placement: "#1976d2",
      Result: "#7b1fa2",
      Event: "#388e3c",
    };
    return colors[type] || "#666";
  };

  const getTypeIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      Placement: "💼",
      Result: "📊",
      Event: "📅",
    };
    return icons[type] || "📬";
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.backButton}>
            ← Back to Home
          </Link>
          <h1 className={styles.title}>⭐ Priority Inbox</h1>
          <p className={styles.subtitle}>
            Your top {topN} most important unread notifications
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.topNSelector}>
            <label htmlFor="topN">Show top:</label>
            <select
              id="topN"
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value))}
              className={styles.select}
            >
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
              <option value={15}>Top 15</option>
              <option value={20}>Top 20</option>
            </select>
          </div>
          <button
            onClick={fetchAndCalculatePriority}
            className={styles.refreshButton}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className={styles.errorBox}>
            <span className={styles.errorIcon}>⚠️</span>
            <div>
              <p className={styles.errorTitle}>Error Loading Notifications</p>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading notifications...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && notifications.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h2>No Unread Notifications</h2>
            <p>You're all caught up! Check back later for new notifications.</p>
            <Link href="/all-notifications" className={styles.link}>
              View All Notifications →
            </Link>
          </div>
        )}

        {/* Notifications List */}
        {!loading && !error && notifications.length > 0 && (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Total Unread:</span>
                <span className={styles.statValue}>{notifications.length}</span>
              </div>
            </div>

            <div className={styles.notificationsList}>
              {notifications.map((notif, index) => (
                <div
                  key={notif.id}
                  className={`${styles.notificationCard} ${
                    notif.is_read ? styles.read : styles.unread
                  } fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Unread Indicator */}
                  {!notif.is_read && (
                    <div className={styles.unreadIndicator}>●</div>
                  )}

                  <div className={styles.notificationContent}>
                    {/* Header */}
                    <div className={styles.notificationHeader}>
                      <div className={styles.titleSection}>
                        <span className={styles.typeIcon}>
                          {getTypeIcon(notif.notification_type || "Event")}
                        </span>
                        <h3 className={styles.notificationTitle}>
                          {notif.title}
                        </h3>
                      </div>
                      <div className={styles.badges}>
                        <span
                          className={styles.typeBadge}
                          style={{
                            color: getTypeColor(notif.notification_type || "Event"),
                          }}
                        >
                          {notif.notification_type || "Event"}
                        </span>
                        <span
                          className={styles.priorityBadge}
                          style={{
                            borderColor: getPriorityColor(notif.priority),
                            color: getPriorityColor(notif.priority),
                          }}
                        >
                          {notif.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Message */}
                    <p className={styles.notificationMessage}>
                      {notif.message}
                    </p>

                    {/* Footer */}
                    <div className={styles.notificationFooter}>
                      <span className={styles.time}>
                        {formatDate(notif.created_at)}
                      </span>
                      <div className={styles.scoreInfo}>
                        <span className={styles.scoreLabel}>Priority:</span>
                        <span className={styles.score}>
                          {(notif.priority_score || 0).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Accent */}
                  <div
                    className={styles.accent}
                    style={{
                      backgroundColor: getPriorityColor(notif.priority),
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Info Box */}
        <div className={styles.infoBox}>
          <h3>💡 How Priority is Calculated</h3>
          <p>
            Priority = (Weight × 100 × Priority Multiplier) + Recency Bonus
          </p>
          <ul>
            <li>
              <strong>Weight:</strong> Placement (3) → Result (2) → Event (1)
            </li>
            <li>
              <strong>Recency:</strong> Last hour (+100) → Last 24h (+50) →
              Older (+10)
            </li>
            <li>
              <strong>Multiplier:</strong> Urgent (1.5x) → High (1.2x) → Normal
              (1x) → Low (0.8x)
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <Link href="/all-notifications">View All Notifications →</Link>
      </footer>
    </div>
  );
}
