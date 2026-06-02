import { faker } from "@faker-js/faker";

export const createUniqueBusinessName = () => `E2E ${faker.company.name()} ${Date.now()}`;

export const leadFactory = (overrides?: Record<string, unknown>) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email: faker.internet.email(),
    phone: faker.phone.number(),
    source: "WEB" as string,
    ...overrides,
  };
};

export const vehicleFactory = (overrides?: Record<string, unknown>) => ({
  brand: "Toyota",
  model: faker.vehicle.model(),
  version: "XLI",
  color: "Blanco",
  year: 2024,
  km: "0",
  condition: "0km",
  price: "25000000",
  status: "disponible" as string,
  ...overrides,
});

export const userFactory = (overrides?: Record<string, unknown>) => ({
  name: faker.person.firstName(),
  lastname: faker.person.lastName(),
  email: faker.internet.email(),
  password: "Test1234!",
  role: "VENDEDORA" as string,
  ...overrides,
});
