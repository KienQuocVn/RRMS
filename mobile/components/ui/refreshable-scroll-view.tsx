import React, { forwardRef, useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  ScrollViewProps,
} from 'react-native';
import { Colors } from '@/constants/theme';

export interface RefreshableScrollViewProps extends ScrollViewProps {
  onRefreshContent?: () => Promise<void> | void;
  refreshEnabled?: boolean;
  refreshMinDuration?: number;
}

const wait = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

export const RefreshableScrollView = forwardRef<
  React.ElementRef<typeof ScrollView>,
  RefreshableScrollViewProps
>(function RefreshableScrollView(
  {
    children,
    onRefreshContent,
    refreshEnabled = true,
    refreshMinDuration = 500,
    refreshControl,
    alwaysBounceVertical,
    ...props
  },
  ref,
) {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(async () => {
    if (!refreshEnabled || refreshing) {
      return;
    }

    const startedAt = Date.now();
    setRefreshing(true);

    try {
      await Promise.resolve(onRefreshContent?.());
    } catch (error) {
      console.warn('Screen refresh failed:', error);
    } finally {
      setRefreshKey((current) => current + 1);

      const elapsed = Date.now() - startedAt;
      if (elapsed < refreshMinDuration) {
        await wait(refreshMinDuration - elapsed);
      }

      setRefreshing(false);
    }
  }, [onRefreshContent, refreshEnabled, refreshMinDuration, refreshing]);

  return (
    <ScrollView
      ref={ref}
      alwaysBounceVertical={alwaysBounceVertical ?? true}
      refreshControl={
        refreshControl ??
        (refreshEnabled ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
            progressBackgroundColor={Colors.white}
          />
        ) : undefined)
      }
      {...props}
    >
      <React.Fragment key={refreshKey}>{children}</React.Fragment>
    </ScrollView>
  );
});
