/**
 * Priority Inbox Implementation
 * Stage 6: Efficient Top-N Notifications Management
 * 
 * Implements a Priority Inbox that displays the top 'n' most important unread notifications
 * Priority is based on:
 * 1. Weight: Placement (3) > Result (2) > Event (1)
 * 2. Recency: Newer notifications score higher
 * 
 * Efficient Maintenance: Uses Min-Heap (Priority Queue) to maintain top-10 in O(log n) time
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Notification {
  id: string;
  recipient_id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  title: string;
  message: string;
  notification_type?: 'Placement' | 'Result' | 'Event';
  status: string;
  is_read: boolean;
  created_at: string;
  updated_at?: string;
  [key: string]: any;
}

interface PriorityNotification extends Notification {
  priority_score: number;
  weight: number;
  recency_score: number;
}

interface TopNotificationsResult {
  top_notifications: PriorityNotification[];
  total_count: number;
  calculation_time_ms: number;
  timestamp: string;
}

// ============================================================================
// PRIORITY CALCULATOR
// ============================================================================

/**
 * Calculates priority score for a notification
 * Formula: (weight * 100) + recency_score
 * 
 * Weight breakdown:
 * - Placement: 3 (highest priority)
 * - Result: 2 (medium priority)
 * - Event: 1 (low priority)
 * 
 * Recency breakdown:
 * - Notifications from last 1 hour: +100
 * - Notifications from last 24 hours: +50
 * - Notifications older: +10
 */
class PriorityCalculator {
  private readonly WEIGHT_MAP = {
    'Placement': 3,
    'Result': 2,
    'Event': 1,
    'default': 1
  };

  private readonly PRIORITY_MAP = {
    'urgent': 1.5,
    'high': 1.2,
    'normal': 1.0,
    'low': 0.8
  };

  /**
   * Calculate priority score for a notification
   */
  calculateScore(notification: Notification): number {
    const weight = this.getWeight(notification);
    const recencyScore = this.getRecencyScore(notification.created_at);
    const priorityBoost = this.getPriorityBoost(notification.priority);
    
    // Final score: (weight * 100 * priority_boost) + recency_score
    const score = (weight * 100 * priorityBoost) + recencyScore;
    
    return score;
  }

  /**
   * Get weight based on notification type
   */
  private getWeight(notification: Notification): number {
    const notificationType = notification.notification_type || 'default';
    return this.WEIGHT_MAP[notificationType] || this.WEIGHT_MAP['default'];
  }

  /**
   * Calculate recency score (how recent is the notification)
   * Newer = higher score
   */
  private getRecencyScore(createdAt: string): number {
    const notificationTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const ageInMinutes = (currentTime - notificationTime) / (1000 * 60);

    // First hour: +100
    if (ageInMinutes < 60) {
      return 100;
    }
    // First 24 hours: +50
    if (ageInMinutes < 24 * 60) {
      return 50;
    }
    // Older: +10
    return 10;
  }

  /**
   * Get priority boost based on priority level
   */
  private getPriorityBoost(priority: string): number {
    return this.PRIORITY_MAP[priority] || this.PRIORITY_MAP['normal'];
  }

  /**
   * Get weight name for display
   */
  getWeightName(notification: Notification): string {
    const notificationType = notification.notification_type || 'default';
    return notificationType;
  }
}

// ============================================================================
// MIN-HEAP IMPLEMENTATION (for efficient top-n maintenance)
// ============================================================================

/**
 * Min-Heap implementation for maintaining top-N notifications efficiently
 * Time complexity: O(log n) for insert/remove, O(1) for peek
 */
class MinHeap {
  private heap: PriorityNotification[] = [];

  /**
   * Insert element into heap
   */
  insert(notification: PriorityNotification): void {
    this.heap.push(notification);
    this.bubbleUp(this.heap.length - 1);
  }

  /**
   * Remove minimum element (root)
   */
  removeMin(): PriorityNotification | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);

    return min;
  }

  /**
   * Get minimum element without removing
   */
  peek(): PriorityNotification | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  /**
   * Get heap size
   */
  size(): number {
    return this.heap.length;
  }

  /**
   * Get all elements sorted by score (descending)
   */
  getAll(): PriorityNotification[] {
    return [...this.heap].sort((a, b) => b.priority_score - a.priority_score);
  }

  /**
   * Bubble up element to maintain heap property
   */
  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].priority_score < this.heap[parentIndex].priority_score) {
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  /**
   * Bubble down element to maintain heap property
   */
  private bubbleDown(index: number): void {
    while (true) {
      let smallest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (
        leftChild < this.heap.length &&
        this.heap[leftChild].priority_score < this.heap[smallest].priority_score
      ) {
        smallest = leftChild;
      }

      if (
        rightChild < this.heap.length &&
        this.heap[rightChild].priority_score < this.heap[smallest].priority_score
      ) {
        smallest = rightChild;
      }

      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      } else {
        break;
      }
    }
  }
}

// ============================================================================
// PRIORITY INBOX MANAGER
// ============================================================================

/**
 * Priority Inbox Manager - Main class for managing top-N notifications
 * 
 * Key Features:
 * 1. Fetch notifications from API
 * 2. Calculate priority scores
 * 3. Maintain efficient top-N using min-heap
 * 4. Handle new incoming notifications
 * 5. Filter unread notifications
 */
class PriorityInboxManager {
  private calculator: PriorityCalculator;
  private topNotificationsHeap: MinHeap;
  private topN: number;
  private allNotifications: Map<string, PriorityNotification>;
  private apiBaseUrl: string;

  constructor(topN: number = 10, apiBaseUrl: string = 'http://4.224.186.213/evaluation-service') {
    this.calculator = new PriorityCalculator();
    this.topNotificationsHeap = new MinHeap();
    this.topN = topN;
    this.allNotifications = new Map();
    this.apiBaseUrl = apiBaseUrl;
  }

  /**
   * Fetch notifications from API
   */
  async fetchNotificationsFromAPI(studentId?: string): Promise<Notification[]> {
    try {
      let url = `${this.apiBaseUrl}/notifications`;
      
      if (studentId) {
        url += `?studentId=${studentId}`;
      }

      console.log(`[API] Fetching notifications from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[API] Received ${data.length || 0} notifications`);
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('[API] Error fetching notifications:', error);
      return [];
    }
  }

  /**
   * Build top-N notifications from all notifications
   */
  async buildTopNotifications(studentId?: string, topN?: number): Promise<TopNotificationsResult> {
    const startTime = Date.now();
    const limit = topN || this.topN;

    // Fetch all notifications from API
    const notifications = await this.fetchNotificationsFromAPI(studentId);

    if (notifications.length === 0) {
      return {
        top_notifications: [],
        total_count: 0,
        calculation_time_ms: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    }

    // Filter unread notifications
    const unreadNotifications = notifications.filter(n => !n.is_read);
    console.log(`[Filter] ${unreadNotifications.length} unread out of ${notifications.length} total`);

    // Calculate priority scores and add to heap
    this.topNotificationsHeap = new MinHeap();
    this.allNotifications.clear();

    for (const notification of unreadNotifications) {
      const score = this.calculator.calculateScore(notification);
      const weight = this.calculator.getWeightName(notification);

      const priorityNotification: PriorityNotification = {
        ...notification,
        priority_score: score,
        weight: this.calculator['WEIGHT_MAP'][weight] || 1,
        recency_score: this.getRecencyScore(notification.created_at)
      };

      this.allNotifications.set(notification.id, priorityNotification);
      this.topNotificationsHeap.insert(priorityNotification);
    }

    // Extract top-N from heap
    const topNotifications: PriorityNotification[] = [];
    const tempHeap: PriorityNotification[] = [];

    while (this.topNotificationsHeap.size() > 0 && topNotifications.length < limit) {
      const min = this.topNotificationsHeap.removeMin();
      if (min) {
        topNotifications.push(min);
        tempHeap.push(min);
      }
    }

    // Rebuild heap with remaining elements
    for (const notif of tempHeap) {
      this.topNotificationsHeap.insert(notif);
    }

    // Sort by score descending (highest priority first)
    topNotifications.sort((a, b) => b.priority_score - a.priority_score);

    console.log(`[Result] Top ${topNotifications.length} notifications selected`);

    return {
      top_notifications: topNotifications,
      total_count: notifications.length,
      calculation_time_ms: Date.now() - startTime,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get recency score for display
   */
  private getRecencyScore(createdAt: string): number {
    const notificationTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const ageInMinutes = (currentTime - notificationTime) / (1000 * 60);
    return Math.max(0, 100 - ageInMinutes);
  }

  /**
   * Add new notification to the system
   * Maintains top-N efficiently in O(log n) time
   */
  addNewNotification(notification: Notification): void {
    if (notification.is_read) {
      console.log(`[AddNotif] Skipping read notification ${notification.id}`);
      return;
    }

    const score = this.calculator.calculateScore(notification);
    const weight = this.calculator.getWeightName(notification);

    const priorityNotification: PriorityNotification = {
      ...notification,
      priority_score: score,
      weight: this.calculator['WEIGHT_MAP'][weight] || 1,
      recency_score: this.getRecencyScore(notification.created_at)
    };

    this.allNotifications.set(notification.id, priorityNotification);
    this.topNotificationsHeap.insert(priorityNotification);

    // If we have more than N notifications, remove the lowest priority one
    if (this.topNotificationsHeap.size() > this.topN) {
      const removed = this.topNotificationsHeap.removeMin();
      if (removed) {
        console.log(`[AddNotif] Removed lowest priority: ${removed.id} (score: ${removed.priority_score})`);
      }
    }

    console.log(`[AddNotif] Added notification ${notification.id}, heap size: ${this.topNotificationsHeap.size()}`);
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    const notification = this.allNotifications.get(notificationId);
    if (notification) {
      notification.is_read = true;
      console.log(`[MarkRead] Notification ${notificationId} marked as read`);
    }
  }

  /**
   * Get current top notifications
   */
  getTopNotifications(): PriorityNotification[] {
    return this.topNotificationsHeap.getAll();
  }

  /**
   * Set the top-N limit
   */
  setTopN(topN: number): void {
    this.topN = topN;
    console.log(`[Config] Top-N limit set to ${topN}`);
  }
}

// ============================================================================
// MAIN EXECUTION - DEMONSTRATION
// ============================================================================

async function main() {
  console.log('='.repeat(80));
  console.log('PRIORITY INBOX - TOP-N NOTIFICATIONS SYSTEM');
  console.log('='.repeat(80));
  console.log();

  const manager = new PriorityInboxManager(10);

  try {
    // Fetch and process notifications
    console.log('\n[STEP 1] Fetching and processing notifications...\n');
    const result = await manager.buildTopNotifications();

    console.log('\n' + '='.repeat(80));
    console.log('TOP 10 PRIORITY NOTIFICATIONS');
    console.log('='.repeat(80));
    console.log();

    if (result.top_notifications.length === 0) {
      console.log('No unread notifications found.');
    } else {
      // Display results in a formatted table
      result.top_notifications.forEach((notif, index) => {
        console.log(`\n[${index + 1}] ${notif.title}`);
        console.log(`    ID: ${notif.id}`);
        console.log(`    Type: ${notif.notification_type || 'Event'}`);
        console.log(`    Priority Level: ${notif.priority}`);
        console.log(`    Priority Score: ${notif.priority_score.toFixed(2)}`);
        console.log(`    Message: ${notif.message.substring(0, 60)}...`);
        console.log(`    Created: ${notif.created_at}`);
        console.log(`    Status: ${notif.is_read ? 'Read' : 'Unread'}`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('STATISTICS');
    console.log('='.repeat(80));
    console.log(`Total Notifications: ${result.total_count}`);
    console.log(`Top Notifications Returned: ${result.top_notifications.length}`);
    console.log(`Calculation Time: ${result.calculation_time_ms}ms`);
    console.log(`Timestamp: ${result.timestamp}`);
    console.log();

    // Export results to JSON
    const output = {
      status: 'success',
      data: result.top_notifications,
      statistics: {
        total: result.total_count,
        returned: result.top_notifications.length,
        calculation_time_ms: result.calculation_time_ms
      },
      timestamp: result.timestamp
    };

    console.log('='.repeat(80));
    console.log('JSON OUTPUT:');
    console.log('='.repeat(80));
    console.log(JSON.stringify(output, null, 2));

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run main function
main().catch(console.error);

export { PriorityInboxManager, PriorityCalculator, MinHeap };
