import { ImageResponse } from "next/og";

export async function GET() {
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
          color: "#FAF8F3",
          fontSize: 128,
          fontWeight: 700,
        }}
      >
        D
      </div>
    ),
    { width: 192, height: 192 },
  );
}
