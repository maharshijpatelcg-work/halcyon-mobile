import React from "react";
import { FlatList, View, ActivityIndicator } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { IncidentCard } from "./IncidentCard";
import { EmptyState } from "../ui/EmptyState";
import { SkeletonCard } from "../ui/SkeletonLoader";
import { useTheme } from "../../providers/ThemeProvider";
import type { Incident } from "../../types";

interface IncidentListProps {
  incidents: Incident[];
  isLoading: boolean;
  isRefetching: boolean;
  onRefresh: () => void;
  onLoadMore?: () => void;
  onSelectIncident: (id: number) => void;
}

export function IncidentList({
  incidents,
  isLoading,
  isRefetching,
  onRefresh,
  onLoadMore,
  onSelectIncident,
}: IncidentListProps) {
  const { colors } = useTheme();

  if (isLoading && !isRefetching) {
    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }

  return (
    <FlatList
      data={incidents}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInDown.delay(index * 50).springify().damping(20)}>
          <IncidentCard incident={item} onPress={() => onSelectIncident(item.id)} />
        </Animated.View>
      )}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      refreshing={isRefetching}
      onRefresh={onRefresh}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <EmptyState
          icon="shield-checkmark-outline"
          title="All systems operational"
          subtitle="No active incidents match the current filters."
        />
      }
      ListFooterComponent={
        isLoading && isRefetching ? (
          <View style={{ paddingVertical: 16 }}>
            <ActivityIndicator size="small" color="#6366F1" />
          </View>
        ) : null
      }
    />
  );
}
