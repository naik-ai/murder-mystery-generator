import { NextRequest } from "next/server";
import { generateMystery, GenerationEvent } from "@/lib/agents";
import { GenerationSettings } from "@/lib/types";
import { saveProject } from "@/lib/storage";

// SSE helper to create a readable stream
function createSSEStream(
  generator: AsyncGenerator<GenerationEvent>
): ReadableStream {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of generator) {
          // Format as SSE
          const data = JSON.stringify(event);
          const sseMessage = `event: generation\ndata: ${data}\n\n`;
          controller.enqueue(encoder.encode(sseMessage));

          // If complete, save the project
          if (event.type === "complete" && event.data) {
            const { project } = event.data as { project: unknown };
            try {
              await saveProject(project as Parameters<typeof saveProject>[0]);
            } catch (saveError) {
              console.error("Failed to save project:", saveError);
            }
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        const errorEvent: GenerationEvent = {
          type: "error",
          message: `Stream error: ${errorMessage}`,
          progress: 0,
          error: errorMessage,
        };
        const data = JSON.stringify(errorEvent);
        controller.enqueue(encoder.encode(`event: generation\ndata: ${data}\n\n`));
      } finally {
        controller.close();
      }
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = body as GenerationSettings;

    // Validate required fields
    if (!settings.theme || !settings.playerCount || !settings.murderMethod) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required settings fields",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create the generation stream
    const generator = generateMystery(settings);
    const stream = createSSEStream(generator);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Health check
export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Generation API ready",
      hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
