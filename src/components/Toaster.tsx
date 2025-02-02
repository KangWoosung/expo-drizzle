/*
2025-01-01 21:44:53
 
*/

import { ENV } from "@/constants/env";
import React, { useState, useEffect, useRef } from "react";
import { Text, View, Animated, StyleSheet } from "react-native";
import ToastManager from "@/utils/toast";

export function Toaster() {
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({
    message: "",
    isVisible: false,
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = ToastManager.subscribe(({ message }) => {
      setToast({ message, isVisible: true });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!toast.isVisible) return;

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setToast((prev) => ({ ...prev, isVisible: false }));
      });
    }, ENV.TOAST_TIMEOUT);

    return () => clearTimeout(timer);
  }, [toast.isVisible]);

  if (!toast.isVisible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.toastText}>{toast.message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    left: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  toastText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});
