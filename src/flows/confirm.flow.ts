import { addKeyword } from "@builderbot/bot";

export const confirmFlow = addKeyword(["si", "no"]).addAnswer(
  "¿Necesitas que te ayude con algo mas?",
  { capture: true }
);
