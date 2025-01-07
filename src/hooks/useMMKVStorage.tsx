/*
Usage:
const {storedValue, setValue, removeValue, getAllKeys} = useMMKVStorage<number>("count", 0);

데이터 타입에 따라서 사용해야 하는 MMKV 메서드가 달라져야 한다. 
이 작업을 추가해줘야 하는데.. 현타가 와서 보류.
사실 이 훅은 필요하지 않다. 

*/
import { useState, useEffect, useCallback } from "react";
import { MMKV } from "react-native-mmkv";

// MMKV 인스턴스 생성
const storage = new MMKV();

// 커스텀 훅 정의
// JS: export function useMMKVStorage(key, initialValue)
export function useMMKVStorage<T>(key: string, initialValue: T) {
  const username = storage.getString("user.name"); // 'Marc'
  const age = storage.getNumber("user.age"); // 21
  // 상태 관리
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storage.getString(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from MMKV", error);
      return initialValue;
    }
  });

  // 저장 함수
  const setValue = useCallback(
    // JS: (value) =>
    (value: T | ((prevValue: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        storage.set(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error("Error saving to MMKV", error);
      }
    },
    [key, storedValue]
  );

  // 삭제 함수
  const removeValue = useCallback(() => {
    try {
      storage.delete(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error("Error deleting from MMKV", error);
    }
  }, [key, initialValue]);

  // getAllKeys 함수
  const getAllKeys = useCallback(() => {
    try {
      return storage.getAllKeys();
    } catch (error) {
      console.error("Error getting all keys from MMKV", error);
    }
  }, []);

  return { storedValue, setValue, removeValue, getAllKeys } as const;
}
