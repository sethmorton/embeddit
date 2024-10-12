import seed from "./seed";
import { NextResponse } from "next/server";
import { ServerlessSpecCloudEnum } from "@pinecone-database/pinecone";

export const runtime = "edge";

export async function POST(req: Request) {
  const { subreddit, options } = await req.json();
  try {
    const documents = await seed(
      subreddit,
      10, // You can adjust this limit as needed
      process.env.PINECONE_INDEX!,
      (process.env.PINECONE_CLOUD as ServerlessSpecCloudEnum) || "aws",
      process.env.PINECONE_REGION || "us-west-2",
      options,
      (progress) => {
        console.log("progress", progress);
        return NextResponse.json({ progress });
      }
    );
    console.log("documents", documents);
    return NextResponse.json({ success: true, documents });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed seeding Reddit posts",
    });
  }
}
