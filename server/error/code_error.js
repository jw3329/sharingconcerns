class CodeError extends Error {
    constructor(code, ...params) {
        super(params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CodeError);
        }

        this.name = 'CodeError';
        // Custom debugging information
        this.code = code;
    }
}