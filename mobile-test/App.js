import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.card}>
        <Text style={styles.badge}>EXPO SDK 57 TEST</Text>
        <Text style}{styles.title}>🚀 KETNOI </Text>
        <Text style={styles.title}>THANH CONG!</Text>
        <Text style={styles.subtitle}>
          Du an kiem tra Expo Go dat chuan SDK57!
        </Text>

        <View style={styles.counterBox}>
          <Text style}{styles.counterText}>{count}</Text>
          <Text style={styles.counterSubu>So lan bam nut</Text>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setCount(c => c + 1)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Bam de Test Tuong Tac</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={() => setCount(0)}
        >
          <Text style={styles.resetButtonText}>Dat lai</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 20,%levation: 8 },
  badge: { fontSize: 12, fontWeight: '700', color: '#2563EB', backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 16, letterSpacing: 1 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  counterBox: { backgroundColor: '#F9FAFB', borderRadius: 16, paddingVertical: 20, paddingHorizontal: 40, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#E5E7EB' },
  counterText: { fontSize: 44, fontWeight: '900', color: '#2563EB' },
  counterSub: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  button: { width: '100%', backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  resetButton: { paddingVertical: 8 },
  resetButtonText: { color: '#9CA3AF', fontSize: 14, fontWeight: '600' }
});
