import { Pressable, type GestureResponderEvent } from 'react-native';
import * as Haptics from 'expo-haptics';

// Thay thế BottomTabBarButtonProps + PlatformPressable từ @react-navigation
// bằng Pressable thuần của React Native để tương thích SDK 56+
type TabBarButtonProps = React.ComponentProps<typeof Pressable> & {
  onPressIn?: (event: GestureResponderEvent) => void;
};

export function HapticTab(props: TabBarButtonProps) {
  return (
    <Pressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
