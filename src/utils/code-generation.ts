export function generateSwiftUICode(trigger: string, hapticType: string): string {
  const impact = ['light', 'medium', 'heavy', 'rigid', 'soft'].includes(hapticType);
  const notification = ['success', 'warning', 'error'].includes(hapticType);
  
  if (impact) {
    return `let impactGenerator = UIImpactFeedbackGenerator(style: .${hapticType})
impactGenerator.prepare()
impactGenerator.impactOccurred()`;
  } else if (notification) {
    return `let notificationGenerator = UINotificationFeedbackGenerator()
notificationGenerator.prepare()
notificationGenerator.notificationOccurred(.${hapticType})`;
  } else if (hapticType === 'selection') {
    return `let selectionGenerator = UISelectionFeedbackGenerator()
selectionGenerator.prepare()
selectionGenerator.selectionChanged()`;
  }
  return '';
}

export function generateUIKitCode(trigger: string, hapticType: string): string {
  const impact = ['light', 'medium', 'heavy', 'rigid', 'soft'].includes(hapticType);
  const notification = ['success', 'warning', 'error'].includes(hapticType);
  
  if (impact) {
    return `let feedbackGenerator = UIImpactFeedbackGenerator(style: .${hapticType})
feedbackGenerator.prepare()
feedbackGenerator.impactOccurred()`;
  } else if (notification) {
    return `let feedbackGenerator = UINotificationFeedbackGenerator()
feedbackGenerator.prepare()
feedbackGenerator.notificationOccurred(.${hapticType})`;
  } else if (hapticType === 'selection') {
    return `let feedbackGenerator = UISelectionFeedbackGenerator()
feedbackGenerator.prepare()
feedbackGenerator.selectionChanged()`;
  }
  return '';
} 