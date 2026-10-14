import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  retryButtonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
});
