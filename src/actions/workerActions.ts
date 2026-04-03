import { apiGet, apiPatch, apiPost } from '@/actions/http/httpClient';
import { ApiEnvelope } from '@/types/api';
import {
  WorkerCertificateCreatePayload,
  WorkerCertificateUpdatePayload,
  WorkerProfilePayload,
  WorkerServicePayload,
  WorkerServiceUpdatePayload,
} from '@/types/auth';
import { toBearerToken } from '@/utils/token';

function unwrapData<T>(payload: T | ApiEnvelope<T>): T {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    const envelope = payload as ApiEnvelope<T>;
    return (envelope.data ?? ({} as T)) as T;
  }
  return payload as T;
}

export async function listWorkers<T = unknown>() {
  const response = await apiGet<ApiEnvelope<T>>('/worker', { auth: true });
  return unwrapData(response);
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
    },
  );
  return unwrapData(response);
}

export async function updateWorkerProfile(payload: Partial<WorkerProfilePayload>) {
  const response = await apiPatch<ApiEnvelope<unknown>, Partial<WorkerProfilePayload>>(
    '/worker/profile',
    payload,
    { auth: true },
  );
  return unwrapData(response);
}

export async function getWorkerStatus<T = unknown>() {
  const response = await apiGet<ApiEnvelope<T>>('/worker/status', { auth: true });
  return unwrapData(response);
}

export async function createWorkerServices(payload: WorkerServicePayload) {
  const response = await apiPost<ApiEnvelope<unknown>, WorkerServicePayload>(
    '/worker/services',
    payload,
    { auth: true },
  );
  return unwrapData(response);
}

export async function updateWorkerServices(payload: WorkerServiceUpdatePayload) {
  const response = await apiPatch<ApiEnvelope<unknown>, WorkerServiceUpdatePayload>(
    '/worker/services',
    payload,
    { auth: true },
  );
  return unwrapData(response);
}

export async function createWorkerCertificates(payload: WorkerCertificateCreatePayload) {
  const response = await apiPost<ApiEnvelope<unknown>, WorkerCertificateCreatePayload>(
    '/worker/certificates',
    payload,
    { auth: true },
  );
  return unwrapData(response);
}

export async function updateWorkerCertificates(payload: WorkerCertificateUpdatePayload) {
  const response = await apiPatch<ApiEnvelope<unknown>, WorkerCertificateUpdatePayload>(
    '/worker/certificates',
    payload,
    { auth: true },
  );
  return unwrapData(response);
}
