import type { Player } from "./player";
import type { ServerError } from "./error";

interface ErrorPayload {
    error: ServerError;
}

interface JoinPayload {
    join: {
        player: Player
    }
}

type Payload = ErrorPayload | JoinPayload;

export type { ErrorPayload, JoinPayload, Payload };
