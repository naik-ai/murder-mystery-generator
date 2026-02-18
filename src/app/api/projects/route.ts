import { listProjects } from "@/lib/storage";

// GET - List all projects
export async function GET() {
  try {
    const projects = await listProjects();

    return new Response(JSON.stringify({ success: true, data: projects }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
