import { apiGet, apiPatch, apiPost } from '@/actions/http/httpClient';
import { ApiEnvelope } from '@/types/api';
import {
  CategoryService,
  CategoriesQuery,
  ServiceCategory,
  ServiceSubcategory,
  WorkerCertificateCreatePayload,
  WorkerCertificateUpdatePayload,
  WorkerProfilePayload,
  WorkerStatusData,
  WorkerServicePayload,
  WorkerServiceUpdatePayload,
} from '@/types/auth';
import { toBearerToken } from '@/utils';

function unwrapData<T>(payload: T | ApiEnvelope<T>): T {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    const envelope = payload as ApiEnvelope<T>;
    return (envelope.data ?? ({} as T)) as T;
  }
  return payload as T;
}

type RawServiceSubcategory = Omit<ServiceSubcategory, 'services'> & {
  services?: CategoryService[];
};

type RawServiceCategory = Omit<ServiceCategory, 'subcategories'> & {
  subcategories?: RawServiceSubcategory[];
  subCategories?: RawServiceSubcategory[];
};

function normalizeCategory(category: RawServiceCategory): ServiceCategory {
  const normalizedSubcategories = category.subcategories ?? category.subCategories ?? [];
  return {
    ...category,
    subcategories: normalizedSubcategories.map(subcategory => ({
      ...subcategory,
      services: Array.isArray(subcategory.services) ? subcategory.services : [],
    })),
  };
}

export async function listWorkers<T = unknown>() {
  const response = await apiGet<ApiEnvelope<T>>('/worker', { auth: true });
  return unwrapData(response);
}

function toQueryString(query: CategoriesQuery) {
  const params = new URLSearchParams();
  params.set('city', query.city);
  if (typeof query.includeSubcategory === 'boolean') {
    params.set('includeSubcategory', String(query.includeSubcategory));
  }
  if (typeof query.includeServices === 'boolean') {
    params.set('includeServices', String(query.includeServices));
  }
  if (typeof query.includePriceOptions === 'boolean') {
    params.set('includePriceOptions', String(query.includePriceOptions));
  }
  if (typeof query.includeTask === 'boolean') {
    params.set('includeTask', String(query.includeTask));
  }
  return params.toString();
}

export async function getCategories(query: CategoriesQuery): Promise<ServiceCategory[]> {
  const qs = toQueryString(query);
  const response = await apiGet<ApiEnvelope<RawServiceCategory[]>>(`/categories?${qs}`);
  const data = unwrapData(response);
  if (!Array.isArray(data)) return [];
  return data.map(normalizeCategory);
}

export async function getWorkerById<T = unknown>(id: string) {
  const response = await apiGet<ApiEnvelope<T>>(`/worker/${id}`, { auth: true });
  return unwrapData(response);
}

export async function createWorkerProfile(payload: WorkerProfilePayload, phoneToken: string) {
  const response = await apiPost<ApiEnvelope<unknown>, WorkerProfilePayload>(
    '/worker/profile',
    payload,
    {
      headers: {
        Authorization: toBearerToken(phoneToken),
      },
      toast: {
        successTitle: 'Profile Created',
        successMessage: 'Worker profile has been created successfully.',
        errorTitle: 'Profile Creation Failed',
      },
    },
  );
  return unwrapData(response);
}

export async function updateWorkerProfile(payload: Partial<WorkerProfilePayload>) {
  const response = await apiPatch<ApiEnvelope<unknown>, Partial<WorkerProfilePayload>>(
    '/worker/profile',
    payload,
    {
      auth: true,
      toast: {
        successTitle: 'Profile Updated',
        successMessage: 'Worker profile changes were saved.',
        errorTitle: 'Profile Update Failed',
      },
    },
  );
  return unwrapData(response);
}

export async function getWorkerStatus<T = WorkerStatusData>() {
  const response = await apiGet<ApiEnvelope<T>>('/worker/status', { auth: true });
  return unwrapData(response);
}

export async function createWorkerServices(payload: WorkerServicePayload) {
  const response = await apiPost<ApiEnvelope<unknown>, WorkerServicePayload>(
    '/worker/services',
    payload,
    {
      auth: true,
      toast: {
        successTitle: 'Services Saved',
        successMessage: 'Worker service mappings were updated.',
        errorTitle: 'Service Save Failed',
      },
    },
  );
  return unwrapData(response);
}

export async function updateWorkerServices(payload: WorkerServiceUpdatePayload) {
  const response = await apiPatch<ApiEnvelope<unknown>, WorkerServiceUpdatePayload>(
    '/worker/services',
    payload,
    {
      auth: true,
      toast: {
        successTitle: 'Service Updated',
        successMessage: 'Worker service mapping has been updated.',
        errorTitle: 'Service Update Failed',
      },
    },
  );
  return unwrapData(response);
}

export async function createWorkerCertificates(payload: WorkerCertificateCreatePayload) {
  const response = await apiPost<ApiEnvelope<unknown>, WorkerCertificateCreatePayload>(
    '/worker/certificates',
    payload,
    {
      auth: true,
      toast: {
        successTitle: 'Certificate Added',
        successMessage: 'Worker certificate has been saved.',
        errorTitle: 'Certificate Save Failed',
      },
    },
  );
  return unwrapData(response);
}

export async function updateWorkerCertificates(payload: WorkerCertificateUpdatePayload) {
  const response = await apiPatch<ApiEnvelope<unknown>, WorkerCertificateUpdatePayload>(
    '/worker/certificates',
    payload,
    {
      auth: true,
      toast: {
        successTitle: 'Certificate Updated',
        successMessage: 'Worker certificate was updated successfully.',
        errorTitle: 'Certificate Update Failed',
      },
    },
  );
  return unwrapData(response);
}
