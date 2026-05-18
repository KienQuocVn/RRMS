import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import {
  RefreshableScrollView,
  RefreshableScrollViewProps,
} from '@/components/ui/refreshable-scroll-view';

type RefreshableScreenViewProps = RefreshableScrollViewProps & {
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function RefreshableScreenView({
  children,
  contentContainerStyle,
  ...props
}: RefreshableScreenViewProps) {
  return (
    <RefreshableScrollView
      {...props}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
    >
      {children}
    </RefreshableScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});
