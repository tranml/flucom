import { useState } from "react";
import { formatTime } from "../utils/formatTime";

type UseRangePlayerProps = {
  mediaPlayer: any;
  currentTime: number;
};

export const useRangePlayer = ({
  mediaPlayer,
  currentTime,
}: UseRangePlayerProps) => {
  const [rangeStart, setRangeStart] = useState<number | null>(null);
  const [rangeEnd, setRangeEnd] = useState<number | null>(null);
  const [isRangeMode, setIsRangeMode] = useState<boolean>(false);
  const [isSettingPointB, setIsSettingPointB] = useState<boolean>(false);

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

  const handleRangeLogic = (time: number) => {
    if (isRangeMode && rangeStart !== null && rangeEnd !== null) {
      if (time >= rangeEnd) {
        mediaPlayer.currentTime = rangeStart;
        mediaPlayer.play();
      }

      if (time < rangeStart - 2) {
        handleResetRange();
      }
    }
  };

  // TODO: Play in range based on subtitle
  const setRangeFromSubtitle = (startTime: number, endTime: number) => {
    // Ignore if range mode is active
    if (isRangeMode) return;

    // Reset any existing range first
    handleResetRange();

    // Set the new range points (convert from ms to seconds)
    setRangeStart(startTime / 1000);
    setRangeEnd(endTime / 1000);
  };

  return {
    rangeStart,
    rangeEnd,
    isRangeMode,
    handleRangeButtonPress,
    handlePlayRange,
    handleResetRange,
    handleRangeLogic,
    getRangeButtonText,
    isRangeButtonDisabled,
    getRangeDisplayText,
    // TODO: Play in range based on subtitle
    setRangeFromSubtitle,
  };
};
