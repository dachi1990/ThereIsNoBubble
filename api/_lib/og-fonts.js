import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OG_LIB_DIR = dirname(fileURLToPath(import.meta.url));
const OG_FONTS_DIR = join(OG_LIB_DIR, "fonts");
const OG_FONTCONFIG_FILE = join(OG_FONTS_DIR, "fonts.conf");

export function configureOgFonts() {
  process.env.FONTCONFIG_PATH = OG_FONTS_DIR;
  process.env.FONTCONFIG_FILE = OG_FONTCONFIG_FILE;
  process.env.PANGOCAIRO_BACKEND ||= "fontconfig";

  return {
    fontsDir: OG_FONTS_DIR,
    sansFamily: "Outfit",
    serifFamily: "Instrument Serif",
  };
}
