import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Feather } from '@expo/vector-icons';
import { injectDemoData } from '@/services/demo-service';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, radius } from '@/theme';

const safeColors = { primary: (colors as any).primary || '#007AFF', cardBackground: (colors as any).cardBackground || '#FFFFFF', text: (colors as any).text || '#111111', textSecondary: (colors as any).textSecondary || '#666666', border: (colors as any).border || '#EEEEEE', background: '#F9F9F9', error: '#FF3B30' };
const safeTypography = { h3: (typography as any).h3 || { fontSize: 18, fontWeight: '600' }, body: (typography as any).body || { fontSize: 16 }, label: (typography as any).label || { fontSize: 12, textTransform: 'uppercase' } };

export default function ProfileScreen() {
  const router = useRouter();
  const [localBackup, setLocalBackup] = useState(true);

  const handleInjectDemo = async () => {
    Alert.alert(
      "Initialize Demo Mode",
      "This will populate the app with realistic presentation data. Proceed?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Inject Data", style: "default", onPress: async () => {
            await injectDemoData();
            Alert.alert("Success", "Demo data injected! Restart the app or visit the Dashboard to see it.");
            router.push('/');
        }}
      ]
    );
  };

  const SettingsRow = ({ icon, title, subtitle, onPress, toggleValue, onToggle, destructive }: any) => (
    <TouchableOpacity style={styles.settingsRow} onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
      <View style={styles.rowLeft}>
        <View style={[styles.iconBox, destructive && { backgroundColor: safeColors.error + '15' }]}>
          <Feather name={icon} size={18} color={destructive ? safeColors.error : safeColors.primary} />
        </View>
        <View>
          <Text style={[styles.rowTitle, destructive && { color: safeColors.error }]}>{title}</Text>
          {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {onToggle ? (
        <Switch value={toggleValue} onValueChange={onToggle} trackColor={{ true: safeColors.primary }} />
      ) : (
        <Feather name="chevron-right" size={20} color={safeColors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <Screen>
      <Header title="Profile & Trust" subtitle="You own your data." />
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* === TEMPORARY TEST BUTTON FOR ONBOARDING === */}
        <TouchableOpacity 
          style={{ backgroundColor: safeColors.primary, padding: 16, marginHorizontal: 16, marginBottom: 24, borderRadius: 12, alignItems: 'center' }} 
          onPress={() => router.push('/onboarding')}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Test Onboarding Screen</Text>
        </TouchableOpacity>
        {/* ============================================== */}

        {/* Presentation Section */}
        <Text style={styles.sectionTitle}>Demo & Presentation</Text>
        <View style={styles.card}>
          <SettingsRow 
            icon="zap" 
            title="Load Pitch Data" 
            subtitle="Populates timeline and insights for demos" 
            onPress={handleInjectDemo} 
          />
        </View>

        {/* Data & Privacy Section */}
        <Text style={styles.sectionTitle}>Data Architecture (Local-First)</Text>
        <View style={styles.card}>
          <SettingsRow 
            icon="hard-drive" 
            title="Local Device Storage" 
            subtitle="Data never leaves this device" 
            toggleValue={localBackup}
            onToggle={setLocalBackup} 
          />
          <View style={styles.divider} />
          <SettingsRow 
            icon="download" 
            title="Export JSON Backup" 
            subtitle="Download your encrypted data" 
            onPress={() => Alert.alert("Exporting", "Generating local JSON backup...")} 
          />
        </View>

        {/* Account Settings */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <SettingsRow icon="user" title="Personal Info" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingsRow icon="bell" title="Notifications" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingsRow icon="trash-2" title="Erase All Data" destructive onPress={() => {}} />
        </View>

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 40, paddingTop: 16 },
  sectionTitle: { ...safeTypography.label, color: safeColors.textSecondary, marginLeft: 16, marginBottom: 8, marginTop: 16 },
  card: { backgroundColor: safeColors.cardBackground, borderRadius: 16, borderWidth: 1, borderColor: safeColors.border, overflow: 'hidden', marginHorizontal: 16 },
  settingsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: safeColors.cardBackground },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: safeColors.primary + '15', justifyContent: 'center', alignItems: 'center' },
  rowTitle: { ...safeTypography.body, color: safeColors.text, fontWeight: '500' },
  rowSubtitle: { ...safeTypography.label, color: safeColors.textSecondary, textTransform: 'none', marginTop: 2 },
  divider: { height: 1, backgroundColor: safeColors.border, marginLeft: 60 },
});