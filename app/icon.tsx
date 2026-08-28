import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
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
          background: "#24443F",
          borderRadius: 6,
          color: "#FAF8F3",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        D
      </div>
    ),
    { ...size },
  );
}
