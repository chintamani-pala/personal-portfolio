import { runner } from "../../../utils/agent-service";
import { toStructuredEvents } from "@google/adk";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { message, sessionId } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event, data) => {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        };

        try {
          const uId = "portfolio-user";
          const sId = sessionId || "default-session";

          // Ensure session is initialized in InMemorySessionService
          let session = await runner.sessionService.getSession({
            appName: runner.appName,
            userId: uId,
            sessionId: sId
          });

          if (!session) {
            await runner.sessionService.createSession({
              appName: runner.appName,
              userId: uId,
              sessionId: sId
            });
          }

          const events = runner.runAsync({
            userId: uId,
            sessionId: sId,
            newMessage: {
              role: "user",
              parts: [{ text: message }]
            }
          });

          for await (const event of events) {
            const structured = toStructuredEvents(event);
            for (const se of structured) {
              // Convert Error object to plain object for JSON serialization
              if (se.type === "error" && se.error) {
                se.error = {
                  message: se.error.message || String(se.error)
                };
              }
              sendEvent("agent_event", se);
            }
          }
        } catch (error) {
          sendEvent("error", { message: error.message || String(error) });
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
