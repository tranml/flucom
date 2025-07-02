import { SubtitleEntry } from "../types";

/**
 * Converts a timestamp string in format "HH:MM:SS,mmm" to milliseconds
 */
function timestampToMs(timestamp: string): number {
  const [time, milliseconds] = timestamp.split(",");
  const [hours, minutes, seconds] = time.split(":").map(Number);

  return (hours * 3600 + minutes * 60 + seconds) * 1000 + Number(milliseconds);
}

/**
 * Parses a single subtitle block into a SubtitleEntry object
 */
function parseSubtitleBlock(block: string): SubtitleEntry {
  const lines = block
    .trim()
    .split("\n")
    .filter((line) => line.trim() !== "");

  if (lines.length < 6) {
    throw new Error(
      `Invalid subtitle block format. Expected at least 6 lines, got ${lines.length}`
    );
  }

  // Extract ID
  const id = parseInt(lines[0], 10);
  if (isNaN(id)) {
    throw new Error(`Invalid subtitle ID: ${lines[0]}`);
  }

  // Parse timestamp range
  const timestampLine = lines[1];
  const timestampMatch = timestampLine.match(
    /(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/
  );

  if (!timestampMatch) {
    throw new Error(`Invalid timestamp format: ${timestampLine}`);
  }

  const startTime = timestampToMs(timestampMatch[1]);
  const endTime = timestampToMs(timestampMatch[2]);

  // Extract text, phonetic, translation, and speaker
  const text = lines[2];
  const phonetic = lines[3];
  const translation = lines[4];
  const speaker = lines[5];

  return {
    id,
    startTime,
    endTime,
    text,
    phonetic,
    translation,
    speaker,
  };
}

/**
 * Parses subtitle text in the custom format and converts it to SubtitleEntry array
 *
 * Expected input format:
 * 1
 * 00:00:54,000 --> 00:00:58,233
 * Hello, my friend, it's Paul Gruber once again.
 * həˈloʊ maɪ frɛnd ɪts pɔl ˈɡruːbər wʌns əˈɡɛn
 * Chào bạn của tôi, lại là Paul Gruber đây.
 * Paul Gruber:
 *
 * 2
 * 00:00:58,475 --> 00:01:00,286
 * I hope you are doing well.
 * aɪ hoʊp ju ɑr ˈduɪŋ wɛl
 * Tôi hy vọng bạn vẫn ổn.
 * none
 */
export function parseSubtitleText(input: string): SubtitleEntry[] {
  if (!input || input.trim() === "") {
    return [];
  }

  try {
    // Split input into blocks by double newlines and filter out empty blocks
    const blocks = input
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter((block) => block !== "");

    // Parse each block
    const subtitles: SubtitleEntry[] = [];

    for (let i = 0; i < blocks.length; i++) {
      try {
        const subtitle = parseSubtitleBlock(blocks[i]);
        subtitles.push(subtitle);
      } catch (error) {
        console.warn(`Failed to parse subtitle block ${i + 1}:`, error);
        // Continue parsing other blocks even if one fails
      }
    }

    return subtitles;
  } catch (error) {
    console.error("Failed to parse subtitle text:", error);
    throw new Error(
      `Failed to parse subtitle text: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Validates if a string is in the expected subtitle format
 */
export function isValidSubtitleFormat(input: string): boolean {
  try {
    parseSubtitleText(input);
    return true;
  } catch {
    return false;
  }
}
