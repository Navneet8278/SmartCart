// Notification service managing abandoned cart reminders
type NotificationCallback = (message: string) => void;

class NotificationService {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private scheduled: boolean = false;
  private message: string | null = null;
  private listener: NotificationCallback | null = null;

  // Schedule an abandoned cart reminder after specified delay
  scheduleReminder(
    itemCount: number,
    delayMs: number = 8000,
    onTrigger?: (msg: string) => void,
  ): void {
    this.cancelReminder();

    if (itemCount <= 0) return;

    this.scheduled = true;
    this.message = `You have ${itemCount} item(s) waiting in your cart. Complete your purchase now!`;
    if (onTrigger) {
      this.listener = onTrigger;
    }

    this.timer = setTimeout(() => {
      if (this.scheduled && this.message) {
        if (this.listener) {
          this.listener(this.message);
        }
      }
    }, delayMs);
  }

  // Cancel any active abandoned cart reminder
  cancelReminder(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.scheduled = false;
    this.message = null;
    this.listener = null;
  }

  // Check if a reminder is currently scheduled
  isScheduled(): boolean {
    return this.scheduled;
  }

  // Get current pending reminder message
  getMessage(): string | null {
    return this.message;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
