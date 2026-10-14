import { notificationService } from '../src/services/notificationService';

describe('Abandoned Cart Notification Service', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    notificationService.cancelReminder();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('schedules an abandoned cart reminder when cart has items', () => {
    notificationService.scheduleReminder(3, 5000);

    expect(notificationService.isScheduled()).toBe(true);
    expect(notificationService.getMessage()).toContain('3 item(s) waiting in your cart');
  });

  it('does not schedule a reminder when itemCount is 0 or negative', () => {
    notificationService.scheduleReminder(0, 5000);

    expect(notificationService.isScheduled()).toBe(false);
    expect(notificationService.getMessage()).toBeNull();
  });

  it('triggers the callback after the delay expires', () => {
    const callback = jest.fn();
    notificationService.scheduleReminder(2, 5000, callback);

    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time by 5 seconds
    jest.advanceTimersByTime(5000);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.stringContaining('2 item(s) waiting in your cart'),
    );
  });

  it('cancels the active reminder when cancelReminder is called (e.g. upon checkout)', () => {
    const callback = jest.fn();
    notificationService.scheduleReminder(2, 5000, callback);

    expect(notificationService.isScheduled()).toBe(true);

    // Cancel before delay expires
    notificationService.cancelReminder();

    expect(notificationService.isScheduled()).toBe(false);
    expect(notificationService.getMessage()).toBeNull();

    // Fast-forward time to ensure callback does NOT fire
    jest.advanceTimersByTime(6000);

    expect(callback).not.toHaveBeenCalled();
  });
});
