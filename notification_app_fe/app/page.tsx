"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.title}>📬 Priority Inbox</h1>
              <p className={styles.subtitle}>
                Smart notification management system
              </p>
            </div>
            <div className={styles.badges}>
              <span className={styles.badge}>Real-time</span>
              <span className={styles.badge}>AI-Powered</span>
              <span className={styles.badge}>Smart Priority</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <section className={styles.content}>
          <div className={styles.gridContainer}>
            {/* Priority Inbox Card */}
            <Link href="/priority-inbox">
              <div className={styles.card}>
                <div className={styles.cardIcon}>⭐</div>
                <h2>Priority Inbox</h2>
                <p>
                  View your top 10 most important notifications based on
                  priority and recency
                </p>
                <div className={styles.cardFeatures}>
                  <span className={styles.feature}>✓ Smart Sorting</span>
                  <span className={styles.feature}>✓ Real-time Updates</span>
                  <span className={styles.feature}>✓ AI Priority</span>
                </div>
                <button className={styles.ctaButton}>
                  View Priority Inbox →
                </button>
              </div>
            </Link>

            {/* All Notifications Card */}
            <Link href="/all-notifications">
              <div className={styles.card}>
                <div className={styles.cardIcon}>📭</div>
                <h2>All Notifications</h2>
                <p>
                  Browse and manage all your notifications with advanced
                  filtering options
                </p>
                <div className={styles.cardFeatures}>
                  <span className={styles.feature}>✓ Advanced Filters</span>
                  <span className={styles.feature}>✓ Type Filtering</span>
                  <span className={styles.feature}>✓ Full History</span>
                </div>
                <button className={styles.ctaButton}>
                  View All Notifications →
                </button>
              </div>
            </Link>
          </div>

          {/* Features Section */}
          <section className={styles.features}>
            <h2 className={styles.sectionTitle}>Key Features</h2>
            <div className={styles.featureGrid}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🎯</div>
                <h3>Smart Priority</h3>
                <p>
                  Notifications automatically sorted by importance and
                  recency—placement alerts always come first!
                </p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🔍</div>
                <h3>Advanced Filtering</h3>
                <p>
                  Filter by type (Placement, Result, Event), priority level, or
                  read status to find exactly what you need.
                </p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>⚡</div>
                <h3>Real-time Updates</h3>
                <p>
                  Stay informed with instant notifications as new events
                  arrive—never miss an important update.
                </p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>📊</div>
                <h3>Analytics</h3>
                <p>
                  Track notification statistics, unread counts, and engagement
                  metrics at a glance.
                </p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🎨</div>
                <h3>Beautiful UI</h3>
                <p>
                  Clean, intuitive interface optimized for both desktop and
                  mobile experiences.
                </p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>📱</div>
                <h3>Fully Responsive</h3>
                <p>
                  Perfect experience on any device—desktop, tablet, or mobile.
                  Works seamlessly everywhere.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className={styles.howItWorks}>
            <h2 className={styles.sectionTitle}>How Priority Scoring Works</h2>
            <div className={styles.scoreBreakdown}>
              <div className={styles.scoreItem}>
                <h3>1. Notification Type Weight</h3>
                <ul>
                  <li>
                    <strong>Placement</strong> = 3x weight (job opportunities)
                  </li>
                  <li>
                    <strong>Result</strong> = 2x weight (exam/test results)
                  </li>
                  <li>
                    <strong>Event</strong> = 1x weight (general events)
                  </li>
                </ul>
              </div>
              <div className={styles.scoreItem}>
                <h3>2. Recency Boost</h3>
                <ul>
                  <li>
                    <strong>Last 1 hour</strong> = +100 points
                  </li>
                  <li>
                    <strong>Last 24 hours</strong> = +50 points
                  </li>
                  <li>
                    <strong>Older</strong> = +10 points
                  </li>
                </ul>
              </div>
              <div className={styles.scoreItem}>
                <h3>3. Priority Level Multiplier</h3>
                <ul>
                  <li>
                    <strong>Urgent</strong> = 1.5x multiplier
                  </li>
                  <li>
                    <strong>High</strong> = 1.2x multiplier
                  </li>
                  <li>
                    <strong>Normal</strong> = 1.0x multiplier
                  </li>
                  <li>
                    <strong>Low</strong> = 0.8x multiplier
                  </li>
                </ul>
              </div>
            </div>
            <p className={styles.formula}>
              <strong>Final Score = (Weight × 100 × Priority Multiplier) + Recency Bonus</strong>
            </p>
          </section>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>
            © 2024 Priority Inbox. Built with ❤️ for smarter notifications.
          </p>
          <p className={styles.footerSubtext}>
            Powered by intelligent priority algorithms and real-time processing
          </p>
        </footer>
      </div>
    </main>
  );
}
