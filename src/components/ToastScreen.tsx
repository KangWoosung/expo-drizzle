/*
2025-01-01 21:17:19
Component brought from the blog:
https://adjh54.tistory.com/238
Thanks to the author for the great work!

Usage:
isShowToast ?
    <ToastScreen
        height={40}
        marginBottom={72}
        onClose={() => setIsShowToast(false)}
        message="Toast Message를 테스트 중입니다"
    />
    : null 
*/
import { ENV } from "@/constants/env";
import React, { useState, useEffect, useRef } from "react";
import { Text, View, Animated, StyleSheet } from "react-native";

type ToastScreenProps = {
  message: string;
  height: number;
  marginBottom: number;
  onClose: () => void;
};

/**
 *  공통 : Toast Message
 *
 * @param {number} message: Toast 메시지에서 출력할 텍스트
 * @param {number} height : Toast 메시지의 높이
 * @param {number} marginBottom : Toast 메시지의 하단 기준 Margin
 * @param {() => void} onClose: Toast 메시지의 처리 이후 부모창의 State 값을 초기화 해줍니다.
 * @returns
 */
const ToastScreen = ({
  message,
  height,
  marginBottom,
  onClose,
}: ToastScreenProps) => {
  const [isToastVisible, setIsToastVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsToastVisible(false);
      onClose();
    }, ENV.TOAST_TIMEOUT);

    Animated.timing(fadeAnim, {
      toValue: isToastVisible ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setIsToastVisible(true);
    });
    return () => clearTimeout(timer);
  }, []);

  styles.container.height = height;
  styles.container.marginBottom = marginBottom;
  styles.toastText.height = height;

  return (
    <>
      {isToastVisible && (
        <Animated.View style={styles.container}>
          <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
      )}
    </>
  );
};

export default ToastScreen;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1000000,
    flex: 1,
    alignItems: "center",
    marginTop: 600,
    width: 328,
    height: 60,
    borderRadius: 14,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 0,
    // backgroundColor: '#4e545e',
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  toast: {
    position: "absolute",
    backgroundColor: "#333",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  toastText: {
    width: 296,
    height: 60,
    fontFamily: "NanumBarunGothic",
    fontSize: 14,
    marginTop: 10,
    marginLeft: 10,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
  },
});
