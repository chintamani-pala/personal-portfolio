const { BaseLlm } = require("@google/adk");

class LiteLlm extends BaseLlm {
  constructor({ model, apiKey, baseUrl }) {
    super({ model });
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async *generateContentAsync(llmRequest, stream = false, abortSignal) {
    this.maybeAppendUserContent(llmRequest);

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.apiKey}`
    };

    const messages = [];

    // Map system instruction if present
    if (llmRequest.config && llmRequest.config.systemInstruction) {
      messages.push({
        role: "system",
        content: llmRequest.config.systemInstruction
      });
    }

    // Convert Gemini format contents to OpenAI format messages
    for (const content of llmRequest.contents) {
      const role = content.role === "model" ? "assistant" : "user";
      const message = {
        role,
        content: ""
      };

      for (const part of content.parts) {
        if (part.text) {
          message.content += part.text;
        }
        if (part.functionCall) {
          if (!message.tool_calls) {
            message.tool_calls = [];
          }
          message.tool_calls.push({
            id: part.functionCall.id || `call_${Math.random().toString(36).substr(2, 9)}`,
            type: "function",
            function: {
              name: part.functionCall.name,
              arguments: typeof part.functionCall.args === "string"
                ? part.functionCall.args
                : JSON.stringify(part.functionCall.args)
            }
          });
        }
        if (part.functionResponse) {
          messages.push({
            role: "tool",
            tool_call_id: part.functionResponse.id || part.functionResponse.name,
            name: part.functionResponse.name,
            content: typeof part.functionResponse.response === "string"
              ? part.functionResponse.response
              : JSON.stringify(part.functionResponse.response)
          });
        }
      }

      if (message.content || message.tool_calls) {
        messages.push(message);
      }
    }

    // Map Gemini tools to OpenAI tools
    const tools = [];
    if (llmRequest.config && llmRequest.config.tools) {
      for (const toolGroup of llmRequest.config.tools) {
        if (toolGroup.functionDeclarations) {
          for (const dec of toolGroup.functionDeclarations) {
            tools.push({
              type: "function",
              function: {
                name: dec.name,
                description: dec.description,
                parameters: dec.parameters
              }
            });
          }
        }
      }
    }

    let response_format;
    if (llmRequest.config && (llmRequest.config.responseMimeType === "application/json" || llmRequest.config.responseSchema)) {
      response_format = { type: "json_object" };
    }

    const requestBody = {
      model: this.model,
      messages,
      temperature: 0.1, // low temperature for structured task execution
      stream
    };

    if (tools.length > 0) {
      requestBody.tools = tools;
    }
    if (response_format) {
      requestBody.response_format = response_format;
    }

    if (stream) {
      const fetchRes = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
        signal: abortSignal
      });

      if (!fetchRes.ok) {
        const errText = await fetchRes.text();
        throw new Error(`LiteLLM stream request failed: ${errText}`);
      }

      const reader = fetchRes.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const accumulatedToolCalls = [];

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop();

          for (const line of lines) {
            const cleaned = line.trim();
            if (!cleaned) continue;
            if (cleaned === "data: [DONE]") continue;
            if (cleaned.startsWith("data: ")) {
              const jsonStr = cleaned.slice(6);
              try {
                const parsed = JSON.parse(jsonStr);
                const choice = parsed.choices?.[0];
                const delta = choice?.delta;
                if (!delta) continue;

                const parts = [];
                if (delta.content) {
                  parts.push({ text: delta.content });
                }

                if (delta.tool_calls) {
                  for (const tc of delta.tool_calls) {
                    if (!accumulatedToolCalls[tc.index]) {
                      accumulatedToolCalls[tc.index] = {
                        id: tc.id,
                        name: tc.function?.name || "",
                        arguments: tc.function?.arguments || ""
                      };
                    } else {
                      if (tc.id) accumulatedToolCalls[tc.index].id = tc.id;
                      if (tc.function?.name) accumulatedToolCalls[tc.index].name += tc.function.name;
                      if (tc.function?.arguments) accumulatedToolCalls[tc.index].arguments += tc.function.arguments;
                    }
                  }
                }

                if (parts.length > 0) {
                  yield {
                    content: {
                      role: "model",
                      parts
                    },
                    finishReason: choice.finish_reason === "stop" ? "STOP" : choice.finish_reason
                  };
                }
              } catch (e) {
                // Ignore partial chunk parse issues
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      if (accumulatedToolCalls.length > 0) {
        const parts = accumulatedToolCalls.map(tc => {
          let args = {};
          try {
            args = JSON.parse(tc.arguments);
          } catch (e) {
            args = tc.arguments;
          }
          return {
            functionCall: {
              id: tc.id,
              name: tc.name,
              args
            }
          };
        });

        yield {
          content: {
            role: "model",
            parts
          },
          finishReason: "STOP"
        };
      }
    } else {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
        signal: abortSignal
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`LiteLLM request failed: ${errText}`);
      }

      const resData = await response.json();
      const choice = resData.choices[0];
      const choiceMessage = choice.message;

      const candidateParts = [];
      if (choiceMessage.content) {
        candidateParts.push({ text: choiceMessage.content });
      }
      if (choiceMessage.tool_calls) {
        for (const tc of choiceMessage.tool_calls) {
          candidateParts.push({
            functionCall: {
              id: tc.id,
              name: tc.function.name,
              args: JSON.parse(tc.function.arguments)
            }
          });
        }
      }

      yield {
        content: {
          role: "model",
          parts: candidateParts
        },
        finishReason: choice.finish_reason === "stop" ? "STOP" : choice.finish_reason
      };
    }
  }
}

module.exports = { LiteLlm };
