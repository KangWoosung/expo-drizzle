/*
2025-01-01 21:40:46
EventEmitter 패턴을 사용하여 ShadCN과 비슷한 방식으로 구현


*/

type ToastEvent = {
  message: string;
};

class ToastManager {
  private static listeners: ((event: ToastEvent) => void)[] = [];

  static subscribe(listener: (event: ToastEvent) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  static show(message: string) {
    this.listeners.forEach((listener) => listener({ message }));
  }
}

export const toast = {
  show: ToastManager.show.bind(ToastManager),
};

export default ToastManager;
