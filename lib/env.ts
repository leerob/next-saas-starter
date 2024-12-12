import {z} from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
    POSTGRES_URL: z.string().url('POSTGRES_URL must be a valid URL.'),
    STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required.'),
    STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required.'),
    BASE_URL: z.string().url('BASE_URL must be a valid URL.').refine(url => url.startsWith('http'), {
        message: 'BASE_URL must start with http or https.',
    }),
    AUTH_SECRET: z.string().min(1, 'AUTH_SECRET is required.'),
});

// Type definition for inferred schema
type EnvSchema = z.infer<typeof envSchema>;

export class EnvValidator {
    private readonly env: EnvSchema;

    constructor() {
        this.env = this.validateEnv();
    }

    private validateEnv(): EnvSchema {
        const envValues = {...process.env};

        // Parse the environment variables using the schema
        const result = envSchema.safeParse(envValues);

        if (!result.success) {
            this.handleValidationErrors(result.error);
        }

        return <EnvSchema>result.data;
    }

    private handleValidationErrors(error: z.ZodError): void {
        const errorMessages = error.issues.map(issue => `${issue.path.join('.')} - ${issue.message}`);

        console.error("❌ Invalid environment variables:\n", errorMessages.join('\n'));

        // Stop all scripts by exiting the process
        process.exit(1);
    }

    // Get the validated environment variables
    public get(): EnvSchema {
        return this.env;
    }
}

// Instantiate the EnvValidator to validate env variables on startup
const envValidator = new EnvValidator();
export const env = envValidator.get();
