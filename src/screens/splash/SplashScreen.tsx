import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './SplashScreen.styles';
import { IMAGES } from '../../constants/images';
import { AppRoutes } from '../../constants/routes';

export const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation?.replace?.(AppRoutes.MainTabs);
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoBadge}>
        <Image
          source={IMAGES.shop}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>SmartCart</Text>
      <Text style={styles.subtitle}>Curated shopping at your fingertips</Text>
    </SafeAreaView>
  );
};

export default SplashScreen;
