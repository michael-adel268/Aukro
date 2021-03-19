//  A fuction which add 20% to the price value and then click on auction
export function chooseAuction() {
  cy.get(".form-element input")
    .as("price")
    .invoke("attr", "min")
    .then((value) => {
      const newPrice = ((1 + 0.2) * Number(value)).toFixed(2);
      cy.get("@price").type(newPrice);
    });

  cy.get("button #hand").click();

  //Verify that register page with button 'Přihlásit se' be visible
  cy.get("login", { timeout: 60000 })
    .contains("Přihlásit se")
    .should("be.visible");
}

// A function that click on add item to cart and check that the cart has been updated by one item.
export function chooseBuyNow() {
  cy.get("button").contains("Přidat do košíku").click();

  cy.wait(3000);
  //Verify the product in cart
  cy.get(".material-icons.toggle-on-touch")
    .invoke("attr", "data-count")
    .then((value) => {
      expect(value, "The selected item hasn't been added to the cart").equal(
        "1"
      );
    });
}
