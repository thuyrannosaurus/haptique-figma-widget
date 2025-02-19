const { widget } = figma;
const { AutoLayout, Text, useSyncedState, usePropertyMenu } = widget;

function HapticWidget() {
  // Basic widget with proper types
  return new AutoLayout({
    name: "Haptic Widget",
    effect: {
      type: "drop-shadow",
      color: { r: 0, g: 0, b: 0, a: 0.2 },
      offset: { x: 0, y: 2 },
      blur: 4
    },
    direction: "vertical",
    spacing: 16,
    padding: 16,
    cornerRadius: 8,
    fill: "#FFFFFF",
    width: 400,
    children: [
      new Text({
        name: "Hello Text",
        characters: "Hello World",
        fontSize: 16,
        fill: "#000000",
        width: "fill-parent"
      })
    ]
  });
}

// Register the widget
widget.register(HapticWidget);