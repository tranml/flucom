import { useRef, useState } from "react";
import { formatTime } from "../utils/formatTime";
import { asStoreData } from "../utils/handleAsyncStorage";
import { useEventListener } from "expo";

type UseRangePlayerProps = {
  mediaPlayer: any;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  id: string;
};

export const useRangePlayer = ({
  mediaPlayer,
  currentTime,
  setCurrentTime,
  id,
}: UseRangePlayerProps) => {
  const [rangeStart, setRangeStart] = useState<number | null>(null);
  const [rangeEnd, setRangeEnd] = useState<number | null>(null);
  const [isRangeMode, setIsRangeMode] = useState<boolean>(false);
  const [isSettingPointB, setIsSettingPointB] = useState<boolean>(false);

  const lastStoredTimeRef = useRef<number>(0);

  const isCurrentTimeValidForPointB = (): boolean => {
    if (!rangeStart) return false;
    return currentTime > rangeStart + 1;
  };

  const handleRangeButtonPress = () => {
    if (!isSettingPointB) {
      setRangeStart(currentTime);
      setIsSettingPointB(true);
    } else {
      if (isCurrentTimeValidForPointB()) {
        setRangeEnd(currentTime);
        setIsSettingPointB(false);
      }
    }
  };

  const handlePlayRange = () => {
    if (rangeStart !== null && rangeEnd !== null) {
      setIsRangeMode(true);
      mediaPlayer.currentTime = rangeStart;
      mediaPlayer.play();
    }
  };

  const handleResetRange = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setIsRangeMode(false);
    setIsSettingPointB(false);
  };

  // UI helpers
  const getRangeButtonText = (): string => {
    if (isRangeMode) return "Range Active";
    if (isSettingPointB) return "Set Point B";
    if (rangeStart && rangeEnd) return "Play Range";
    return "Set Point A";
  };

  const isRangeButtonDisabled = (): boolean => {
    if (isRangeMode) return true;
    if (isSettingPointB) return !isCurrentTimeValidForPointB();
    return false;
  };

  const getRangeDisplayText = (): string => {
    if (!rangeStart || !rangeEnd) return "";
    return `Range: ${formatTime(rangeStart)} - ${formatTime(rangeEnd)}`;
  };

  // Time update handler
  const handleTimeUpdate = (event: any) => {
    const time = event.currentTime;
    setCurrentTime(time);

    // Range logic
    if (isRangeMode && rangeStart !== null && rangeEnd !== null) {
      if (time >= rangeEnd) {
        mediaPlayer.currentTime = rangeStart;
        mediaPlayer.play();
      }

      if (time < rangeStart - 2) {
        handleResetRange();
      }
    }

    // Time storage logic
    const timeSinceLastStore = time - lastStoredTimeRef.current;
    if (timeSinceLastStore < 5) return;

    asStoreData("last-stored-time--media-" + id, time.toString());
    lastStoredTimeRef.current = time;
  };

  // Set up event listener
  useEventListener(mediaPlayer, "timeUpdate", handleTimeUpdate);

  return {
    // State
    rangeStart,
    rangeEnd,
    isRangeMode,
    // isSettingPointB,

    // Handlers
    handleRangeButtonPress,
    handlePlayRange,
    handleResetRange,

    // UI helpers
    getRangeButtonText,
    isRangeButtonDisabled,
    getRangeDisplayText,
  };
};
