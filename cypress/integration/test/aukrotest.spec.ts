/// <reference types="cypress" />

import { chooseAuction, chooseBuyNow } from "./testFunctions";

describe("Filter and navigate items", function () {
  this.beforeAll(() => {
    Cypress.config().baseUrl = "https://aukro.cz";
  });
  beforeEach(() => {
    cy.visit("/");
  });

  it("Verify that the user is able to make a filter and click the middle item and check item details", () => {
    // Hover into Sběratelství option.
    cy.get(".nav-section.main-menu")
      .contains("Sběratelství")
      .trigger("mouseover");

    //Click on "Zlaté mince".
    cy.contains("Zlaté mince").click();
    //Verify that the browser has been redirected to zlate mince page.
    cy.url().should("include", "/zlate-mince-numismatika");

    //CLick on checkbox option 'Bezpečná Aukro platba' filter on left side.
    cy.get("#payment-via-aukro").click();

    // Wait for the mail pop-up till it appears, then close it.
    cy.get("#mat-dialog-0", { timeout: 90000 })
      .find("a")
      .first()
      .click({ force: true });

    /**
     * Check the number of products, if they are odd choose the middle one
     * if they are even choose random one
     */
    cy.get(".product-sorting")
      .find("list-card")
      .as("allItems")
      .then((listing) => {
        let totalItems = Cypress.$(listing).length;
        let selectItemIndex;
        totalItems % 2 == 1
          ? (selectItemIndex = Math.floor(totalItems / 2))
          : (selectItemIndex = Math.floor(
              Math.random() * Math.floor(totalItems)
            ));

        cy.get("@allItems")
          .eq(selectItemIndex - 1)
          .find(".product-header")
          .first()
          .click()
          .end();
      });

    cy.get(".flex-wrapper").then(($element) => {
      // Check if auktion only displayed or buy now option displayed or both of them
      const isBothButtonDisplayed =
        $element.find(".btn-primary.big.fluid").length === 2;
      const isAuctionDisplayed = $element.find("button #hand").length === 1;

      // if both buttons is displayed choose a random one and perform it's process
      if (isBothButtonDisplayed) {
        const buttons = ["Přihodit", "Přidat do košíku"];
        const chosenButton = Math.random() < 0.5 ? buttons[0] : buttons[1];
        cy.get("button").contains(
          `${Math.random() < 0.5 ? buttons[0] : buttons[1]}`
        );
        chosenButton === "Přihodit" ? chooseAuction() : chooseBuyNow();
      }
      // In case of just the Auction button is displayed Add 20% for the value and click Auction.
      else if (isAuctionDisplayed) {
        chooseAuction();
      } else {
        // In case if not both values or Auction then the buy now is one which is displayed
        chooseBuyNow();
      }
    });
  });
});
