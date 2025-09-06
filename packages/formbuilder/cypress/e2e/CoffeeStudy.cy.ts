describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/')
  })
});

it('testtest', function () {
  cy.visit('http://localhost:5173/')

});

it('Create Basic Form', function () {
  cy.visit('http://localhost:5173/')
  cy.get(':nth-child(2) > .inline-flex').click();
  cy.get('[placeholder="Shortform"]').click();
  cy.get('[placeholder="Shortform"]').clear();
  cy.get('[placeholder="Shortform"]').type('fr');
  cy.get('[placeholder="Language"]').clear();
  cy.get('[placeholder="Language"]').type('Franca');
  cy.get('[placeholder="Language"]').clear();
  cy.get('[placeholder="Language"]').type('Francais');
  cy.get('li.flex .inline-flex').click();
  cy.get('[data-cy="delete-button"]').click();
  cy.get('[data-cy="insert-button-0-0"]').click();
  // Select "group" from the dropdown
  cy.get('[data-cy="node-type-trigger"]').should('be.visible').click();
  cy.get('[data-cy="node-type-menu"]')
    .should('be.visible')
    .within(() => {
      cy.get('[data-cy="node-type-option-group"]').click();
    });
  cy.get('[data-cy="node-type-trigger"]').should('contain', 'group');
  // Give the group a name
  cy.get('[data-cy="field-name-input"]').type('General Information');
  // Add a label in English
  // cy.get('[data-cy="label-lang-input-0"]').type('en');
  cy.get('[data-cy="label-value-input-0"]').type('General Information');
  // Add a label in French
  // cy.get('[data-cy="label-lang-input-1"]').type('fr');
  cy.get('[data-cy="label-value-input-1"]').type('Informations Generales');
  // Save the group
  // cy.get('[data-cy="save-node-button"]').click();
  // Check that the group was added to the form
  // cy.get('[data-cy="form-preview"]').should('contain', 'General Information');
  // Add a hint in English
  cy.get('[data-cy="hint-value-input-0"]').type('General Information on the study subject');
  // Add a hint in French
  cy.get('[data-cy="hint-value-input-1"]').type('Informations Generales sur le sujet de l\'étude');
  //Scroll to save button and click it.
  cy.get('[data-cy="save-element-button"]').scrollIntoView().click().wait(500);
  // Check whether the form contains the group
  cy.get('[data-cy="formnode-0.General Information"]').should('exist');
  cy.get('[data-cy="labels"]').should('contain', 'General Information').should('contain', 'Informations Generales');
  cy.get('[data-cy="hints"]').should('contain', 'General Information').should('contain', 'Informations Generales');

  //-------------------------------
  //It adds child nodes with basic information to the group node.

  // Click the add node button inside the group
  cy.get('[data-cy="insert-button-1-0"]').click();
  // Select "text" from the dropdown
  cy.get('[data-cy="node-type-trigger"]').should('be.visible').click();
  cy.get('[data-cy="node-type-menu"]')
    .should('be.visible')
    .within(() => {
      cy.get('[data-cy="node-type-option-input"]').click();
    });
  cy.get('[data-cy="node-type-trigger"]').should('contain', 'input'); //
  // Give the text node a name
  cy.get('[data-cy="field-name-input"]').type('First Name');
  // Add a label in English
  // cy.get('[data-cy="label-lang-input-0"]').type('en');
  cy.get('[data-cy="label-value-input-0"]').type('First Name');
  // Add a label in French
  // cy.get('[data-cy="label-lang-input-1"]').type('fr');
  cy.get('[data-cy="label-value-input-1"]').type('Prénom');
  // Add a hint in English
  cy.get('[data-cy="hint-value-input-0"]').type('Enter the first name of the study subject');
  // Add a hint in French
  cy.get('[data-cy="hint-value-input-1"]').type('Entrez le prénom du sujet de l\'étude');
  // Scroll to save button and click it.
  cy.get('[data-cy="save-element-button"]').scrollIntoView().click().wait(500);
  // Check that the text node was added to the group
  cy.get('[data-cy="formnode-0.First Name"]').should('exist');
  cy.get('[data-cy="labels"]').should('contain', 'First Name').should('contain', 'Prénom');
  // cy.get('[data-cy="hints"]').should('contain', 'Enter the first name of the study subject').should('contain', 'Entrez le prénom du sujet de l\'étude');
  // Readd hint check

  // Add another child node to the group
  cy.get('[data-cy="insert-button-1-1"]').click();
  // Select "number" from the dropdown
  cy.get('[data-cy="node-type-trigger"]').should('be.visible').click();
  cy.get('[data-cy="node-type-menu"]')
    .should('be.visible')
    .within(() => {
      cy.get('[data-cy="node-type-option-input"]').click();
    });
  // cy.get('[data-cy="node-type-trigger"]').should('contain', 'number'); //
  // Select the bind type number
  cy.get('[data-cy="bind-type-trigger"]').scrollIntoView().click();
  cy.get('[data-cy="bind-type-menu"]')
    .should('be.visible')
    .within(() => {
      cy.get('[data-cy="bind-type-option-int"]').click();
    });
  // Give the number node a name
  cy.get('[data-cy="field-name-input"]').type('Age');
  // Add a label in English
  // cy.get('[data-cy="label-lang-input-0"]').type('en');
  cy.get('[data-cy="label-value-input-0"]').type('Age');
  // Add a label in French
  // cy.get('[data-cy="label-lang-input-1"]').type('fr');
  cy.get('[data-cy="label-value-input-1"]').type('Âge');
  // Add a hint in English
  cy.get('[data-cy="hint-value-input-0"]').type('Enter the age of the study subject');
  // Add a hint in French
  cy.get('[data-cy="hint-value-input-1"]').type('Entrez l\'âge du sujet de l\'étude');
  // Scroll to save button and click it.
  cy.get('[data-cy="save-element-button"]').scrollIntoView().click().wait(500);
  // Check that the number node was added to the group
  cy.get('[data-cy="formnode-1.Age"]').should('exist');
  cy.get('[data-cy="labels"]').should('contain', 'Age').should('contain', 'Âge');
  // cy.get('[data-cy="hints"]').should('contain', 'Enter the age of the study subject').should('contain', 'Entrez l\'âge du sujet de l\'étude');
  //Readd hints checks
  //-------------------------------
  // Add question about coffee consumption with options.
  // Click the add node button outside the group
  cy.get('[data-cy="insert-button-1-0"]').click();
  // Select "single-select" from the dropdown
  cy.get('[data-cy="node-type-trigger"]').should('be.visible').click();
  cy.get('[data-cy="node-type-menu"]')
    .should('be.visible')
    .within(() => {
      cy.get('[data-cy="node-type-option-select1"]').click();
    });
  cy.get('[data-cy="node-type-trigger"]').should('contain', 'select1'); //
  // Give the single-select node a name
  cy.get('[data-cy="field-name-input"]').type('Coffee Consumption');
  // Add a label in English
  // cy.get('[data-cy="label-lang-input-0"]').type('en');
  cy.get('[data-cy="label-value-input-0"]').type('Coffee Consumption');
  // Add a label in French
  // cy.get('[data-cy="label-lang-input-1"]').type('fr');
  cy.get('[data-cy="label-value-input-1"]').type('Consommation de café');
  // Add a hint in English
  cy.get('[data-cy="hint-value-input-0"]').type('Select your coffee consumption frequency');
  // Add a hint in French
  cy.get('[data-cy="hint-value-input-1"]').type('Sélectionnez votre fréquence de consommation de café');

  // Add options to the single-select node
  const options = [
    { value: 'never', labels: { en: 'Never', fr: 'Jamais' } },
    { value: 'occasionally', labels: { en: 'Occasionally', fr: 'Occasionnellement' } },
    { value: 'daily', labels: { en: 'Daily', fr: 'Quotidiennement' } },
    { value: 'multiple-times-a-day', labels: { en: 'Multiple times a day', fr: 'Plusieurs fois par jour' } }
  ];

  options.forEach((option, index) => {
    // Click the add option button
    cy.get('[data-cy="item-add-button"]').click();
    // Add option value
    cy.get(`[data-cy="item-value-input-${index}"]`).type(option.value);
    // Add option label in English
    // cy.get(`[data-cy="option-label-lang-input-${index}-0"]`).type('en');
    cy.get(`[data-cy="item-label-value-input-${index}-0"]`).type(option.labels.en);
    // Add option label in French
    // cy.get(`[data-cy="option-label-lang-input-${index}-1"]`).type('fr');
    cy.get(`[data-cy="item-label-value-input-${index}-1"]`).type(option.labels.fr);
  });
  cy.get('[data-cy="bind-type-trigger"]').scrollIntoView().click();
  cy.get('[data-cy="bind-type-menu"]')
    .should('be.visible')
    .within(() => {
      cy.get('[data-cy="bind-type-option-select1"]').click();
    });
  cy.get('[data-cy="save-element-button"]').scrollIntoView().click().wait(500);
  // Check that the single-select node was added to the form
  cy.get('[data-cy="formnode-0.Coffee Consumption"]').should('exist');
  cy.get('[data-cy="labels"]').should('contain', 'Coffee Consumption').should('contain', 'Consommation de café');
  // cy.get('[data-cy="hints"]').should('contain', 'Select your coffee consumption frequency').should('contain', 'Sélectionnez votre fréquence de consommation de café');

  //-------------------------------

  // Add a boolean field on whther the person is a smoker
  cy.get('[data-cy="insert-button-1-3"]').click();
  // Select "boolean" from the dropdown
  cy.get('[data-cy="node-type-trigger"]').should('be.visible').click();
  cy.get('[data-cy="node-type-menu"]')
    .should('be.visible')
    .within(() => {
      cy.get('[data-cy="node-type-option-select1"]').click();
    });
  cy.get('[data-cy="node-type-trigger"]').should('contain', 'select1'); //
  // Give the boolean node a name
  cy.get('[data-cy="field-name-input"]').type('Smoker');
  // Add a label in English
  // cy.get('[data-cy="label-lang-input-0"]').type('en');
  cy.get('[data-cy="label-value-input-0"]').type('Smoker');
  // Add a label in French
  // cy.get('[data-cy="label-lang-input-1"]').type('fr');
  cy.get('[data-cy="label-value-input-1"]').type('Fumeur');
  // Add a hint in English
  cy.get('[data-cy="hint-value-input-0"]').type('Are you a smoker?');
  // Add a hint in French
  cy.get('[data-cy="hint-value-input-1"]').type('Êtes-vous fumeur?');
  cy.get('[data-cy="bind-type-trigger"]').scrollIntoView().click();
  cy.get('[data-cy="bind-type-menu"]')
    .should('be.visible')
    .within(() => {
      cy.get('[data-cy="bind-type-option-select1"]').click();
    });
  //Add Items for yes and no
  const boolOptions = [
    { value: 'yes', labels: { en: 'Yes', fr: 'Oui' } },
    { value: 'no', labels: { en: 'No', fr: 'Non' } }
  ];

  boolOptions.forEach((option, index) => {
    // Click the add option button
    cy.get('[data-cy="item-add-button"]').click();
    // Add option value
    cy.get(`[data-cy="item-value-input-${index}"]`).type(option.value);
    // Add option label in English
    // cy.get(`[data-cy="option-label-lang-input-${index}-0"]`).type('en');
    cy.get(`[data-cy="item-label-value-input-${index}-0"]`).type(option.labels.en);
    // Add option label in French
    // cy.get(`[data-cy="option-label-lang-input-${index}-1"]`).type('fr');
    cy.get(`[data-cy="item-label-value-input-${index}-1"]`).type(option.labels.fr);
  });
  // Scroll to save button and click it.
  cy.get('[data-cy="save-element-button"]').scrollIntoView().click().wait(500);
  // Check that the boolean node was added to the form
  cy.get('[data-cy="formnode-3.Smoker"]').should('exist');
  cy.get('[data-cy="labels"]').should('contain', 'Smoker').should('contain', 'Fumeur');
  // cy.get('[data-cy="hints"]').should('contain', 'Are you a smoker?').should('contain', 'Êtes-vous fumeur?');

  //-------------------------------
  // Add a select field on which cigarette brands they consume
  cy.get('[data-cy="insert-button-1-4"]').click();
  // Select "multi-select" from the dropdown
  cy.get('[data-cy="node-type-trigger"]').should('be.visible').click();
  cy.get('[data-cy="node-type-menu"]')
    .should('be.visible')
    .within(() => {
      cy.get('[data-cy="node-type-option-select"]').click();
    });
  cy.get('[data-cy="node-type-trigger"]').should('contain', 'select'); //
  // Give the multi-select node a name
  cy.get('[data-cy="field-name-input"]').type('Cigarette Brand');
  // Add a label in English
  // cy.get('[data-cy="label-lang-input-0"]').type('en');
  cy.get('[data-cy="label-value-input-0"]').type('Cigarette Brand');
  // Add a label in French
  // cy.get('[data-cy="label-lang-input-1"]').type('fr');
  cy.get('[data-cy="label-value-input-1"]').type('Marque de cigarettes');
  // Add a hint in English
  cy.get('[data-cy="hint-value-input-0"]').type('Select your preferred cigarette brands');
  // Add a hint in French
  cy.get('[data-cy="hint-value-input-1"]').type('Sélectionnez vos marques de cigarettes préférées');

  // Add options to the multi-select node
  const brands = [
    { value: 'brand-a', labels: { en: 'Brand A', fr: 'Marque A' } },
    { value: 'brand-b', labels: { en: 'Brand B', fr: 'Marque B' } },
    { value: 'brand-c', labels: { en: 'Brand C', fr: 'Marque C' } },
    { value: 'brand-d', labels: { en: 'Brand D', fr: 'Marque D' } }
  ];

  brands.forEach((brand, index) => {
    // Click the add option button
    cy.get('[data-cy="item-add-button"]').click();
    // Add option value
    cy.get(`[data-cy="item-value-input-${index}"]`).type(brand.value);
    // Add option label in English
    // cy.get(`[data-cy="option-label-lang-input-${index}-0"]`).type('en');
    cy.get(`[data-cy="item-label-value-input-${index}-0"]`).type(brand.labels.en);
    // Add option label in French
    // cy.get(`[data-cy="option-label-lang-input-${index}-1"]`).type('fr');
    cy.get(`[data-cy="item-label-value-input-${index}-1"]`).type(brand.labels.fr);
  });
  cy.get('[data-cy="bind-type-trigger"]').scrollIntoView().click();
  cy.get('[data-cy="bind-type-menu"]')
    .should('be.visible')
    .within(() => {
      cy.get('[data-cy="bind-type-option-select"]').click();
    });

  //Question shoul only be relevant if smoker question is yes

  // Scroll to save button and click it.
  cy.get('[data-cy="save-element-button"]').scrollIntoView().click().wait(500);
  // Check that the multi-select node was added to the form
  cy.get('[data-cy="formnode-4.Cigarette Brand"]').should('exist');
  cy.get('[data-cy="labels"]').should('contain', 'Cigarette Brand').should('contain', 'Marque de cigarettes');
  // cy.get('[data-cy="hints"]').should('contain', 'Select your preferred cigarette brands').should('contain', 'Sélectionnez vos marques de cigarettes préférées');


});

it('improvtest', function() {
  cy.visit('http://localhost:5173')
  
});

