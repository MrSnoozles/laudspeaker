import credentials from "../fixtures/credentials";
import signup from "../test-helpers/signup";
import { setupOrganization } from "../test-helpers/setupOrganization";
import { uploadCSV } from "../test-helpers/uploadCSV";
import { mapAttributesToNewFields } from "../test-helpers/mapAttributesToNewFields";
import {
  booleanSegments,
  createNewDynamicSegment,
  emailSegments,
  numberSegments,
  stringSegments,
} from "../test-helpers/createNewDynamicSegment";

const { email, password, firstName, lastName, organizationName, timeZone } =
  credentials;

describe("Segment Correctness", { retries: 2 }, () => {
  beforeEach(() => {
    cy.request(`${Cypress.env("TESTS_API_BASE_URL")}/tests/reset-tests`);
    cy.wait(1000);
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
    signup(email, password, firstName, lastName);
    cy.wait(1000);
  });

  it("works as expected", () => {
    setupOrganization(organizationName, timeZone);

    cy.wait(10000);
    cy.visit("/home");
    cy.wait(500);
    cy.url().should("include", "/home");

    uploadCSV("correctness_testing.csv", mapAttributesToNewFields, 0);

    // Create string segments
    stringSegments.forEach(createNewDynamicSegment);
    cy.wait(5000);

    // Create number segments
    numberSegments.forEach(createNewDynamicSegment);
    cy.wait(5000);

    // Create boolean segments
    booleanSegments.forEach(createNewDynamicSegment);
    cy.wait(5000);

    // create email segments
    emailSegments.forEach(createNewDynamicSegment);
    cy.wait(5000);

    // create date segments
    // FIXME: date comparisons are failing despite having users
    // matching the conditions
    // dateSegments.forEach(createNewDynamicSegment);
  });
});
