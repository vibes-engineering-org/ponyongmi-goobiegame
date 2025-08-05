import { NextResponse } from "next/server";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || "https://localhost:3000";
  
  const accountAssociation = {
    header: "eyJmaWQiOjg2OTk5OSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDc2ZDUwQjBFMTQ3OWE5QmEyYkQ5MzVGMUU5YTI3QzBjNjQ5QzhDMTIifQ",
    payload: "eyJkb21haW4iOiJwb255b25nbWktZ29vYmllZ2FtZS52ZXJjZWwuYXBwIn0",
    signature: "MHg4ZDY3N2FiYTYxNjc1OGNjYjM2YjBkMzYzNWZjMmU5NTI0ZDRkY2I0OWRmOTViYWUzY2I4YzZmN2MyODRiNjMyMzlmNWI5NzI1MWU2Y2E3MDg1MjIzOGFiZDZmNzgyZDAwN2YzNjc2N2I0YWZiMzQyZDBiNjM0YzliYTVhYjhkNzFj"
  };

  const frame = {
    version: "1",
    name: "Coin Collector Game",
    iconUrl: `${appUrl}/icon.png`,
    homeUrl: appUrl,
    imageUrl: `${appUrl}/og.png`,
    buttonTitle: "Open",
    webhookUrl: `${appUrl}/api/webhook`,
    splashImageUrl: `${appUrl}/splash.png`,
    splashBackgroundColor: "#555555",
    primaryCategory: "games",
    tags: ["arcade", "retro", "pixelart", "collecting", "adventure"]
  };

  return NextResponse.json({
    accountAssociation,
    frame
  });
}
