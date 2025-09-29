interface ServerError {
    code: number;
    codeString: string;
    message: string;   
}

const ErrorCode = {
    JOIN_FAILURE: 0
} as const;

export { ErrorCode };
export type { ServerError };
