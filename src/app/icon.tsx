import { ImageResponse } from "next/og";
import { FaUserTie } from "react-icons/fa";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111111",
          color: "#fafafa",
        }}
      >
        <FaUserTie size={40} />
      </div>
    ),
    size,
  );
}
