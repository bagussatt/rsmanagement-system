import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const description = `
You can find the list of available endpoints and their descriptions here.
`;

export function useSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription(description)
    .addBearerAuth()
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'API Documentation',
  });
}
