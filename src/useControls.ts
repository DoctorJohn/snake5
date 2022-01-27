import React from "react";

type Point = { x: number; y: number };

const VALID_KEYS = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];

function useControls() {
  const [lastKey, setLastKey] = React.useState<string>();

  React.useEffect(() => {
    const handleKeyboardEvent = (event: KeyboardEvent) => {
      if (!VALID_KEYS.includes(event.key)) {
        console.log("Key ignored:", event.key);
        return;
      }

      setLastKey(event.key);
      console.log("Key processed:", event.key);
    };

    window.addEventListener("keydown", handleKeyboardEvent);
    return () => window.removeEventListener("keydown", handleKeyboardEvent);
  }, [setLastKey]);

  React.useEffect(() => {
    if (!window.DeviceOrientationEvent) {
      console.log("Device orientation events are not supported :(");
      return;
    }

    const handleDeviceOrientationEvent = (event: DeviceOrientationEvent) => {
      const leftToRight = event.gamma ?? 0;
      const frontToBack = event.beta ?? 0;

      if (Math.abs(leftToRight) > Math.abs(frontToBack)) {
        if (leftToRight > 0) {
          setLastKey("ArrowRight");
        } else {
          setLastKey("ArrowLeft");
        }
      } else {
        if (frontToBack > 0) {
          setLastKey("ArrowDown");
        } else {
          setLastKey("ArrowUp");
        }
      }
    };

    window.addEventListener(
      "deviceorientation",
      handleDeviceOrientationEvent,
      true
    );

    return () =>
      window.removeEventListener(
        "deviceorientation",
        handleDeviceOrientationEvent
      );
  }, [setLastKey]);

  const deltaX =
    lastKey === "ArrowLeft" ? -1 : lastKey === "ArrowRight" ? 1 : 0;
  const deltaY = lastKey === "ArrowUp" ? -1 : lastKey === "ArrowDown" ? 1 : 0;

  const delta: Point = React.useMemo(() => {
    return { x: deltaX, y: deltaY };
  }, [deltaX, deltaY]);

  return { delta } as const;
}

export default useControls;
