import credentials from "../fixtures/credentials";
import signup from "../test-helpers/signup";
import { loginFunc } from "../test-helpers/loginFunc";

const { email, password, firstName, lastName } = credentials;

describe("login", () => {
  beforeEach(() => {
    cy.request(`${Cypress.env("TESTS_API_BASE_URL")}/tests/reset-tests`);
    cy.wait(1000);
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
    signup(email, password, firstName, lastName);
    cy.wait(1000);
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
  });

  it("passes", () => {
    loginFunc(email, password);
    cy.wait(10000);
    cy.url().should("include", "/company-setup");
    /*
    cy.url().then((url: string) => {  
      expect(url).to.satisfy((url: string) =>  
        url.includes("/company-setup") || 
        url.includes("/payment-gate") || 
        url.includes("/verify-email")
      );
    });
    */
  });
});
