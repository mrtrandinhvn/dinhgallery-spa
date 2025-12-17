import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    input: 'http://localhost:32776/swagger/v1/swagger.json',
    output: 'src/client',
    plugins: ['@hey-api/client-axios'],
});