import { monogramIcon } from "@/lib/monogram-icon";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return monogramIcon(size.width);
}
