create extension if not exists pgcrypto;

create table if not exists public."AuditReport" (
  "id" text primary key default gen_random_uuid()::text,
  "slug" text not null unique,
  "createdAt" timestamptz not null default now(),
  "teamSize" integer not null,
  "primaryUseCase" text not null,
  "inputJson" jsonb not null,
  "auditJson" jsonb not null,
  "summary" text not null,
  "totalMonthlySavings" double precision not null,
  "totalAnnualSavings" double precision not null
);

create table if not exists public."Lead" (
  "id" text primary key default gen_random_uuid()::text,
  "reportId" text not null unique references public."AuditReport"("id") on delete cascade,
  "email" text not null,
  "companyName" text,
  "role" text,
  "teamSize" integer,
  "createdAt" timestamptz not null default now()
);
