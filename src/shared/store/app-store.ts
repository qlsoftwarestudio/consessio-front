import { create } from "zustand";
import { persist } from "zustand/middleware";
import { env } from "@/shared/config/env";
import {
  seedActivities,
  seedLeads,
  seedMembers,
  seedOrganization,
  seedQuotations,
  seedTestDrives,
  seedVehicles,
} from "@/shared/data/seed";
import type {
  Activity,
  Lead,
  LeadStatus,
  Member,
  Organization,
  Quotation,
  TestDrive,
  Vehicle,
} from "@/shared/types/domain";

interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  organizationId: string;
  role?: string;
  tenantId?: number;
}

interface AppState {
  // session
  user: SessionUser | null;
  organization: Organization | null;

  // entities
  members: Member[];
  leads: Lead[];
  vehicles: Vehicle[];
  quotations: Quotation[];
  testDrives: TestDrive[];
  activities: Activity[];

  // actions
  signIn: (email: string, fullName?: string, extras?: { role?: string; tenantId?: number; userId?: string | number }) => void;
  signOut: () => void;
  createOrganization: (name: string, brands: string[]) => void;

  addLead: (lead: Omit<Lead, "id" | "organizationId" | "createdAt" | "updatedAt" | "status"> & { status?: LeadStatus }) => Lead;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  setLeadStatus: (id: string, status: LeadStatus) => void;

  addVehicle: (v: Omit<Vehicle, "id" | "organizationId">) => void;
  addQuotation: (q: Omit<Quotation, "id" | "organizationId" | "createdAt">) => Quotation;
  addTestDrive: (t: Omit<TestDrive, "id" | "organizationId" | "status">) => TestDrive;
  addMember: (m: Omit<Member, "id" | "organizationId">) => void;

  pushActivity: (a: Omit<Activity, "id" | "organizationId" | "createdAt">) => void;
}

const id = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      organization: null,
      members: [],
      leads: [],
      vehicles: [],
      quotations: [],
      testDrives: [],
      activities: [],

      signIn: (email, fullName, extras) => {
        const hasOrg = get().organization;
        if (env.useMockApi && !hasOrg) {
          // bootstrap demo data only in mock mode and if first sign-in
          set({
            organization: seedOrganization,
            members: seedMembers,
            leads: seedLeads,
            vehicles: seedVehicles,
            quotations: seedQuotations,
            testDrives: seedTestDrives,
            activities: seedActivities,
          });
        } else if (!env.useMockApi && !hasOrg && extras?.tenantId) {
          // En modo real, si el usuario tiene tenantId pero no hay org en el store,
          // creamos una organización mínima para evitar redirección a /onboarding.
          // FIXME: Idealmente el backend debería devolver datos de la org en login
          // o debería existir un endpoint GET /organization para obtenerlos.
          const orgId = String(extras.tenantId);
          set({
            organization: {
              id: orgId,
              name: "",
              brands: [],
              createdAt: new Date().toISOString(),
            },
          });
        }
        const org = get().organization;
        set({
          user: {
            id: extras?.userId ? String(extras.userId) : "u-current",
            email,
            fullName: fullName || email.split("@")[0] || "Usuario",
            organizationId: org?.id ?? "org-unknown",
            role: extras?.role,
            tenantId: extras?.tenantId,
          },
        });
      },

      signOut: () => set({ user: null }),

      createOrganization: (name, brands) => {
        const org: Organization = {
          id: `org-${id()}`,
          name,
          brands,
          createdAt: new Date().toISOString(),
        };
        const currentUser = get().user;
        set({
          organization: org,
          user: currentUser ? { ...currentUser, organizationId: org.id } : null,
          members: currentUser
            ? [
                {
                  id: "m-owner",
                  organizationId: org.id,
                  fullName: currentUser.fullName,
                  email: currentUser.email,
                  role: "ADMIN_SISTEMA",
                },
              ]
            : [],
          leads: [],
          vehicles: [],
          quotations: [],
          testDrives: [],
          activities: [],
        });
      },

      addLead: (input) => {
        const orgId = get().organization!.id;
        const lead: Lead = {
          id: `l-${id()}`,
          organizationId: orgId,
          status: input.status ?? "new",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...input,
        };
        set((s) => ({ leads: [lead, ...s.leads] }));
        get().pushActivity({
          leadId: lead.id,
          type: "lead_created",
          message: `Nuevo lead: ${lead.fullName}`,
          actorId: get().user?.id,
        });
        return lead;
      },

      updateLead: (id, patch) =>
        set((s) => ({
          leads: s.leads.map((l) => (l.id === id ? { ...l, ...patch, updatedAt: new Date().toISOString() } : l)),
        })),

      setLeadStatus: (id, status) => {
        set((s) => ({
          leads: s.leads.map((l) => (l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l)),
        }));
        get().pushActivity({
          leadId: id,
          type: "status_changed",
          message: `Estado actualizado a ${status}`,
          actorId: get().user?.id,
        });
      },

      addVehicle: (v) => {
        const orgId = get().organization!.id;
        set((s) => ({
          vehicles: [{ id: `v-${id()}`, organizationId: orgId, ...v }, ...s.vehicles],
        }));
      },

      addQuotation: (q) => {
        const orgId = get().organization!.id;
        const quot: Quotation = {
          id: `q-${id()}`,
          organizationId: orgId,
          createdAt: new Date().toISOString(),
          ...q,
        };
        set((s) => ({ quotations: [quot, ...s.quotations] }));
        get().pushActivity({
          leadId: q.leadId,
          type: "quotation",
          message: `Cotización ${q.type} creada`,
          actorId: get().user?.id,
        });
        return quot;
      },

      addTestDrive: (t) => {
        const orgId = get().organization!.id;
        const td: TestDrive = {
          id: `t-${id()}`,
          organizationId: orgId,
          status: "agendado",
          ...t,
        };
        set((s) => ({ testDrives: [td, ...s.testDrives] }));
        get().pushActivity({
          leadId: t.leadId,
          type: "test_drive_agendado",
          message: `Test drive agendado`,
          actorId: get().user?.id,
        });
        return td;
      },

      addMember: (m) => {
        const orgId = get().organization!.id;
        set((s) => ({
          members: [...s.members, { id: `m-${id()}`, organizationId: orgId, ...m }],
        }));
      },

      pushActivity: (a) => {
        const orgId = get().organization?.id;
        if (!orgId) return;
        set((s) => ({
          activities: [
            { id: `a-${id()}`, organizationId: orgId, createdAt: new Date().toISOString(), ...a },
            ...s.activities,
          ].slice(0, 200),
        }));
      },
    }),
    {
      name: "concessio-store-v1",
    },
  ),
);
