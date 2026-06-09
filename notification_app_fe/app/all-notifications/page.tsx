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

type FilterType = "all" | "Placement" | "Result" | "Event";
type ReadFilter = "all" | "read" | "unread";

export default function AllNotificationsPage() {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [allNotifications, typeFilter, readFilter, searchQuery]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/notifications");

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const notifications = Array.isArray(data) ? data : [];
      setAllNotifications(notifications);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch notifications";
      setError(errorMessage);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = allNotifications;

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (n) => (n.notification_type || "Event") === typeFilter
      );
    }

    // Filter by read status
    if (readFilter === "read") {
      filtered = filtered.filter((n) => n.is_read);
    } else if (readFilter === "unread") {
      filtered = filtered.filter((n) => !n.is_read);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query)
      );
    }

    setFilteredNotifications(filtered);
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

  const unreadCount = allNotifications.filter((n) => !n.is_read).length;
  const placementCount = allNotifications.filter(
    (n) => n.notification_type === "Placement"
  ).length;
  const resultCount = allNotifications.filter(
    (n) => n.notification_type === "Result"
  ).length;
  const eventCount = allNotifications.filter(
    (n) => n.notification_type === "Event"
  ).length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.backButton}>
            ← Back to Home
          </Link>
          <h1 className={styles.title}>📭 All Notifications</h1>
          <p className={styles.subtitle}>
            Browse and manage all your notifications
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Quick Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📬</span>
            <div>
              <p className={styles.statLabel}>Total</p>
              <p className={styles.statNumber}>{allNotifications.length}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>🔴</span>
            <div>
              <p className={styles.statLabel}>Unread</p>
              <p className={styles.statNumber}>{unreadCount}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>💼</span>
            <div>
              <p className={styles.statLabel}>Placement</p>
              <p className={styles.statNumber}>{placementCount}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📊</span>
            <div>
              <p className={styles.statLabel}>Results</p>
              <p className={styles.statNumber}>{resultCount}</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label>Type:</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as FilterType)}
                className={styles.filterSelect}
              >
                <option value="all">All Types</option>
                <option value="Placement">Placement</option>
                <option value="Result">Result</option>
                <option value="Event">Event</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Status:</label>
              <select
                value={readFilter}
                onChange={(e) => setReadFilter(e.target.value as ReadFilter)}
                className={styles.filterSelect}
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>

            <button
              onClick={fetchNotifications}
              className={styles.refreshButton}
            >
              🔄 Refresh
            </button>
          </div>
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
        {!loading && !error && filteredNotifications.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h2>No Notifications Found</h2>
            <p>
              {searchQuery
                ? "No notifications match your search."
                : "You have no notifications yet."}
            </p>
          </div>
        )}

        {/* Notifications List */}
        {!loading && !error && filteredNotifications.length > 0 && (
          <>
            <div className={styles.resultsInfo}>
              Showing {filteredNotifications.length} of{" "}
              {allNotifications.length} notifications
            </div>

            <div className={styles.notificationsList}>
              {filteredNotifications.map((notif, index) => (
                <div
                  key={notif.id}
                  className={`${styles.notificationCard} ${
                    notif.is_read ? styles.read : styles.unread
                  } fade-in`}
                  style={{ animationDelay: `${index * 0.05}s` }}
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
                        <div>
                          <h3 className={styles.notificationTitle}>
                            {notif.title}
                          </h3>
                          <p className={styles.meta}>
                            {notif.notification_type || "Event"} •{" "}
                            {formatDate(notif.created_at)}
                          </p>
                        </div>
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
                        {notif.is_read && (
                          <span className={styles.readBadge}>✓ Read</span>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <p className={styles.notificationMessage}>
                      {notif.message}
                    </p>

                    {/* Status */}
                    <div className={styles.notificationFooter}>
                      <span className={styles.status}>{notif.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Link to Priority Inbox */}
        <div className={styles.linkBox}>
          <Link href="/priority-inbox" className={styles.linkButton}>
            ⭐ View Priority Inbox (Top 10)
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          Showing {filteredNotifications.length} notification
          {filteredNotifications.length !== 1 ? "s" : ""}
        </p>
      </footer>
    </div>
  );
}
