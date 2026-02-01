import { z } from 'zod';
import { insertJobSchema, jobs } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  jobs: {
    list: {
      method: 'GET' as const,
      path: '/api/jobs',
      responses: {
        200: z.array(z.custom<typeof jobs.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/jobs/:id',
      responses: {
        200: z.custom<typeof jobs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/jobs',
      input: insertJobSchema,
      responses: {
        201: z.custom<typeof jobs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  profile: {
    get: {
      method: 'GET' as const,
      path: '/api/profile/:userId',
      responses: {
        200: z.object({
          user: z.custom<any>(),
          skills: z.array(z.custom<any>()),
          portfolio: z.array(z.custom<any>()),
          workExperience: z.array(z.custom<any>()),
        }),
        404: errorSchemas.notFound,
      },
    },
    addSkill: {
      method: 'POST' as const,
      path: '/api/profile/skills',
      input: z.object({ name: z.string() }),
      responses: {
        201: z.custom<any>(),
        401: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type JobInput = z.infer<typeof api.jobs.create.input>;
export type JobResponse = z.infer<typeof api.jobs.create.responses[201]>;
export type JobListResponse = z.infer<typeof api.jobs.list.responses[200]>;
